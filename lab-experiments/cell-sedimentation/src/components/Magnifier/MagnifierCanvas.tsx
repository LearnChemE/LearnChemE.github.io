import { onCleanup, onMount, type Accessor } from "solid-js";
import * as THREE from "three";
import type { MagnifierParticleInfo } from "../../types/globals";
import { createParticleMaterial } from "../../ts/materials";

type Props = {
    particleInfo: Accessor<MagnifierParticleInfo>;
    showing: Accessor<boolean>;
    count?: number;
};

export default function MagnifierCanvas(props: Props) {
    let canvasRef!: HTMLCanvasElement;
    const count = props.count ?? 2000;

    onMount(() => {
        if (!canvasRef) return;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef,
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio || 1);

        // Scene & Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.set(0, 0, 100);
        scene.background = new THREE.Color(0x7777FF);

        // Particles geometry
        const geometry = new THREE.BufferGeometry();
        const particles = new Float32Array(count * 4);

        const spread = 60;
        for (let i = 0; i < count; i++) {
            const i4 = i * 4;
            // distribute in a sphere-ish volume
            const r = Math.cbrt(Math.random()) * spread;
            const theta = Math.random() * Math.PI * 2;
            const z = (Math.random() * 2 - 1) * 200;
            particles[i4 + 0] = r * Math.cos(theta);
            particles[i4 + 1] = z;
            particles[i4 + 2] = r * Math.sin(theta);
            particles[i4 + 3] = i;
        }
        console.log(particles)
        const partBuf = new THREE.InterleavedBuffer(particles, 4);

        geometry.setAttribute("position", new THREE.InterleavedBufferAttribute(partBuf, 3, 0));
        geometry.setAttribute("index", new THREE.InterleavedBufferAttribute(partBuf, 1, 12));

        // Points material
        // const material = new THREE.PointsMaterial({
        //     size: 1.6,
        //     vertexColors: true,
        //     transparent: true,
        //     opacity: 0.95,
        //     depthWrite: false,
        //     sizeAttenuation: true,
        // });

        const material = createParticleMaterial();
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Resize handling
        function resize() {
            if (!canvasRef) return;
            const w = canvasRef.clientWidth || canvasRef.width;
            const h = canvasRef.clientHeight || canvasRef.height;
            renderer.setSize(w, h, false);
            camera.aspect = Math.max(0.0001, w / h);
            camera.updateProjectionMatrix();
        }
        // Initial resize
        resize();
        window.addEventListener("resize", resize);

        // Simple animation
        const clock = new THREE.Clock();
        let raf = 0;
        function animate() {
            if (props.showing()) {
                const t = clock.getElapsedTime();
                material.uniforms.time.value = t;
                // Set uniforms

                renderer.render(scene, camera);

            }
            raf = requestAnimationFrame(animate);
        }
        raf = requestAnimationFrame(animate);

        // Cleanup
        onCleanup(() => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        });
    });

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
                "touch-action": "none"
            }}
        />
    );
}