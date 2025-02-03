const blueVertices = new Float32Array([
     0,  1, 0,
    -1, -1, 0,
     1, -1, 0
]);

const blueIndices = new Uint32Array ([
    0,1,2
]);

export function CreateVAOs(gl,shader) {
    var blueVao = createVAO(gl,blueVertices,blueIndices,shader)

    return blueVao;
}

function createVAO(gl,vertices,indices,shader) {
    // Create VAO
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Create VBO
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create IBO
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Attribute arrays
    gl.useProgram(shader);
    var pos = gl.getAttribLocation(shader,"aPosition");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 12, 0);

    gl.bindVertexArray(null);
    return vao;
}