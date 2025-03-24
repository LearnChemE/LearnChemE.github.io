export const fillVertShaderSource = `
precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 waterPos;
varying vec2 vWaterPos;
varying vec4 vVertexColor;
varying vec4 vPos;
void main() {
  // Apply the camera transform
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  // Tell WebGL where the vertex goes
  vPos = uProjectionMatrix * viewModelPosition;
  gl_Position = vPos;
  // Pass along data to the fragment shader
  vVertexColor = aVertexColor;
  vec4 wp = uProjectionMatrix * uModelViewMatrix * vec4(waterPos - vec2(75),0,1);
  vWaterPos = vec2(wp);
  vVertexColor = aVertexColor;
}
`;

export const blueFragShaderSource = `
precision highp float;
varying vec2 vWaterPos;
varying vec4 vVertexColor;
varying vec4 vPos;
const float r2 = 5000.0;
const float pi = 3.145962;
uniform float time;
uniform bool flipx;

void main() {
    vec2 pos = vPos.xy;
    // find position based on water centre
    vec2 dif = pos - vWaterPos;
    // Get angle from water centre
    float th = atan(dif.y/dif.x) +  pi * sign(dif.x) * 0.5 + 0.5;
    // Get squared distance from water center
    float dist2 = dif.x*dif.x + .5*dif.y*dif.y;
    // Distort distance by a sinusoid based on th
    dist2 += 400.0 * cos(5.0 * th + 0.01 * time);
    dist2 += 400.0 * cos(3.0 * th + 0.01 * time);
    // vec4 col = vec4(0.2941, 0.5137, 1.0, 0.7019);
    vec4 col = vVertexColor;
    // Water based on distance
    bool wet = dist2 < r2;
    if (!flipx) 
      wet = wet || pos.x > vWaterPos.x + dif.y;
    else 
      wet = wet || pos.x < vWaterPos.x - dif.y;

    // Lastly, if fragment is right of pixel
    // wet = wet || dif.x > 50.0;

    if (!wet) col = vec4(0);
    // If p5.js has one hater, I am that hater
    gl_FragColor = pow(col,vec4(1.25,1.25,1.25,1.0));
}
`;

export const orngFragShaderSource = `
precision highp float;
varying vec2 vWaterPos;
varying vec4 vVertexColor;
varying vec4 vPos;
const float r2 = 5000.0;
const float pi = 3.145962;
uniform float time;
uniform bool flipx;

void main() {
    vec2 pos = vPos.xy;
    // find position based on water centre
    vec2 dif = pos - vWaterPos;
    // Get angle from water centre
    float th = atan(dif.y/dif.x) +  pi * sign(dif.x) * 0.5 + 0.5;
    // Get squared distance from water center
    float dist2 = dif.x*dif.x + .5*dif.y*dif.y;
    // Distort distance by a sinusoid based on th
    dist2 += 400.0 * cos(5.0 * th + 10.0 * time);
    dist2 += 400.0 * cos(3.0 * th + 10.0 * time);
    // vec4 col = vec4(0.2941, 0.5137, 1.0, 0.7019);
    vec4 col = vVertexColor;
    // Water based on distance
    bool wet = dist2 < r2;
    if (!flipx) 
      wet = wet || (pos.x > vWaterPos.x && pos.y > vWaterPos.y - 30.0);
    else 
      wet = wet || (pos.x < vWaterPos.x && pos.y > vWaterPos.y - 30.0);

    wet = wet || pos.y > vWaterPos.y + 50.0;

    if (!wet) col = vec4(0);
    // If p5.js has one hater, I am that hater
    gl_FragColor = col;//pow(col,vec4(1.25,1.25,1.25,1.0));
}
`;

export const checkShaderError = (shaderObj:any, shaderText:string) => {
    var gl = shaderObj._renderer.GL;
    var glFragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(glFragShader, shaderText);
    gl.compileShader(glFragShader);
    if (!gl.getShaderParameter(glFragShader, gl.COMPILE_STATUS)) {
      return gl.getShaderInfoLog(glFragShader)
    }
    return null;
  }