import * as THREE from 'three';
import defaultVert from '../shaders/default.vert?raw';
import defaultFrag from '../shaders/default.frag?raw';
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