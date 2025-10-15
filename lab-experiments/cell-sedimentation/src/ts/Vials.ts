import * as THREE from 'three';
import { animate } from './helpers';

export const CONC_ARRAY_SIZE = 128;
const Starting_Vial_Concentration = [
    [0.05, 0.05],
    [0.15, 0.05],
    [0.30, 0.05],
    [0.45, 0.05],
    [0.60, 0.05],
];

/**
 * Represents a vial containing concentrations of red and white cells.
 * 
 * This class manages the concentration arrays for red and white cells,
 * provides methods to evolve their state over time, and synchronizes
 * the data with a THREE.js uniform for rendering purposes.
 *
 * @remarks
 * - The concentrations are stored as `Float32Array` of fixed size.
 * - The `evolve` method is intended to update concentrations over time.
 * - The `setUniform` and `updateUniform` methods allow integration with THREE.js shaders.
 *
 * @example
 * ```typescript
 * const vial = new Vial(1.0, 0.5);
 * vial.evolve(0.1);
 * vial.setUniform(someUniform);
 * vial.updateUniform();
 * vial.reset(1.0, 0.5);
 * ```
 */
class Vial {
    private redConcentration: Float32Array;
    private whiteConcentration: Float32Array;

    private uniform: THREE.ShaderMaterial["uniforms"] | null = null;

    constructor (rConc: number, wConc: number) {
        this.redConcentration = new Float32Array(CONC_ARRAY_SIZE).fill(rConc);
        this.whiteConcentration = new Float32Array(CONC_ARRAY_SIZE).fill(wConc);
    }

    public evolve = (dt: number, t: number) => {
        [this.redConcentration, this.whiteConcentration].forEach(arr => {
            // Calculate first and second derivatives
            const dudx = new Float32Array(CONC_ARRAY_SIZE);
            const dudx2 = new Float32Array(CONC_ARRAY_SIZE);
            for (let i = 1; i < CONC_ARRAY_SIZE - 1; i++) {
                dudx[i] = (arr[i+1] - arr[i-1]) / 2;
                dudx2[i] = arr[i+1] - 2 * arr[i] + arr[i-1];
            }
            dudx[0] = dudx[CONC_ARRAY_SIZE - 1] = 0;
            dudx2[0] = dudx2[CONC_ARRAY_SIZE - 1] = 0;

            // Update concentration using a simple finite difference scheme
            for (let i = 0; i < CONC_ARRAY_SIZE; i++) {
                // Calculate settling 
                arr[i] += dt * (0.01 * dudx2[i] - 5 * dudx[i]);
            }
            arr[CONC_ARRAY_SIZE - 1] = 0; // Ensure bottom concentration is zero
        });
    }

    public setUniform = (uniform: THREE.ShaderMaterial["uniforms"]) => {
        this.uniform = uniform;
    }

    public updateUniform = () => {
        if (this.uniform) {
            this.uniform.redConcentration.value = this.redConcentration;
            this.uniform.whiteConcentration.value = this.whiteConcentration;
        }
    }

    public reset = (rConc: number, wConc: number) => {
        this.redConcentration.fill(rConc);
        this.whiteConcentration.fill(wConc);
    }
}

/**
 * Manages a collection of `Vial` instances representing vials in a cell sedimentation experiment.
 * Provides methods to attach shader uniforms, reset vial states, control animation playback, and reset animations.
 *
 * @remarks
 * - Vials are initialized using the `Starting_Vial_Concentration` array.
 * - Animation is controlled via the `play` and `resetAnimation` methods.
 *
 * @example
 * ```typescript
 * const vials = new Vials();
 * vials.attachUniforms(uniformsArray);
 * vials.play();
 * ```
 */
export class VialsArray {
    private vials: Array<Vial>;
    private playing: boolean = false;

    constructor() {
        this.vials = Starting_Vial_Concentration.map(([r,w]) => new Vial(r,w));
    }

    public attachUniforms = (uniforms: Array<THREE.ShaderMaterial["uniforms"]>) => {
        this.vials.forEach((vial, i) => {
            vial.setUniform(uniforms[i]);
        });
        this.play();
    }

    public reset = () => {
        this.vials.forEach((vial, i) => {
            const [r,w] = Starting_Vial_Concentration[i];
            vial.reset(r,w);
        });
    }

    public play = () => {
        if (this.playing) return;
        this.playing = true;

        const frame = (dt: number, t: number) => {
            this.vials.forEach(vial => {
                vial.evolve(dt, t);
                vial.updateUniform();
            });
            return this.playing;
        }

        animate(frame);
    }

    public resetAnimation = () => {
        this.playing = false;

        this.vials.forEach((vial, i) => {
            const [r,w] = Starting_Vial_Concentration[i];
            vial.reset(r,w);
            vial.updateUniform();
        });

        setTimeout(() => { this.play(); }, 1000);
    }
}