import * as THREE from 'three';
import { animate } from './helpers';
import { Presenter } from './Workers/presenter';
import type { InitConc, Profile } from '../types/globals';

const Starting_Vial_Concentrations: Array<InitConc> = [
    { xr0: 0.05, xw0: 0.05 },
    // { xr0: 0.15, xw0: 0.05 },
    // { xr0: 0.30, xw0: 0.05 },
    // { xr0: 0.45, xw0: 0.05 },
    // { xr0: 0.60, xw0: 0.05 },
];

/**
 * A class that incorporates a Presenter and a uniform for each vial
 * Steps the presenter, manages a loading state, and updates uniforms each frame.
 */
export class Vial {
    private presenter: Presenter;
    private uniform: THREE.ShaderMaterial["uniforms"] | null = null;
    private loading: boolean = false;

    constructor (initConc: InitConc) {
        this.presenter = new Presenter(initConc);
    }

    public evolve = (dt: number, _: number) => {
        const newProf = this.presenter.step(dt);
        this.updateUniform(newProf);
    }

    public setUniform = (uniform: THREE.ShaderMaterial["uniforms"]) => {
        this.uniform = uniform;
    }

    private updateUniform = (profile: Profile) => {
        if (this.uniform) {
            // console.log("uniform would be updated with", profile);
            // this.uniform.profile.value = profile;
        } else {
            console.warn("updateUniform called before Vial initialization");
        }
    }

    public reset = (ic: InitConc) => {
        // TODO: add reset message for web worker
    }

    public isLoading = () => {
        return this.loading;
    }
}

/**
 * Manages a collection of `Vial` instances representing vials in a cell sedimentation experiment.
 * Provides methods to attach shader uniforms, reset vial states, control animation playback, and reset animations.
 *
 * @remarks
 * - Vials are initialized using the `Starting_Vial_Concentrations` array.
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
        this.vials = Starting_Vial_Concentrations.map((ic) => new Vial(ic));
    }

    public attachUniforms = (uniforms: Array<THREE.ShaderMaterial["uniforms"]>) => {
        this.vials.forEach((vial, i) => {
            vial.setUniform(uniforms[i]);
        });
        this.play();
    }

    public play = () => {
        if (this.playing) return;
        this.playing = true;

        const frame = (dt: number, t: number) => {
            this.vials.forEach(vial => {
                vial.evolve(dt, t);
            });
            return this.playing;
        }

        animate(frame);
    }

    public reset = () => {
        this.playing = false;

        this.vials.forEach((vial, i) => {
            const ic = Starting_Vial_Concentrations[i];
            vial.reset(ic);
        });
    }
}