import * as THREE from 'three';
import defaultVert from '../shaders/default.vert?raw';
import defaultFrag from '../shaders/default.frag?raw';
import { CONC_ARRAY_SIZE } from './calcs';

export function createBloodMacroMaterial() {
    return new THREE.ShaderMaterial({
          uniforms: {
            lightDirection: { value: new THREE.Vector3(5, 0, 5).normalize() },
            redConcentration: { value: new Float32Array(CONC_ARRAY_SIZE).fill(0) },
            whiteConcentration: { value: new Float32Array(CONC_ARRAY_SIZE).fill(0) },
        },
        transparent: true,
        vertexShader: defaultVert,
        fragmentShader: defaultFrag,
    });
}