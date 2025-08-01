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

layout (std140) uniform ubo {
  float time;
  float deltaTime;
  float fill;
  float height;
};
in vec2 vPos;
layout (location=0) out vec4 FragColor;

void main() {
  float h = fill;
  float y = vPos.y + 0.05 * cos(vPos.x - 0.005 * time);
  y += 0.03 * cos(2.0 * vPos.x + 0.001 * time);
  if (y > h) discard;  
  FragColor = vec4(.388,.561,.996,.85);

  // For debugging the texture
  // vec2 texcoord = vec2(vPos.x * .05 + 1e-5 * time, vPos.y * .2 - 3e-5 * time);
  // float perlin = texture(noiseTex, texcoord).r;
  // FragColor = vec4(vec3(perlin), 1.0);
}
`;

/**
 * Vertex shader for rendering particles
 */
export const particleRenderVertSrc = `#version 300 es
layout (location=0) in vec2 aPos;
layout (location=1) in vec2 aPrev;
void main() {
  gl_PointSize = 5.0;
  gl_Position = vec4(aPos,0.0, 1.0);
}
`;

/**
 * Fragment shader for rendering particles
 */
export const particleRenderFragSrc = `#version 300 es
precision mediump float;
out vec4 FragColor;
void main() {
  FragColor = vec4(0.9, 0.9, 0.9, 1.0);
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
layout (std140) uniform ubo {
  float time;
  float deltaTime;
  float fill;
  float height;
};

uniform sampler2D noiseTex;

const int TOT_PARTICLES = 1024;
const float MIN_HEIGHT = 10.5;
const float MAX_HEIGHT = 35.0;

float hash(float x, int seed) {
  // Convert integer seed to float and combine with input
  float s = float(seed);
  return fract(sin(x * 12.9898 + s * 78.233) * 43758.5453);
}

float pi = 22.0/7.0;

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
  float t = (height - MIN_HEIGHT) / 14.3;
  if (gl_VertexID <= int((1.0-t) * float(TOT_PARTICLES))) return 1;
  if (height >= MAX_HEIGHT) {
    // As t lerps from MAX_HEIGHT to MAX_HEIGHT + 10.0, a linearly proportional amount of particles pack on the top
    t = (height - MAX_HEIGHT) / 10.0;
    if (gl_VertexID <= int(t * float(TOT_PARTICLES))) return -1;
  }
  
  return 0;
}

/**
 * Calculate the clip space max height of the fluidized regime
 */
float maxHeight() {
  // Remap from (MIN_HEIGHT, MAX_HEIGHT) to (-0.6,+1.0)
  float t = (height - MIN_HEIGHT) / (MAX_HEIGHT-MIN_HEIGHT);
  return 1.6 * t - 0.6;
}

void fluidized() {
  float dt = deltaTime / 1000.0;
  float a = hash(dt, gl_VertexID);

  vec2 texcoord = vec2(aPos.x * .05 + 1e-5 * time, aPos.y * .2 - 3e-5 * time);
  float perlin = texture(noiseTex, texcoord).r;
  
  // Brownian motion
  float speedMod = (height - 5.7) / 14.3;
  vec2 accel = -5.0 * vec2(cos(4.0*pi*a),sin(4.0*pi*a));
  // Add Perlin noise for fluidlike flow
  accel += 5.0 * vec2(sin(-4.0*pi*perlin), cos(-8.0*pi*perlin));
  // Add some gravity
  accel.y -= .0001;
  accel *= speedMod*speedMod;
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
    pos.x -= 2.0;
    prev.x -= 2.0;
  }
  if (pos.x < -1.0) {
    // Reverse the direction
    pos.x  += 2.0;
    prev.x += 2.0;
  }
  float mh = maxHeight();
  if (pos.y > mh) {
    // Reverse the direction
    // pos.y = mh;
    prev.y += 0.02;
  }
  if (pos.y < -1.0) {
    // Reverse the direction
    // pos.y  += 1.0 + mh;
    prev.y -= 0.05 * mh;
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
  float abs_y = abs_height * float(direction) - float(direction);
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