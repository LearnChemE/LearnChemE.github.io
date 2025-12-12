import { onCleanup, onMount, type Accessor } from "solid-js";
import * as THREE from "three";
import type { MagnifierParticleInfo } from "../../types/globals";
import { createParticleGeometry, createParticleMaterial } from "../../ts/materials";

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
        const geometry = createParticleGeometry(count);
        const material = createParticleMaterial();
        const points = new THREE.Mesh(geometry, material);
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
                const pInfo = props.particleInfo();
                // uniforms: {
                //     lightDirection: { value: new THREE.Vector3(5, 0, 5).normalize() },
                //     time: { value: 0.0 },
                //     num: { value: 1800 },
                //     frac: { value: 0.5 },
                //     vr: { value: 1.0 },
                //     vw: { value: 0.5 }
                // }
                material.uniforms.num.value = pInfo.num * count;
                material.uniforms.frac.value = pInfo.fracR;
                material.uniforms.vr.value = pInfo.rVel;
                material.uniforms.vw.value = pInfo.wVel;

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