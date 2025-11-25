// Default fragment shader for THREE.ShaderMaterial
// Simple diffuse lighting + color uniform

precision highp float;

const vec3 baseCol = vec3(0.9, 0.9, 0.2);
// const vec3 rCol = vec3(1.0, 0.1, 0.1);
// const vec3 wCol = vec3(0.9, 0.9, 0.9);
// const vec3 baseCol = vec3(1.0, 1.0, 1.0);
const vec3 rCol = vec3(0.2, 10.0, 10.0);
const vec3 wCol = vec3(1.0, 1.0, 1.0);

uniform vec3 lightDirection;  // in view space
uniform float profile[1002];

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

vec4 concColor() {
  // Simple color modulation based on concentrations
  float zLoc = vUv.y * 305.0 * 2.0;
  float top = profile[1];
  if (zLoc < top) zLoc = top;
  float len = 305.0 - top;
  float yNorm = (zLoc - top) / len * 500.0;

  float rConc = profile[int(yNorm) + 2];
  float wConc = profile[int(yNorm) + 502];
  
  vec3 absorb = rConc * rCol
    + wConc * wCol
    + max(1.0 - rConc - wConc, 0.0) * baseCol;
  vec3 trans = exp(-absorb);
  trans += wConc * wCol;
  return vec4(trans, 1.0);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightDirection);
  vec3 V = normalize(vViewPosition);

  // Basic diffuse term
  float diff = max(dot(N, L), 0.0);

  // Simple rim lighting
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.0);

  // Modulate color by concentrations
  vec4 color = concColor();

  // Combine lighting
  color = color * (0.6 + 0.6 * diff);

  gl_FragColor = color;//vec4(color, 1.0);

  // gl_FragColor = vec4(2.0 * vUv, 0.0, 1.0);
}
