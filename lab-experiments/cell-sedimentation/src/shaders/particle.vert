
// lightDirection: { value: new THREE.Vector3(5, 0, 5).normalize() },
// time: { value: 0.0 },
// num: { value: 2000 },
// frac: { value: 0.5 },
// vr: { value: 1.0 },
// vw: { value: 0.5 }

// The uniforms and attributes are prepended by three, so make sure and comment them out to make this work.
// uniform mat4 modelMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat3 normalMatrix;

// attribute vec3 position;

uniform float time;
uniform float num;
uniform float frac;
uniform float vr;
uniform float vw;

attribute float index;

varying vec2 vUv;
varying vec4 vCol;
varying vec3 vViewPosition;
flat varying int vType;

void main() {
  // Transform normal to view space
//   vNormal = normalize(normalMatrix * normal);
    int type = 1; // white cell
    
    if (index < 1.0) {//num * frac) {
        type = 0; // red cell
        vCol = vec4(1.0, 0.0, 0.0, 1.0);
    }
    else if (index > num) {
        type = 2; // none
        vCol = vec4(0.0,0.0,0.0,0.0);
    }
    else {
        vCol = vec4(1.0,1.0,1.0,1.0);
    }

    float vel = (type == 0) ? vr : vw;
    vel = vel + (index - 1000.0) / 2000.0;
    vel *= 10.0;
  
  // Position in camera space
  vec4 worldPos = vec4(position, 1.0);
  worldPos.y -= vel * time;
  worldPos.y = mod(worldPos.y + 100.0, 200.0) - 100.0;
  vec4 mvPosition = modelViewMatrix * worldPos;
//   vViewPosition = -mvPosition.xyz;  // toward camera
  
  // Final clip-space position
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = (type == 0) ? 2.0 : 4.0;

  // Set varyings
  vUv = uv;
  vViewPosition = -mvPosition.xyz;  // toward camera
  vType = type;
}
