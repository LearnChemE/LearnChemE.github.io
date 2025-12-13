precision highp float;

const vec3 rCol = vec3(0.2, 10.0, 10.0);
const vec3 wCol = vec3(1.0, 1.0, 1.0);

uniform vec3 lightDirection;  // in view space

flat varying int vType;
varying vec2 vUv;
varying vec4 vCol;
varying vec3 vViewPosition;

void main() {
  vec2 xy = vec2(vUv.x - 0.5, vUv.y - 0.5);
  float r2;
  if (vType == 0) {
    r2 = .1;
  }
  else {
    r2 = .25;
  }

  // Spherical cutoff
  if (xy.x * xy.x + xy.y * xy.y > r2) {
    discard;
  }

  // Lighting
  vec3 normal = normalize(vec3(xy.x, xy.y, sqrt(1.0 - xy.x * xy.x - xy.y * xy.y)));
  float light = max(dot(normal, normalize(lightDirection)), 0.0);
  float view = max(dot(normal, normalize(vViewPosition)), 0.0);
  float spec = pow(max(light + view - 1.0, 0.0), 16.0);
  vec3 litCol = vCol.rgb * (0.2 + 0.8 * light) + vec3(spec);

  vec4 col = vec4(litCol, vCol.a);
  gl_FragColor = col;
}
