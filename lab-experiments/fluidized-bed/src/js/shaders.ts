const UniformLayout = `layout (std140) uniform ubo {
  float time;
  float deltaTime;
  float fill;
  float height;
  float repacked;
};
`;

/**
 * Simple vertex shader for the background
 */
export const bgVertSrc = `#version 300 es
precision highp float;
layout (location=0) in vec2 aPos;
out vec2 vPos;

void main() {
  gl_Position = vec4(aPos, 0, 1);
  vPos = aPos;
}
`;

/**
 * Fragment shader for background. Creates a wave appearance using uniform buffer height variable
 */
export const bgFragSrc = `#version 300 es
precision mediump float;
uniform sampler2D noiseTex;

${UniformLayout}
in vec2 vPos;
layout (location=0) out vec4 FragColor;

void main() {
  float h = fill;
  float y = vPos.y + 0.05 * cos(vPos.x - 0.005 * time);
  y += 0.03 * cos(2.0 * vPos.x + 0.001 * time);
  if (y > h) discard;  
  FragColor = vec4(.388,.561,.996,.85);
}
`;

/**
 * Vertex shader for rendering particles
 */
export const particleRenderVertSrc = `#version 300 es
layout (location=0) in vec2 aPos;
layout (location=1) in vec2 aPrev;
out float vCol;

float hash(float x, int seed) {
  // Convert integer seed to float and combine with input
  float s = float(seed);
  return fract(sin(x * 12.9898 + s * 78.233) * 43758.5453);
}

void main() {
  gl_PointSize = 3.0;
  gl_Position = vec4(aPos,0.0, 1.0);
  vCol = hash(0.3, gl_VertexID) * .3 + .7;
}
`;

/**
 * Fragment shader for rendering particles
 */
export const particleRenderFragSrc = `#version 300 es
precision mediump float;
in float vCol;
out vec4 FragColor;
void main() {
  FragColor = vec4(vec3(vCol), 1.0);
}
`;

/**
 * Alternate vertex shader for rendering particles that are repacked
 */
export const repackedVertSrc = `#version 300 es
layout (location=0) in vec2 aPos;
layout (location=1) in vec2 aPrev;
${UniformLayout}

out float vCol;

float hash(float x, int seed) {
  // Convert integer seed to float and combine with input
  float s = float(seed);
  return fract(sin(x * 12.9898 + s * 78.233) * 43758.5453);
}

void main() {
  // Calculate the particle's "resting" position
  float rel_height = float(gl_VertexID) / 1024.0;
  vec2 rest = vec2(hash(.77, gl_VertexID) * 2.0 - 1.0,
                    1.0 - rel_height * 0.4);

  gl_PointSize = 3.0;
  gl_Position = vec4(rest, 0.0, 1.0);
  vCol = hash(0.3, gl_VertexID) * .3 + .7;
}
`;

/**
 * Attach transform feedback to vPos and vPrev for updating the buffer. Must also disable the raster.
 */
export const particleUpdateVertSrc = `#version 300 es
layout (location=0) in vec2 aPos;
layout (location=1) in vec2 aPrev;
out vec2 vPos;
out vec2 vPrev;
${UniformLayout}

uniform sampler2D noiseTex;

const int TOT_PARTICLES = 1024;
const float MIN_HEIGHT = 5.0;
const float MAX_HEIGHT = 14.5;
const float HEIGHT_DIF = MAX_HEIGHT - MIN_HEIGHT;
float pi = 22.0/7.0;

float hash(float x, int seed) {
  // Convert integer seed to float and combine with input
  float s = float(seed);
  return fract(sin(x * 12.9898 + s * 78.233) * 43758.5453);
}

vec2 cap_speed(vec2 v, float speed) {
  float mag = sqrt(v.x*v.x + v.y*v.y);
  if (mag > speed) {
    return v * speed / mag;
  }
  return v;
}

/**
 * Calculate whether the particle is packed, fluidized, or repacked.
 * returns 1 for packed, 0 for fluidized, and -1 for repacked.
 */
int CalcState() {
  if (fill <= -1.00) return 1;
  if (TOT_PARTICLES - int((1.0 - repacked) * float(TOT_PARTICLES)) >= gl_VertexID) return -1;
  else return 0;
}

/**
 * Calculate the clip space max height of the fluidized regime
 */
float maxHeight() {
  // Remap from (MIN_HEIGHT, MAX_HEIGHT) to (-0.6,+1.0)
  float t = (height - MIN_HEIGHT) / HEIGHT_DIF;
  float clipHeight = 1.6 * t - 0.6;
  // Height cannot be higher than fill
  clipHeight = min(clipHeight, fill);
  // If repacking is happening, height cannot be higher than that
  clipHeight = min(clipHeight, 1.0 - repacked * .4);
  // Height cannot be lower than minimum
  clipHeight = max(clipHeight, -0.6);

  return clipHeight;
}

float minHeight() {
  if (height < 14.5 || repacked == 0.0) return -1.0;
  
  // Determine the height minus space filled at the top
  float h = 2.0 - repacked * .4;
  return repacked * h - 1.0;
}

void fluidized() {
  float dt = deltaTime / 1000.0;
  float a = hash(dt, gl_VertexID);
  
  // Calculate the particle's "resting" position
  float rel_height = float(gl_VertexID) / float(TOT_PARTICLES);
  if (height >= 14.5) rel_height -= repacked;
  float minh = minHeight();
  float bed_height = maxHeight() - minh;
  vec2 rest = vec2(hash(.77, gl_VertexID) * 2.0 - 1.0,
                    (1.0 - rel_height) * bed_height + minh);
  
  // Brownian motion
  float speedMod = (height - MIN_HEIGHT) / HEIGHT_DIF;
  speedMod *= min(max(fill,0.0),1.0);
  vec2 accel = -2.5 * vec2(cos(4.0*pi*a),sin(4.0*pi*a));
  // Add some gravity for forcing
  accel.y -= .0001;
  accel *= speedMod*speedMod;
  
  // Restoring force to keep particles near their homes
  vec2 dif = rest - aPos;
  float dist = sqrt(dif.x*dif.x + dif.y*dif.y);
  dif = (dist > 1.0) ? dif * 500.0 : dif * dist * 500.0;
  accel += dif;

  // With verlet integration, velocity already accounts for timestep
  vec2 vel = aPos - aPrev;
  vel = cap_speed(vel, 0.01 * speedMod); // Cap the max speed
  // Verlet integration to evolve
  vec2 pos = aPos + vel + accel * dt*dt;

  // Bounce off walls
  // pos = clamp(pos, -1.0, 1.0);
  vec2 prev = aPos;

  if (pos.x > 1.0) {
    // Reverse the direction
    prev.x += (pos.x - prev.x) * 2.0;
  }
  if (pos.x < -1.0) {
    // Reverse the direction
    prev.x += (pos.x - prev.x) * 2.0;
  }

  float mh = maxHeight();
  if (pos.y > mh) {
    // Reverse the direction
    prev.y += 0.01;
  }
  if (pos.y < -1.0) {
    // Reverse the direction
    prev.y -= 0.01 * mh;
  }

  vPos = pos;
  vPrev = prev;
}

void pack(int direction) {
  // Use vertex ID to get relative height
  float rel_height = float(gl_VertexID) / float(TOT_PARTICLES);
  // Multiply by the total height to get the height of the particle
  float abs_height = rel_height * 0.4;
  // Now use the direction to put in the real location
  float abs_y;
  if (direction == -1) {
    // abs_y = 1.4 - abs_height - 0.4 * repacked;
    abs_y = 1.0 - abs_height;
  } else {
    abs_y = -abs_height - 0.6;
  }
  float abs_x = hash(.77, gl_VertexID) * 2.0 - 1.0;


  // Output result
  vPos  = vec2(abs_x, abs_y);
  vPrev = vec2(abs_x, abs_y);
}

void main() {
  // Find the state
  int state = CalcState();

  // Determine what needs to happen
  if (state == 0)
    fluidized();
  else 
    pack(state);
}
`;

/**
 * It is still necessary to provide a fragment shader for security reasons, so we attach a dummy and disable the raster
 */
export const dummyFragSrc = `#version 300 es
precision mediump float;
out vec4 FragColor;
void main() {
  FragColor = vec4(0.0);
}
`;