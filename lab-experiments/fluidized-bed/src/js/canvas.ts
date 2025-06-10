import { VertexAttribute } from "../types";
import { constrain, CreateShader, CreateUBO, CreateVao, SetUBO } from "./helpers";
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

// Initialize canvas
// Grab canvas element
const cnv = document.getElementById("cnv") as HTMLCanvasElement;
// Request a WebGL2 context
const gl = cnv.getContext("webgl2");

// Initialize variables
var prevTime = 0;
var deltaTime = 0;
var asp = window.innerHeight / window.innerWidth;

// 
var shader: WebGLProgram;
var vao: WebGLVertexArrayObject;
var ubo: WebGLBuffer;
var uniformData: UniformBuffer = new UniformBuffer;

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


const bgVertSrc = `#version 300 es
precision highp float;
layout (location=0) in vec2 aPos;
out vec2 vPos;

void main() {
  gl_Position = vec4(aPos, 0, 1);
  vPos = aPos;
}
`;

const bgFragSrc = `#version 300 es
precision mediump float;

layout (std140) uniform ubo {
  float time;
  float deltaTime;
  float height;
};
in vec2 vPos;
layout (location=0) out vec4 FragColor;

void main() {
  float h = height;
  float y = vPos.y + 0.05 * cos(vPos.x - 0.005 * time);
  y += 0.03 * cos(2.0 * vPos.x + 0.001 * time);
  if (y > h) discard;  
  FragColor = vec4(.388,.561,.996,.85);
}
`;

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
  shader = CreateShader(gl, bgVertSrc, bgFragSrc);
  vao = CreateVao(gl, vertices, indices, shader, attribs);
  ubo = CreateUBO(gl, 16, [shader], "ubo", 0);
  SetUBO(gl, ubo, uniformData.raw);

  gl.enable(gl.DEPTH_TEST);
  // Set viewport and clear colors
  cnv.width = cnv.width * pixRatio;
  cnv.height = cnv.height * pixRatio;
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
  gl.useProgram(shader);
  gl.bindVertexArray(vao);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
}

/**
 * Render and flush everything to the canvas
 */
function display() {
  // Clear the framebuffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw bg
  drawBg();

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

export async function fillCanvas() {
  fill = true;
  await hasFilled;
}