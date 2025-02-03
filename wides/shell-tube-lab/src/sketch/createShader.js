// Helper function to create a shader
function CreateShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
  
// Helper function to create a shader program
function createProgram(gl, vertShader, fragShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
}

export function CreateShaderProgram(gl, vert, frag) {
    const vertShader = CreateShader(gl,gl.VERTEX_SHADER,vert);
    const fragShader = CreateShader(gl,gl.FRAGMENT_SHADER,frag);
    return createProgram(gl,vertShader,fragShader);
}