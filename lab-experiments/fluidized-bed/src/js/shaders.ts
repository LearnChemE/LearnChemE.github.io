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
 * Vertex shader for rendering particles
 */
export const particleRenderVertSrc = `#version 300 es
layout (location=0) in vec2 aPos;
layout (location=1) in vec2 aPrev;
void main() {
  gl_PointSize = 10.0;
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
  FragColor = vec4(1.0, 0.8, 0.2, 1.0);
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
  float height;
};

void main() {
  float dt = deltaTime / 1000.0;
  
  vec2 accel = vec2(0.0,-0.1);
  vec2 vel = aPos - aPrev;
  vec2 pos = aPos + vel + accel * dt*dt;

  // Bounce off walls
  if (abs(pos.x) > 1.0) vel.x *= -1.0;
  if (abs(pos.y) > 1.0) vel.y *= -1.0;
  pos = clamp(pos, -1.0, 1.0);

  vPos = pos;
  vPrev = aPos;
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