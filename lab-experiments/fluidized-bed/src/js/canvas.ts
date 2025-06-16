import { VertexAttribute } from "../types";
import { constrain, CreateShader, CreateUBO, CreateVao, SetUBO } from "./helpers";
import { bgFragSrc, bgVertSrc, dummyFragSrc, particleRenderFragSrc, particleRenderVertSrc, particleUpdateVertSrc } from "./shaders";
import State from "./state";

/**
 * Wrapper class around Float32Array to mimic buffer payload
 */
class UniformBuffer {
  private data: Float32Array;

  constructor(time=0, deltaTime=0, height=-1.2) {
    this.data = new Float32Array([time, deltaTime, height]);
  }

  // Getters
  get time(): number {
    return this.data[0];
  }
  get deltaTime(): number {
    return this.data[1];
  }
  get height(): number {
    return this.data[2];
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
  set height(val: number) {
    this.data[2] = val;
  }
}

const NUM_PARTICLES = 256;

// Initialize canvas
// Grab canvas element
const cnv = document.getElementById("cnv") as HTMLCanvasElement;
// Request a WebGL2 context
const gl = cnv.getContext("webgl2");

// Initialize variables
var prevTime = 0;
var deltaTime = 0;
var asp = window.innerHeight / window.innerWidth;

// Resource management
var bgShader: WebGLProgram;
var pRenderShader: WebGLProgram;
var pUpdateShader: WebGLProgram;
var bgVao: WebGLVertexArrayObject;
// var pVaos: WebGLVertexArrayObject[];
var pvaos: WebGLVertexArrayObject[];
var ubo: WebGLBuffer;
var uniformData: UniformBuffer = new UniformBuffer;
var transformFeedback: WebGLTransformFeedback;
var positionBuffer: WebGLBuffer[];
var previousBuffer: WebGLBuffer[];

// Internal state
var fill = false;
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
window.addEventListener("load", () => {
  // Make sure gl context is present
  if (!gl) {
    console.warn("gl context not found");
    return;
  }

  // Get the device pixel ratio
  const pixRatio = Math.max(window.devicePixelRatio, 2);

  // Create shaders and objects
  bgShader = CreateShader(gl, bgVertSrc, bgFragSrc);
  pRenderShader = CreateShader(gl, particleRenderVertSrc, particleRenderFragSrc);
  pUpdateShader = CreateShader(gl, particleUpdateVertSrc, dummyFragSrc, ["vPos", "vPrev"]);
  bgVao = CreateVao(gl, vertices, indices, bgShader, attribs);
  ubo = CreateUBO(gl, 16, [bgShader], "ubo", 0);
  SetUBO(gl, ubo, uniformData.raw);
  positionBuffer = [gl.createBuffer(), gl.createBuffer()];
  // previousBuffer = [gl.createBuffer(), gl.createBuffer()];

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
  console.log(cnv.width, cnv.height)
  gl.viewport(0, 0, cnv.width, cnv.height);
  asp = innerWidth / innerHeight;
  // Set the clear color
  gl.clearColor(0, 0, 0, 0);

  // reshape();

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
  // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, previousBuffer[writeIndex]);

  // Setup and run the update pass
  gl.enable(gl.RASTERIZER_DISCARD);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);
  gl.endTransformFeedback();
  gl.disable(gl.RASTERIZER_DISCARD);
  printDebugBuffer(positionBuffer[readIndex]);
  console.log('hi')


  // Now the render pass
  gl.useProgram(pRenderShader);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[readIndex]);
  gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);

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

/**
 * Sets the uniform buffers time to be tracked
 * @param time Current time, passed from animation frame
 */
function setTime(time: number) {
  uniformData.deltaTime = time - uniformData.time;
  uniformData.time = time;
}

/**
 * Main loop for the WebGL Canvas
 */
function mainLoop(time: number) {
  setTime(time);
  updateState();
  display();
  requestAnimationFrame(mainLoop);
}

/**
 * Handle state-related changes to canvas
 */
function updateState() {
  if (fill) {
    // lerp towards full state
    let h = uniformData.height;
    h += uniformData.deltaTime / 1000 * State.valveLift;
    if (h >= 1.2) {
      h = 1.2;
      resolveFill();
      fill = false;
    }
    uniformData.height = h;
  }
}

/**
 * Begin the fill animation for inside the aparatus
 */
export async function fillCanvas() {
  fill = true;
  await hasFilled;
}
