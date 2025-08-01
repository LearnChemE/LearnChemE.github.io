import { VertexAttribute } from "../types";
import State from "./state";

/**
 * Constain x to the bounds [min, max]
 * @param x Number to constrain
 * @param min minimum value for new x
 * @param max maximum value for new x
 * @returns constrained value for x
 */
export function constrain(x: number, min: number, max: number) {
    // if (min > max) {
    //     throw new Error("Bad range for constrain: min must be less than max");
    // }

    if (x < min) x = min;
    if (x > max) x = max;

    return x;
}

/**
 * Lerp function
 * @param a min lerp bound
 * @param b max lerp bound
 * @param t interpolant
 * @returns linearly interpolated value
 */
export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

// 

/**
 * Rescale x from scale of a to b to scale of c to d
 * 6th argument optionally sets whether to constrain to bounds
 * @param x number to be rescaled
 * @param a min of original scale
 * @param b max of original scale
 * @param c min of new scale
 * @param d max of new scale
 * @param constrain sets whether to constrain new number to bounds of c and d (default false)
 * @returns Number with new scale
 */
export function rescale(x: number, a: number, b: number, c: number, d: number, constrain: boolean=false) {
    // if (a > b || c > d) throw new Error("Rescale bounds inverted");

    x = (x - a) / (b - a);
    x = x * (d - c) + c;

    if (constrain) {
        if (x > d) x = d;
        if (x < c) x = c;
    }

    return x;
}

/**
 * Smoothly interpolate from start to end over a given duration (in milliseconds)
 * @param duration Duration of animation
 * @param updateCallback Callback accepting interpolant to render animation
 * @param start Lowest t value accepted by callback (default 0)
 * @param end Highest t value accepted by callback (default 1)
 * @param clamp Clamp values to be between start and end (default 1)
 */
export function smoothLerp(duration: number, updateCallback: (t: number) => void, start: number = 0, end: number = 1, useValveLift: boolean = false): Promise<void> {
    return new Promise((resolve) => {
        let fill: number = 0;
        let prevTime: number | null = null;

        // Function to update the value at each frame
        const animate = (time: number) => {
            if (!prevTime) prevTime = time; // Initialize the start time

            // Calculate elapsed time
            const deltaTime = (time - prevTime);
            prevTime = time;

            // Calculate the interpolation factor t (from 0 to 1)
            let increment = deltaTime / duration;
            if (useValveLift) {
                // console.log(`Valve lift of ${State.valveLift} modifying animation!`);
                increment *= State.valveLift;
            }
            fill = Math.min(fill + increment, 1); // Ensure fill doesn't go beyond 1

            // Interpolate between start and end
            const interpolatedValue = lerp(start, end, fill);

            // Call the update callback with the interpolated value
            updateCallback(interpolatedValue);

            // If not at the end, continue the animation
            if (fill < 1) {
                requestAnimationFrame(animate);
            }
            // If at the end, give the return callback
            else resolve();
        }

        // Start the animation
        requestAnimationFrame(animate);
    });
}

/**
 * Create a delay for ms milliseconds
 * @param ms Number of milliseconds to delay
 * @returns Promise<void>. Await to create a time delay in animations
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a WebGL shader module using vertex and fragment sources
 * @param gl WebGL context
 * @param vert Vertex shader source code
 * @param frag Fragment shader source code
 * @returns WebGLProgram if successfully compiled; null if errors occurred
 */
export function CreateShader(gl: WebGL2RenderingContext, vert: string, frag: string, varying?: Array<string>): WebGLProgram | null {
    if (!vert && !frag) return null;
    // Create the shader objects
    let vertShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
    let fragShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Specify the sources
    gl.shaderSource(vertShader, vert);
    gl.shaderSource(fragShader, frag);
    // Compile the shaders
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);

    // Check compile status
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        console.warn(
            "Vertex Shader Compilation Error: " + gl.getShaderInfoLog(vertShader)
        );
        return;
    }
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.warn(
            "Fragment Shader Compilation Error: " + gl.getShaderInfoLog(fragShader)
        );
        return;
    }

    // Create shader program
    let shdrProg = gl.createProgram();
    // Attach shaders
    gl.attachShader(shdrProg, vertShader);
    gl.attachShader(shdrProg, fragShader);
    // Optionally attach transform feedback
    if (varying) {
        gl.transformFeedbackVaryings(shdrProg, varying, gl.INTERLEAVED_ATTRIBS);
    }
    // Link
    gl.linkProgram(shdrProg);

    // Check link status
    if (!gl.getProgramParameter(shdrProg, gl.LINK_STATUS)) {
        console.warn("Program Linking Error: " + gl.getProgramInfoLog(shdrProg));
        return;
    }

    // Return
    return shdrProg;
}

/**
 * Create a VAO from vertices and indices.
 * @param gl WebGL context
 * @param vrts List of vertices
 * @param idxs List of indices
 * @param shdr Shader program to assign attributes for
 * @param attribs Array of attribute descriptors to be assigned
 * @returns 
 */
export function CreateVao(gl: WebGL2RenderingContext, vrts: Float32Array, idxs: Uint32Array | null, shdr: WebGLProgram | Array<WebGLProgram>, attribs: Array<VertexAttribute>) {
    // Create VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Vertex data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vrts, gl.STATIC_DRAW);
    if (idxs) {
        // Index data
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idxs, gl.STATIC_DRAW);
    }

    // Wrap the shader programs if not already an array
    if (Array.isArray(shdr)) {
        var shdrs: Array<WebGLProgram> = shdr;
    }
    else {
        var shdrs: Array<WebGLProgram> = [shdr];
    }


    // Vertex attributes
    for (let attr of attribs) {
        for (let shdr of shdrs) {
            gl.useProgram(shdr);
            // Find the location of the attribute
            const loc = gl.getAttribLocation(shdr, attr.name);
            // Check for errors
            if (loc !== -1) {
                // Tell GL what the attribute is
                gl.vertexAttribPointer(loc, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
                // Enable the attribute
                gl.enableVertexAttribArray(loc);
            } 
            else {
                // Couldn't find attribute location
                console.warn(`Attribute "${attr.name}" not found in shader "${shdr}".`);
            }
        }
    }

    // Clean and return
    gl.bindVertexArray(null);
    return vao;
}

/**
 * Create a UBO object
 * @param gl WebGL rendering context
 * @param size Size of the buffer, in bytes
 * @param shaders Array of webGL shader modules that refer to this UBO
 * @param name Name of the UBO
 * @param binding UBO block binding
 * @returns WebGLBuffer for ubo
 */
export function CreateUBO(gl: WebGL2RenderingContext, size: number, shaders: Array<WebGLProgram>, name: string, binding: number) {
    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);

    // Allocate memory
    gl.bufferData(gl.UNIFORM_BUFFER, size, gl.DYNAMIC_DRAW);

    // Assign binding point to each shader
    for (const shader of shaders) {
        let uniformBlockIndex = gl.getUniformBlockIndex(shader, name);
        gl.uniformBlockBinding(shader, uniformBlockIndex, binding);
    }

    // Bind buffer to binding point
    gl.bindBufferBase(gl.UNIFORM_BUFFER, binding, buffer);
    return buffer;
}

/**
 * Set data for uniform buffer
 * @param gl WebGL rendering context
 * @param ubo Target buffer to be set
 * @param data Data to set to buffer
 */
export function SetUBO(gl: WebGL2RenderingContext, ubo: WebGLBuffer, data: Float32Array) {
    gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, data);
}

export function CreateTexture(gl: WebGL2RenderingContext, image: HTMLImageElement) {
    // Create a texture
    const texture = gl.createTexture();
    // Bind the texture
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Flip image's Y for GL
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // Upload data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Bilinear filtering and repeat wrapping
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // unbind the texture
    gl.bindTexture(gl.TEXTURE_2D, null);
    // return
    return texture;
}

/**
 * Solves for a root of a given function using the Secant method
 * @param fn - The function to find a root for
 * @param x0 - First initial guess
 * @param x1 - Second initial guess
 * @param tol - Tolerance (default: 1e-7)
 * @param maxIterations - Maximum number of iterations (default: 100)
 * @returns The approximate root or null if not found
 */
export function secantMethod(
    fn: (x: number) => number,
    x0: number,
    x1: number,
    tol: number = 1e-7,
    maxIterations: number = 100
): number | null {
    let iteration = 0;
    let f0 = fn(x0);
    let f1 = fn(x1);
    
    // Check if initial guesses are already solutions
    if (Math.abs(f0) < tol) return x0;
    if (Math.abs(f1) < tol) return x1;
    
    while (iteration < maxIterations) {
        iteration++;
        
        // Avoid division by zero
        if (Math.abs(f1 - f0) < tol) {
            console.warn('Secant method: possible division by zero');
            return x1;
        }
        
        // Calculate next approximation
        const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
        const f2 = fn(x2);
        
        // Check for convergence
        if (Math.abs(f2) < tol || Math.abs(x2 - x1) < tol) {
            return x2;
        }
        
        // Update values for next iteration
        x0 = x1;
        f0 = f1;
        x1 = x2;
        f1 = f2;
    }
    
    console.warn(`Secant method failed to converge after ${maxIterations} iterations`);
    return null;
}
