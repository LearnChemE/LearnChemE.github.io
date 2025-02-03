export const fillVertShaderSource = `
precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;
// uniform mat4 uModelViewMatrix;
// uniform mat4 uProjectionMatrix;
varying vec2 vTexCoord;
varying vec4 vVertexColor;
varying vec4 vPos;

void main() {
    vPos = vec4(aPosition,1);
    gl_Position = vPos;
}
`;

export const blueFragShaderSource = `
precision highp float;
varying vec2 vTexCoord;
varying vec4 vVertexColor;
varying vec4 vPos;

void main() {
    gl_FragColor = vPos; // VertexColor;
}
`;