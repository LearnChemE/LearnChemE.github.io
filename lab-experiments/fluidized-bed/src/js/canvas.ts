import { VertexAttribute } from "../types";
import { CreateShader, CreateVao } from "./helpers";
import State from "./state";

// Initialize canvas
// Grab canvas element
const cnv = document.getElementById("cnv") as HTMLCanvasElement;
// Request a WebGL2 context
const gl = cnv.getContext("webgl2");

// Initialize variables
var prevTime = 0;
var deltaTime = 0;
var asp = window.innerHeight / window.innerWidth;

var shader: WebGLProgram;
var vao: WebGLVertexArrayObject;

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

void main() {
    gl_Position = vec4(aPos, 0, 1);
}
`;

const bgFragSrc = `#version 300 es
precision mediump float;

layout (location=0) out vec4 FragColor;

void main() {
    FragColor = vec4(0,0,1,1);
}
`;


// Initialize after window is loaded
window.addEventListener("load", () => {
  // Make sure gl context is present
  if (!gl) {
    console.warn("gl context not found");
    return;
  }

  // Create shaders and objects
  shader = CreateShader(gl, bgVertSrc, bgFragSrc);
  vao = CreateVao(gl, vertices, indices, shader, attribs);

  gl.enable(gl.DEPTH_TEST);
  // Set viewport and clear colors
  gl.viewport(0, 0, cnv.width, cnv.height);
  asp = innerWidth / innerHeight;
  // Set the clear color
  gl.clearColor(0, 0, 0, 0);

  // reshape();

  // Begin the main loop
  requestAnimationFrame(mainLoop);
});

function mainLoop() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw bg
  gl.useProgram(shader);
  gl.bindVertexArray(vao);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);

  gl.flush();
  requestAnimationFrame(mainLoop);
}