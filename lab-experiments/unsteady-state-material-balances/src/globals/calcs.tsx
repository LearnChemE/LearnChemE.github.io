import type { Accessor, Setter } from "solid-js";
import { animate } from "./helpers";
import { REACTOR_VOL_INIT } from "./config";
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
    const [ ppent, phex ] = getPsats(Tc);

    const ntot = Math.max(npent + nhex, 1e-12);
    const xpent = npent / ntot;
    const xhex  = 1 - xpent;

    const pn2 = P - (xpent * npent + xhex + nhex);

    const f_pent = FN2_mol_min * (xpent * ppent) / pn2; // mol / min out
    const f_hex  = FN2_mol_min * (xhex *  phex)  / pn2;
    
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
    private pressure: Accessor<number>;
    private ccs: Accessor<number>;
    private temp: Accessor<number>;
    private setVol: Setter<number>;

    private playing: boolean = false;
    private moles: Array<number>;

    constructor(pressure: Accessor<number>, ccs: Accessor<number>, temp: Accessor<number>, setVol: Setter<number>) {
        this.pressure = pressure;
        this.ccs = ccs;
        this.temp = temp;
        this.setVol = setVol;
        this.moles = molesFromVol(REACTOR_VOL_INIT, 0.5);
    }

    public play() {
        if (this.playing) return;
        this.playing = true;

        const frame = (dt: number) => {
            const y0 = this.moles;
            const Tc = this.temp();
            const P = 1 + this.pressure();
            const flow = this.ccs() / 83.14 / 298;
            
            const f = (t: number, y: Array<number>) => {
                return rhs(t, y, Tc, P, flow);
            }

            const sol = rk45_dormand_prince(f, y0, 0, dt);

            const newMoles = sol.y.at(-1)!;
            this.moles = newMoles;
            console.log(`moles: [${newMoles[0].toFixed(4)}, ${newMoles[1].toFixed(4)}]\nvol: ${volFromMoles(newMoles as [number, number]).toFixed(1)}`)
            this.setVol(volFromMoles(newMoles as [number, number]));

            return this.playing;
        }

        animate(frame);
    }
}