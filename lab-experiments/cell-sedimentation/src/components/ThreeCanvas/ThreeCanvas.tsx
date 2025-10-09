import { onCleanup, onMount, type Component } from "solid-js";
import * as THREE from "three";
import "./ThreeCanvas.css";
import { animate } from "../../ts/helpers";

const asp = 16 / 9;

interface ThreeCanvasProps {};

export const ThreeCanvas: Component<ThreeCanvasProps> = ({}) => {
    let canvas!: HTMLCanvasElement;
    let scene!: THREE.Scene;
    let camera!: THREE.PerspectiveCamera;
    let renderer!: THREE.WebGLRenderer;

    // Resize canvas logic
    const resizeCanvas = () => {
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

        if (renderer && camera) {
            renderer.setSize(width, height, false);
            renderer.setPixelRatio(window.devicePixelRatio);
        }
    }

    onMount(() => {
        // Initialize WebGL, Matrix stack, etc.
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(59, asp, .1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        resizeCanvas();

        // Describe a cube and insert it into our render list
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial();
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 3;

        let t = 0;
        const frame = (dt: number) => {
            t += dt;
            cube.rotation.y = t;
            renderer.render(scene, camera);
            return true;
        }
        animate(frame);

        canvas.style = "";
        window.addEventListener("resize", resizeCanvas);
        onCleanup(() => renderer.dispose());
    });

    return (<>
        <canvas 
            ref={canvas}
        />
    </>);
}