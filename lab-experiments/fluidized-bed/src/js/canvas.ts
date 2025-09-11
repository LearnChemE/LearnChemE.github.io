import { VertexAttribute } from "../types";
import { CreateShader, CreateTexture, CreateUBO, CreateVao, SetUBO } from "./helpers";
import { bgFragSrc, bgVertSrc, dummyFragSrc, particleRenderFragSrc, particleRenderVertSrc, particleUpdateVertSrc, repackedVertSrc } from "./shaders";
import State from "./state";
import noise from "../media/noiseTexture.png";

/**
 * Wrapper class around Float32Array to mimic buffer payload
 */
class UniformBuffer {
  private data: Float32Array;

  constructor(time=0, deltaTime=0, fill=-1.2, bedHeight=5, repacked=0) {
    this.data = new Float32Array([time, deltaTime, fill, bedHeight, repacked]);
  }

  // Getters
  get time(): number {
    return this.data[0];
  }
  get deltaTime(): number {
    return this.data[1];
  }
  get fill(): number {
    return this.data[2];
  }
  get bedHeight(): number {
    return this.data[3];
  }
  get repacked() {
    return this.data[4];
  }
  get raw(): Float32Array {
    return this.data;
  }

  // Setters
  set time(val: number) {
    this.data[0] = val;
  }
  set deltaTime(val: number) {
    this.data[1] = val;
  }
  set fill(val: number) {
    this.data[2] = val;
  }
  set bedHeight(val: number) {
    this.data[3] = val;
  }
  set repacked(val: number) {
    this.data[4] = val;
  }

}

const NUM_PARTICLES = 1024;

// Initialize canvas
// Grab canvas element
const cnv = document.getElementById("cnv") as HTMLCanvasElement;
// Request a WebGL2 context
const gl = cnv.getContext("webgl2");
// Get the magnifyer copy
const cpy = document.getElementById("cnv-cpy") as HTMLCanvasElement;
const cpyctx = cpy.getContext("2d");

// Scale up the copy's resolution to scale
const MAG_RES_MULTIPLIER = 8;
cpy.width *= MAG_RES_MULTIPLIER;
cpy.height *= MAG_RES_MULTIPLIER;

// Initialize variables
var asp = window.innerHeight / window.innerWidth;

// Resource management
var bgShader: WebGLProgram;
var pRenderShader: WebGLProgram;
var pUpdateShader: WebGLProgram;
var pRepackShader: WebGLProgram;
var bgVao: WebGLVertexArrayObject;
// var pVaos: WebGLVertexArrayObject[];
var pvaos: WebGLVertexArrayObject[];
var ubo: WebGLBuffer;
var uniformData: UniformBuffer = new UniformBuffer;
var transformFeedback: WebGLTransformFeedback;
var positionBuffer: WebGLBuffer[];
var noiseTexture: WebGLTexture;

// Internal state
var fill = false;
var targetHeight = 5;
// Promise for when the tube is filled
let resolveFill: () => void;
const hasFilled = new Promise<void>((resolve) => resolveFill = resolve);

// Define vertex array layout
const vertices = new Float32Array([ -1,-1 , -1, 1 ,  1, 1 ,  1,-1 ]);
const indices = new Uint32Array ([ 0,1,2 , 2,3,0 ]);
const attribs: Array<VertexAttribute> = [{
  name: "aPos",
  size: 2,
  type: gl.FLOAT,
  normalized: false,
  stride: 8,
  offset: 0
}];

/**
 * Add an on-load event listener to make sure the canvas is fully loaded.
 */
window.addEventListener("load", async () => {
  // Make sure gl context is present
  if (!gl) {
    console.warn("gl context not found");
    return;
  }

  const img = new Image();
  img.src = noise;
  const texPromise = new Promise<WebGLTexture>((resolve, reject) => img.onload = () => {
    const tex = CreateTexture(gl, img);
    if (tex) {
      noiseTexture = tex;
      resolve(tex);
    }
    else {
      console.warn("Failed to load texture");
      reject();
    }
  });

  // Get the device pixel ratio
  const pixRatio = Math.max(window.devicePixelRatio, 2);

  // Create shaders and objects
  bgShader = CreateShader(gl, bgVertSrc, bgFragSrc);
  pRenderShader = CreateShader(gl, particleRenderVertSrc, particleRenderFragSrc);
  pRepackShader = CreateShader(gl, repackedVertSrc, particleRenderFragSrc);
  pUpdateShader = CreateShader(gl, particleUpdateVertSrc, dummyFragSrc, ["vPos", "vPrev"]);
  bgVao = CreateVao(gl, vertices, indices, bgShader, attribs);
  ubo = CreateUBO(gl, 32, [bgShader], "ubo", 0);
  SetUBO(gl, ubo, uniformData.raw);
  positionBuffer = [gl.createBuffer(), gl.createBuffer()];

  // Create double buffers for ping pong
  const initialData = new Float32Array(NUM_PARTICLES * 4);

  // Initialize the particle array buffers
  const posLoc = gl.getAttribLocation(pUpdateShader, "aPos");
  const prvLoc = gl.getAttribLocation(pUpdateShader, "aPrev");
  positionBuffer.forEach(buffer => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(prvLoc, 2, gl.FLOAT, false, 16, 8);
    gl.bufferData(gl.ARRAY_BUFFER, initialData, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  });

  
  // Create and bind the transform feedback object
  transformFeedback = gl.createTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

  // Set viewport and clear colors
  cnv.width = 40 * pixRatio;
  cnv.height = 255 * pixRatio;
  gl.viewport(0, 0, cnv.width, cnv.height);
  asp = innerWidth / innerHeight;
  // Set the clear color
  gl.clearColor(0, 0, 0, 0);

  // Await texture loading
  await texPromise;
  // Activate and bind texture to location 0
  gl.useProgram(pUpdateShader);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
  gl.uniform1i(gl.getUniformLocation(pUpdateShader, "noiseTex"), 0);
  gl.useProgram(null);

  gl.useProgram(bgShader);
  gl.uniform1i(gl.getUniformLocation(bgShader, "noiseTex"), 0);
  gl.useProgram(null);

  // Begin the main loop
  requestAnimationFrame(mainLoop);
});

/**
 * Draws the fluid inside the aparatus
 */
function drawBg() {
  // Set data
  SetUBO(gl, ubo, uniformData.raw);
  // Draw
  gl.useProgram(bgShader);
  gl.bindVertexArray(bgVao);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
  gl.bindVertexArray(null);
}

// Read index for determining which framebuffer to use
var readIndex = 0;
function drawParticles() {
  // Determine the write index
  const writeIndex = (readIndex + 1) % 2;

  // Run the update shader first with transform feedback
  gl.useProgram(pUpdateShader);
  // Bind the readonly buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[readIndex]);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  // Bind the writeonly buffer
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBuffer[writeIndex]);

  // Setup and run the update pass
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);
  gl.endTransformFeedback();
  gl.disable(gl.RASTERIZER_DISCARD);

  // if (uniformData.bedHeight <= 14.5 || uniformData.fill < 1.0) {
    // Now the render pass
    gl.useProgram(pRenderShader);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[readIndex]);
    gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);
  // }
  // else {
  // const num_repacked = Math.floor(NUM_PARTICLES * uniformData.repacked);
  // // Obscure the bottom particles by changing what shader to draw with
  // gl.useProgram(pRepackShader);
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[readIndex]);
  // gl.drawArrays(gl.POINTS, 0, num_repacked);

  // gl.useProgram(pRenderShader);
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[readIndex]);
  // gl.drawArrays(gl.POINTS, num_repacked, NUM_PARTICLES - num_repacked);
  // }

  // Unbind the buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

  // Swap the indices for the next frame
  readIndex = writeIndex;
}

function printDebugBuffer(buffer: WebGLBuffer) {
  const target = gl.ARRAY_BUFFER; // or TRANSFORM_FEEDBACK_BUFFER, etc.
  const byteOffset = 0; 
  const size = NUM_PARTICLES * 4; // for 2 vec2s (4 floats per particle)
  const out = new Float32Array(size);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.getBufferSubData(target, byteOffset, out);

  console.log('Read buffer contents:', out);
}

/**
 * Render and flush everything to the canvas
 */
function display() {
  // Clear the framebuffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw bg
  drawBg();
  // Update and draw particles
  drawParticles();

  // Flush the framebuffer contents to the canvas
  gl.flush();
}

function displayMagCopy() {
  cpyctx.clearRect(0,0,cpy.width,cpy.height);
  cpyctx.drawImage(cnv, 0, 0, cnv.width, cnv.height, 0, 0, 9 * MAG_RES_MULTIPLIER, 64 * MAG_RES_MULTIPLIER);
}

/**
 * Sets the uniform buffers time to be tracked
 * @param time Current time, passed from animation frame
 */
function setTime(time: number) {
  uniformData.deltaTime = Math.min(50, time - uniformData.time);
  uniformData.time = time;
}

/**
 * Main loop for the WebGL Canvas
 */
function mainLoop(time: number) {
  setTime(time);
  updateState();
  display();
  displayMagCopy();
  requestAnimationFrame(mainLoop);
}

const r = Math.E**(-1/1000);
var kick = true;
/**
 * Handle state-related changes to canvas
 */
function updateState() {
  // Set fill for animation
  if (fill) {
    // lerp towards full state
    let h = uniformData.fill;
    h += uniformData.deltaTime / 1000 * State.valveLift;
    if (h >= 1.2) {
      h = 1.2;
      resolveFill();
      fill = false;
    }
    uniformData.fill = h;
  }

  // Smooth lerp towards target bed height
  var bedHeight = uniformData.bedHeight;
  bedHeight = (bedHeight - targetHeight) * r ** uniformData.deltaTime + targetHeight;
  uniformData.bedHeight = bedHeight;
  
  // Repacking logic
  // if (uniformData.fill < 1.2) uniformData.bedHeight = Math.min(uniformData.bedHeight, 14.5);
  if (bedHeight > 14.5 && uniformData.fill >= 1.2) {
    const rel_rate = (bedHeight - 14.5) * 0.2; // [0,1]
    const rate = Math.exp(-rel_rate/3000); // 
    uniformData.repacked = (uniformData.repacked - 1.0) * rate ** uniformData.deltaTime + 1.0;

    if (uniformData.repacked >= 1023) {
      kick = false;
    }
  }
  else {
    const kick_chance = (1 - bedHeight / 14.5) ** 10;
    // Roll on the kick chance to see if we'll kick
    if (Math.random() < kick_chance) {
      // kick; particles fall
      kick = true;
    }

    // Fall
    if (kick) {
      const rate = Math.exp(-1/1000);
      uniformData.repacked = uniformData.repacked * rate ** uniformData.deltaTime;
    }
  }
}

/**
 * Begin the fill animation for inside the aparatus
 */
export async function fillCanvas() {
  fill = true;
  // console.log(`Setting bed height to ${targetHeight}`)
  uniformData.bedHeight = targetHeight;
  await hasFilled;
}

/**
 * Set the target bed height
 * @param val New target bed height
 */
export function setTargetBedHeight(val: number) {
  targetHeight = val;
}

/**
 * Update the canvas size and position to match with the SVG
 */
export function updateCanvasPosition() {
  const tube = document.getElementById("Rectangle 5") as unknown as SVGAElement;
  const wrapper = document.getElementById("graphics-wrapper").getClientRects()[0];
  const bbox = tube.getBBox();
  
  // Set new coordinates of webgl canvas
  cnv.setAttribute("style", `
width   : ${bbox.width}px;
height  : ${bbox.height}px;
  `);
  cpy.setAttribute("style", `
width   : ${bbox.width}px;
height  : ${bbox.height}px;
  `);
}

window.addEventListener('resize', () => {
  updateCanvasPosition();
})