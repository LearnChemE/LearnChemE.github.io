import { onCleanup, onMount, type Component } from "solid-js";
import * as THREE from "three";
import "./ThreeCanvas.css";
import { animate, constrain, createDrag } from "../../ts/helpers";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import glb from "../../assets/cellSedimentation.glb";

const asp = 16 / 9;
const r_th = Math.exp(-3);

const Sin = (th: number) => {
    return Math.sin(th * Math.PI / 180);
}
const Cos = (th: number) => {
    return Math.cos(th * Math.PI / 180);
}

interface ThreeCanvasProps {};

export const ThreeCanvas: Component<ThreeCanvasProps> = ({}) => {
    let canvas!: HTMLCanvasElement;
    let scene!: THREE.Scene;
    let camera!: THREE.PerspectiveCamera;
    let renderer!: THREE.WebGLRenderer;
    let composer!: EffectComposer;

    // State
    let th=0, ph=0;
    let tth=0, tph=0;

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

        if (renderer && camera && composer) {
            renderer.setSize(width, height, false);
            composer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
        }
    }

    // Drag to rotate
    const drag = createDrag((pt, pv) => {
        const dx = pt.x - pv.x;
        const dy = pt.y - pv.y;
        tth += 180 * dx / canvas.width;  tth = constrain(tth, -90, 90);
        tph += 180 * dy / canvas.height; tph = constrain(tph, -90, 90);
    }, () => {
        tth = th;
        tph = ph;
    }, () => {
        tth = 0;
        tph = 0;
    });

    onMount(() => {
        // Initialize WebGL, Matrix stack, etc.
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(49, asp, .1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor("rgb(255,255,255)");

        // scene.add(cube);
        camera.position.z = 4;
        
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

        // Add renderer to composer object and create render pass
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        // Add outline pass
        const outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth * 1, window.innerHeight * 1),
            scene,
            camera
        )
        // Outline pass settings
        outlinePass.edgeStrength = 3;
        outlinePass.edgeGlow = 0;
        outlinePass.edgeThickness = .5;
        outlinePass.visibleEdgeColor.set("rgba(0,0,0,1)");
        outlinePass.overlayMaterial.blending = THREE.NormalBlending;
        // outlinePass.hiddenEdgeColor.set(0x00ff00);
        composer.addPass(outlinePass);

        // FXAA Anti-aliasing
        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.material.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight);
        composer.addPass(fxaaPass);

        // Base matrix
        const base = new THREE.Matrix4();
        base.makeRotationX(-Math.PI / 2);
        base.scale(new THREE.Vector3(.01, .01, .01));

        // Start loading
        const loader = new GLTFLoader();
        let model!: THREE.Group<THREE.Object3DEventMap>;
        loader.load(glb, gltf => {
            model = gltf.scene;
            model.traverse(obj => {
                if ((obj as THREE.Mesh).isMesh) {
                    const mesh = obj as THREE.Mesh;
                    if (mesh.material) {
                        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

                        for (const mat of materials) {
                            mat.transparent = true;
                            mat.side = THREE.DoubleSide;
                            if (mat.name.startsWith("Glass")) {
                                mat.opacity = .1;
                            }
                        }
                    }
                }
            })
            model.matrixAutoUpdate = false;
            model.matrix.copy(base);
            scene.add(model);
            outlinePass.selectedObjects.push(model);
        });

        // Main loop
        const frame = (dt: number) => {
            // Lerp th, ph
            th = (th - tth) * r_th ** dt + tth;
            ph = (ph - tph) * r_th ** dt + tph;

            if (model) {
                model.matrix.copy(base);
                // model.matrix.multiply(tempMatrix.makeRotationX(ph * Math.PI / 180));
                // model.matrix.multiply(tempMatrix.makeRotationZ(th * Math.PI / 180));
                // model.matrixWorldNeedsUpdate = true;
            }
            camera.position.set(-4 * Sin(th) * Cos(ph), 4 * Sin(ph), 4 * Cos(th) * Cos(ph));
            camera.lookAt(0,0,0);

            composer.render();
            return true;
        }

        resizeCanvas();
        animate(frame);

        canvas.style = "";
        window.addEventListener("resize", resizeCanvas);
        onCleanup(() => renderer.dispose());
    });

    return (<>
        <canvas 
            ref={canvas}
            onPointerDown={drag}
        />
    </>);
}