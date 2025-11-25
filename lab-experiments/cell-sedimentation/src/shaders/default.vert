// The uniforms and attributes are prepended by three, so make sure and comment them out to make this work.
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat3 normalMatrix;

// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  
  // Transform normal to view space
  vNormal = normalize(normalMatrix * normal);
  
  // Position in camera space
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;  // toward camera
  
  // Final clip-space position
  gl_Position = projectionMatrix * mvPosition;
}
