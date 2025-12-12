import * as THREE from 'three';
import defaultVert from '../shaders/default.vert?raw';
import defaultFrag from '../shaders/default.frag?raw';
import particleVert from '../shaders/particle.vert?raw';
import particleFrag from '../shaders/particle.frag?raw';
import { PROFILE_LENGTH } from './calcs';

export function createBloodMacroMaterial() {
    return new THREE.ShaderMaterial({
          uniforms: {
            lightDirection: { value: new THREE.Vector3(5, 0, 5).normalize() },
            profile: { value: new Float32Array(PROFILE_LENGTH).fill(0) },
        },
        transparent: true,
        vertexShader: defaultVert,
        fragmentShader: defaultFrag,
    });
}

export function createParticleMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            lightDirection: { value: new THREE.Vector3(5, 0, 5).normalize() },
            time: { value: 0.0 },
            num: { value: 1800 },
            frac: { value: 0.5 },
            vr: { value: 1.0 },
            vw: { value: 0.5 }
        },
        transparent: true,
        vertexShader: particleVert,
        fragmentShader: particleFrag
    })
}

function createQuadVertices(index: number, x: number, y: number, z: number) {
    const size = 4.0;

    return new Float32Array([
        // First triangle
        x - size, y - size, z, 0, 0, index,
        x + size, y - size, z, 1, 0, index,
        x + size, y + size, z, 1, 1, index,
        // Second triangle
        x - size, y - size, z, 0, 0, index,
        x + size, y + size, z, 1, 1, index,
        x - size, y + size, z, 0, 1, index,
    ]);
}

export function createParticleGeometry(count: number) {
    const ATTRIBUTES_PER_VERTEX = 6; // position (3) + uv (2) + index (1)
    const VERTICES_PER_PARTICLE = 6; // 2 triangles per quad
    const ATTRIBUTES_PER_PARTICLE = ATTRIBUTES_PER_VERTEX * VERTICES_PER_PARTICLE;
    // Create the buffer
    // Each vertex will have a vec3 position, a vec2 uv, and a float index
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(count * ATTRIBUTES_PER_PARTICLE); // 3 for position, 2 for uv, 1 for index

    const spread = 60;
    // Per particle quad (2 triangles)
    for (let i = 0; i < count; i++) {
        // Distribute in a cylinder-ish volume
        const r = Math.cbrt(Math.random()) * spread;
        const theta = Math.random() * Math.PI * 2;
        // Cylindrical coordinates
        const dx = r * Math.cos(theta);
        const dy = (Math.random() * 2 - 1) * 200;
        const dz = r * Math.sin(theta);
        // Create quad vertices
        const particleVertices = createQuadVertices(i, dx, dy, dz);
        vertices.set(particleVertices, i * ATTRIBUTES_PER_PARTICLE);
    }
    const vertexBuffer = new THREE.InterleavedBuffer(vertices, ATTRIBUTES_PER_VERTEX);

    // Set attributes
    geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(vertexBuffer, 3, 0, false));
    geometry.setAttribute('uv', new THREE.InterleavedBufferAttribute(vertexBuffer, 2, 3, false));
    geometry.setAttribute('index', new THREE.InterleavedBufferAttribute(vertexBuffer, 1, 5, false));

    return geometry;
}

// export type ParticleUniformValues = {
//     lightDirection: THREE.Vector3,
//     time: number,
//     num: number,
//     frac: number,
//     vr: number,
//     vw: number,
// }