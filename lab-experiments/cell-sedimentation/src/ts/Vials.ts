import * as THREE from 'three';
import { animate } from './helpers';
import { Presenter } from './Workers/presenter';
import type { InitConc, MagnifierParticleInfo, Profile } from '../types/globals';
import { conc_r, particle_velocities } from './calcs';
import type { Setter } from 'solid-js';

function getPInfoAtIndex(profile: Profile, index: number): MagnifierParticleInfo {
    const cr = profile[index + 2];
    const cw = profile[index + 502];
    return makePInfoFromConc(cr, cw);
}

const maxTotConc = conc_r(1);
function makePInfoFromConc(xr: number, xw: number): MagnifierParticleInfo {
    let cr = conc_r(xr);
    let cw = conc_r(xw);
    const { red, white } = particle_velocities(cr, cw);
    
    return {
        num: Math.min((cr + cw) / maxTotConc, 1),
        fracR: cr / (cr + cw),
        rVel: red,
        wVel: white
    }
}

/**
 * A class that incorporates a Presenter and a uniform for each vial
 * Steps the presenter, manages a loading state, and updates uniforms each frame.
 */
export class Vial {
    private presenter: Presenter;
    private uniform: THREE.ShaderMaterial["uniforms"] | null = null;
    private loading: boolean = false;
    private onChange?: (p: Profile) => void | undefined = undefined;
    private currentTime: number = 0;

    constructor (initConc: InitConc) {
        this.presenter = new Presenter(initConc);
    }

    public evolve = (dt: number) => {
        const result = this.presenter.step(dt);
        this.updateUniform(result.profile);
        this.onChange?.(result.profile);
        // Keep the current time so other objects can check that it's synchronized
        this.currentTime = result.profile[0];
        // Return true if ready; false if loading
        if (result.status === "ready") return true;
        else return false;
    }

    public setUniform = (uniform: THREE.ShaderMaterial["uniforms"]) => {
        this.uniform = uniform;
    }

    private updateUniform = (profile: Profile) => {
        if (this.uniform) {
            // console.log("uniform would be updated with", profile);
            this.uniform.profile.value = profile;
        } else {
            console.warn("updateUniform called before Vial initialization");
        }
    }

    public reset = (ic: InitConc) => {
        this.presenter.terminate();
        this.presenter = new Presenter(ic);
    }

    public isLoading = () => {
        return this.loading;
    }

    public attachPlot = (onProfileChange: (p: Profile) => void) => {
        this.onChange = onProfileChange;
    }

    public getParticleInfo = (y: number): MagnifierParticleInfo => {
        const cur = this.presenter.getCurrent();
        const top = cur[1];
        y = y - top;
        y = y * 499 / (305 - top);
        if (y < top) return {
            num: 0,
            fracR: 1,
            rVel: 0,
            wVel: 0
        }
        const i0 = Math.floor(y);
        if (i0 === 499) return getPInfoAtIndex(cur, 499);

        const xr = (i0 + 1 - y) * cur[i0 + 2] + (y - i0) * cur[i0 + 3];
        const xw = (i0 + 1 - y) * cur[i0 + 502] + (y - i0) * cur[i0 + 503];
        return makePInfoFromConc(xr, xw);
    }

    public getCurrentTime = () => {
        return this.currentTime;
    }
}

type PendingVial = {
    deltaTime: number;
    vial: Vial;
};

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
    private pendingVials: Array<PendingVial> = [];
    private currentTime: number = 0;
    private setLoading: Setter<boolean>;
    
    constructor(initialConcs: Array<InitConc>, setLoading: Setter<boolean>) {
        this.vials = initialConcs.map((ic) => new Vial(ic));
        this.setLoading = setLoading;
    }

    public attachUniforms = (uniforms: Array<THREE.ShaderMaterial["uniforms"]>) => {
        this.vials.forEach((vial, i) => {
            vial.setUniform(uniforms[i]);
            vial.evolve(0); // Initialize uniform
        });
    }

    private evolveAll = (dt: number) => {
        // Iterate the concurrent time
        this.currentTime += dt;
        // Calculate each vial
        this.vials.forEach(vial => {
            const ready = vial.evolve(dt);
            if (!ready) {
                this.pendingVials.push({ deltaTime: this.currentTime - vial.getCurrentTime(), vial });
                this.setLoading(true);
            }
        });
    }

    private checkPending = () => {
        for (const pending of this.pendingVials) {
            const { deltaTime, vial } = pending;
            const done = vial.evolve(deltaTime);

            // Filter out the vial if done
            if (done) this.pendingVials = this.pendingVials.filter((v) => v !== pending);
            // Update the delta time if still not caught up
            else pending.deltaTime = this.currentTime - vial.getCurrentTime();
        }

        // Return whether there are still loading vials
        return (this.pendingVials.length !== 0);
    }

    public play = () => {
        if (this.playing) return;
        this.playing = true;

        const frame = (dt: number, _: number) => {
            if (this.pendingVials.length > 0) {
                const stillLoading = this.checkPending();
                if (!stillLoading) this.setLoading(false);
            } else {
                this.evolveAll(dt);
            }
            
            return this.playing;
        }

        animate(frame);
    }

    public pause = () => {
        this.playing = false;
    }

    public reset = (ics: Array<InitConc>) => {
        this.playing = false;
        this.currentTime = 0;

        this.vials.forEach((vial, i) => {
            const ic = ics[i];
            vial.reset(ic);
        });
    }

    public attachPlot(vialIdx: number, onProfileChange: (p: Profile) => void) {
        this.vials[vialIdx].attachPlot(onProfileChange);
    }

    public getParticleInfo = (vial: number, y: number): MagnifierParticleInfo => {
        const v = this.vials[vial];

        return v.getParticleInfo(y);
    }

    public setLoadingCallback = () => {

    }
}