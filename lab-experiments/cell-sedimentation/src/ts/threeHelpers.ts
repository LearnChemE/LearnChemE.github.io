import * as THREE from 'three';
import type { EffectComposer } from 'three-stdlib';

export interface Resizable {
    renderer: THREE.WebGLRenderer | null,
    composer: EffectComposer | null
}
export function resize(asp: number, { renderer, composer }: Resizable) {
    // Read the current asp
    const windowAspect = window.innerWidth / window.innerHeight;
    let width: number, height: number;

    if (windowAspect > asp) {
        // Window is wider than target
        height = window.innerHeight;
        width = height * asp;
    }
    else {
        // Window is taller than target
        width = window.innerWidth;
        height = width / asp;
    }
    
    renderer?.setSize(width * 2, height * 2, false);
    renderer?.setPixelRatio(window.devicePixelRatio);
    composer?.setSize(width * 2, height * 2);
}

/**
 * Adds lighting to the scene render list
 * @param scene scene object
 */
export function addLights(scene: THREE.Scene) {
    // Add a light source
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5,0,5);
    light.target.position.set(0,0,0);
    scene.add(light);
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambient);
    // Hemisphere light
    const hemisphere = new THREE.HemisphereLight(0xffffff, 1);
    scene.add(hemisphere)
}
