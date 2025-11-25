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

// export type ParticleUniformValues = {
//     lightDirection: THREE.Vector3,
//     time: number,
//     num: number,
//     frac: number,
//     vr: number,
//     vw: number,
// }