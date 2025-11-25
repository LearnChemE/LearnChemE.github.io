precision highp float;

const vec3 rCol = vec3(0.2, 10.0, 10.0);
const vec3 wCol = vec3(1.0, 1.0, 1.0);

uniform vec3 lightDirection;  // in view space

varying vec4 vCol;

void main() {
  gl_FragColor = vCol;
}
