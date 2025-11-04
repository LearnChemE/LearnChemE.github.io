import { onCleanup, onMount } from "solid-js";
import * as THREE from "three";

type Props = {
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

        // Particles geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const color = new THREE.Color();
        const spread = 60;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // distribute in a sphere-ish volume
            const r = Math.cbrt(Math.random()) * spread;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // color gradient-ish
            color.setHSL((i / count) * 0.7, 0.8, 0.6);
            colors[i3 + 0] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        // Points material
        const material = new THREE.PointsMaterial({
            size: 1.6,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
            sizeAttenuation: true,
        });

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
            const dt = clock.getDelta();
            points.rotation.y += dt * 0.1;
            points.rotation.x += dt * 0.02;

            // subtle pulsate
            const s = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.05;
            points.scale.setScalar(s);

            renderer.render(scene, camera);
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