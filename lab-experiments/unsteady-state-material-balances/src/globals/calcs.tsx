import type { Accessor, Setter } from "solid-js";
import { animate, gaussNoise } from "./helpers";
import { INIT_COMPOSITION, REACTOR_VOL_INIT } from "./config";
import rk45_dormand_prince from "./rk45";

const MW_PENT = 72.151;
const MW_HEX = 86.178;
const rho_p = .626;
const rho_h = .659;

const vPerMolPent = MW_PENT / rho_p; // cm^3/mol
const vPerMolHex  = MW_HEX  / rho_h; // cm^3/mol

type AntoineCoeff = { A: number, B: number, C: number };

const antoineCoeffs = {
  pentane:
    { A: 3.9892,  B: 1070.617, C: -40.454}, // "TminK": 268.8,  "TmaxK": 341.37
  hexane:
    { A: 4.00266, B: 1171.53,  C: -48.784}, // "TminK": 286.18, "TmaxK": 342.69 
}

function psat(coeffs: AntoineCoeff, tc: number) {
    const tk = tc + 273.15;
    const { A, B, C } = coeffs;
    const log10p = A - B / (tk + C);
    return 10 ** log10p;
}

function getPsats(Tc: number) {
    return [
        psat(antoineCoeffs.pentane, Tc),
        psat(antoineCoeffs.hexane,  Tc)
    ];
}

function rhs(_: number, y: Array<number>, Tc: number, P: number, FN2_mol_min: number) {
    const [ npent, nhex ] = y;
    const [ psatpent, psathex ] = getPsats(Tc);

    const ntot = npent + nhex;
    if (ntot <= 0) return [0, 0];
    const xpent = npent / ntot;
    const xhex  = 1 - xpent;

    const ppent = xpent * psatpent;
    const phex  = xhex  * psathex;

    const pn2 = P - ppent - phex;

    const f_pent = FN2_mol_min * ppent / pn2; // mol / min out
    const f_hex  = FN2_mol_min * phex  / pn2;
    
    return [ -f_pent, -f_hex ];
}

function molesFromVol(vol: number, xpent: number) {
    const xhex = 1 - xpent;

    const vBar = xpent * vPerMolPent + xhex * vPerMolHex; // cm^3/mol of total mixture for x=0.5
    const ntot = vol / vBar; // total moles initially
    return [xpent * ntot, xhex * ntot];
}

function volFromMoles(moles: [number, number]) {
    return vPerMolPent * moles[0] + vPerMolHex * moles[1];
}

export class MainLoop {
    // @ts-ignore
    private pressure: Accessor<number>;
    private sccm: Accessor<number>;
    private temp: Accessor<number>;
    private setVol: Setter<number>;

    private playing: boolean = false;
    private moles: Array<number>;
    private prevNoise: number = 0;

    constructor(pressure: Accessor<number>, sccm: Accessor<number>, temp: Accessor<number>, setVol: Setter<number>) {
        this.pressure = pressure;
        this.sccm = sccm;
        this.temp = temp;
        this.setVol = setVol;
        this.moles = molesFromVol(REACTOR_VOL_INIT, INIT_COMPOSITION);
    }

    public play() {
        if (this.playing) return;
        this.playing = true;

        const frame = (dt: number) => {
            dt *= 60; // scale up time by factor of 60 to match physical experiment
            const y0 = [...this.moles, this.prevNoise];
            const Tc = this.temp();
            // const P = 1 + this.pressure();
            const flow = this.sccm() / 83.14 / 298;
            
            // Add Ornstein-Uhlenbeck noise to the system
            const tau = 10; // Time constant for the noise
            const sigma = 0.1; // Standard deviation of the noise
            // generated each time step
            const dW = gaussNoise(0, sigma * Math.sqrt(dt)); // Wiener process increment
            
            const f = (t: number, y: Array<number>) => {
                const xn = Math.min(Math.max(y[2], -1), 1); // Ensure rate is in a reasonable range
                
                const yNoNoise = [y[0], y[1]];
                const rhsVals = rhs(t, yNoNoise, Tc, 1, flow);
                const dNoise = -xn / tau + dW / tau; // Ornstein-Uhlenbeck process for noise
                return [rhsVals[0] * (1 + xn), rhsVals[1] * (1 + xn), dNoise];
            }

            const sol = rk45_dormand_prince(f, y0, 0, dt);

            const newMoles = sol.y.at(-1)!;
            this.prevNoise = newMoles[2];
            // console.log(`Noise: ${this.prevNoise.toFixed(4)}`);
            // console.log(`Noise: ${this.prevNoise.toFixed(4)}`);
            this.moles = [newMoles[0], newMoles[1]];
            // console.log(`moles: [${newMoles[0].toFixed(4)}, ${newMoles[1].toFixed(4)}]\nvol: ${volFromMoles(newMoles as [number, number]).toFixed(1)}`)
            this.setVol(volFromMoles(newMoles as [number, number]));

            return this.playing;
        }

        animate(frame);
    }

    public reset() {
        this.moles = molesFromVol(REACTOR_VOL_INIT, INIT_COMPOSITION);
        this.setVol(REACTOR_VOL_INIT);
    }
}