precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec2 vTexCoord;
varying vec4 vVertexColor;
void main() {
  // Apply the camera transform
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  // Tell WebGL where the vertex goes
  gl_Position = uProjectionMatrix * viewModelPosition;  
  // Pass along data to the fragment shader
  vTexCoord = aTexCoord;
  vVertexColor = aVertexColor;
}