import { stageEfficiency } from "./signals";
import { animate, smoothLerp } from "./helpers";
import { createContext, createSignal, type Accessor, type Setter } from "solid-js";
import { feedPPM } from "./signals";

// Context for column calculations
export type ColumnContextType = {
    column?: ColumnCalc;
    columnCreated: Accessor<boolean>;
    setColumnCreated: Setter<boolean>;
};
export const ColumnContext = createContext<ColumnContextType>();
export const ColumnContextProvider = (props: { children: any }) => {
    const [columnCreated, setColumnCreated] = createSignal(false);
    const store: ColumnContextType = { columnCreated, setColumnCreated };

    return (
    <ColumnContext.Provider value={store}>
        {props.children}
    </ColumnContext.Provider>
    );
}

// function intersection(line1: { slope: number, intercept: number }, line2: { slope: number, intercept: number }) {
//     if (line1.slope === line2.slope) {
//         return null; // Lines are parallel
//     }

//     const x = (line2.intercept - line1.intercept) / (line1.slope - line2.slope);
//     const y = line1.slope * x + line1.intercept;
//     return [x, y];
// }

// export function separate(x: number, y: number): number[] {
//     const tieline = findTieline(x, y);
//     const intersections = findEnvelopeIntersections(tieline);

//     // Tests to make sure the stream should actually be separated
//     if (intersections.length !== 2) { // Definitely outside phase envelope if there are not 2 intersections
//         return [[x, y]];
//     }
//     else if (intersections[0][0] >= x || intersections[1][0] <= x) { // Left or right of phase envelope
//         return [[x, y]];
//     }

//     return intersections; // Return in order of decreasing chloroform concentration
// }

// export function molarMass(comp: Composition) {
//     const xc = comp[0];
//     const xa = comp[1];
//     const xw = 1 - xc - xa;
//     return xc * MM_C + xa * MM_AA + xw * MM_W; // g solution / 1 mol
// }

// Constants to be used
const Ea = 5000;
const R = 8.314;
const T0 = 298;
const H0 = 211.19;
export function Henrys(T: number) {
    return H0 * Math.exp(-Ea / R * (1 / (T + 273) - 1 / T0));
}

export type Stream = {
    ndot: number;
    ppm: number;
}

const STAGE_LIQ_MOLES = 1;
const STAGE_GAS_VOL = .5; // L
class Stage {
    private liqOut: Stream = { ndot: 0, ppm: feedPPM() };
    private vapOut: Stream = { ndot: 0, ppm: 0 };

    private liqIn: () => Stream;
    private vapIn: (() => Stream) | null = null;
    private eff: number;

    private ppm = feedPPM();

    constructor(liqIn: () => Stream, efficiency = 1) {
        this.liqIn = liqIn;

        this.eff = efficiency;
    }

    public setVapIn(vapIn: () => Stream) {
        this.vapIn = vapIn;
    }

    public vapStream(): Stream {
        return this.vapOut;
    }

    public liqStream(): Stream {
        return this.liqOut;
    }

    public equilibrium(T: number, P: number, dt: number) {
        if (P === 0) return;
        const lin = this.liqIn();
        const vin = this.vapIn!();
        const L = lin.ndot;
        const xn1 = lin.ppm;
        const V = vin.ndot;
        const yn1 = vin.ppm;
        
        const m = Henrys(T) / P; // y_n = m * x_n
        // eqm: yn = m * xn =>
        // meb: in = out (S.S.) => 
        //      xn1 * L + yn1 * V = xn * L + yn * V
        //      (in) = xn * L + m * xn * V = xn * (L + m * V)
        //    ∴ xn = (in) / (L + m * V)
        const n_in = xn1 * L + yn1 * V;
        const denom = L + m * V
        const xn = (denom !== 0) ? n_in / (L + m * V) : this.liqOut.ppm;
        const yn = (denom !== 0) ? m * xn : this.vapOut.ppm;

        let liqTarg, vapTarg;
        if (this.eff !== 1) {
            // Update
            liqTarg = { ndot: L, ppm: this.eff * (xn - xn1) + xn1 };
            vapTarg = { ndot: V, ppm: this.eff * (yn - yn1) + yn1 };
        }
        else {
            // Update
            liqTarg = { ndot: L, ppm: xn };
            vapTarg = { ndot: V, ppm: yn };
        }

        const liqTau = STAGE_LIQ_MOLES / Math.max(L, 0.1);
        // tau = V / Vdot
        // P Vdot = ndot R T => Vdot = ndot R T / P
        // tau = P * V / ndot / R / T
        const vapTau = P * STAGE_GAS_VOL / Math.max(V, 0.1) / 0.08314 / T;
        const rl = Math.exp(-1 / liqTau);
        const rv = Math.exp(-1 / vapTau);

        this.liqOut = { ndot: smoothLerp(this.liqOut.ndot, liqTarg.ndot, rl, dt), ppm: smoothLerp(this.liqOut.ppm, liqTarg.ppm, rl, dt) };
        this.vapOut = { ndot: smoothLerp(this.vapOut.ndot, vapTarg.ndot, rv, dt), ppm: smoothLerp(this.vapOut.ppm, vapTarg.ppm, rv, dt) };
    }

    // Mixing
    public massBal(deltaTime: number, P: number) {
        const lin = this.liqIn();
        const vin = this.vapIn!();
        const L = lin.ndot;
        const xn1 = lin.ppm;
        const V = vin.ndot;
        const yn1 = vin.ppm;
        const lout = this.liqOut;
        const vout = this.vapOut;

        const dndt = xn1 * L + yn1 * V - lout.ppm * lout.ndot - vout.ppm * vout.ndot; // * 1e-6
        const stage_capac = STAGE_LIQ_MOLES + P * STAGE_GAS_VOL / 0.08314 / T0;
        const dppmdt = dndt / stage_capac; // * 1e-6 * 1e+6

        this.ppm += dppmdt * deltaTime;
    }
}

type DebugInfo = {
    liqIn: Accessor<Stream>
    vapIn: Accessor<Stream>;
}

export class ColumnCalc {
    private stages: Stage[];
    private playing: boolean = false;
    public updated: Accessor<boolean>;
    private setUpdated: Setter<boolean>;
    private getPressure: Accessor<number>;
    private debugInfo: DebugInfo;

    constructor(numStages: number, liqFeed: () => Stream, gasFeed: () => Stream, gasPressure: () => number) {
        const eff = stageEfficiency();
        this.stages = [];
        // Construct stages with appropriate feed streams.
        this.stages.push(new Stage(liqFeed, eff));
        for (let i = 1; i < numStages; i++) {
            const prevLiqOut = this.stages[i - 1].liqStream.bind(this.stages[i - 1]);
            this.stages.push(new Stage(prevLiqOut, eff));
        }
        // Set vapor stream of each stage to be the solvent input of the previous stage
        for (let i = 0; i < numStages - 1; i++) {
            const nextVapOut = this.stages[i + 1].vapStream.bind(this.stages[i + 1]);
            this.stages[i].setVapIn(nextVapOut);
        }
        // Set solvent input of the last stage to be the solvent feed
        this.stages[numStages - 1].setVapIn(gasFeed);

        // Set up updated signal so other scopes can react to changes in the column
        const [updated, setUpdated] = createSignal(false);
        this.updated = updated;
        this.setUpdated = setUpdated;
        this.getPressure = gasPressure;

        // Debug info
        this.debugInfo = { liqIn: liqFeed, vapIn: gasFeed };
    }

    public vapOut(): Stream {
        return this.stages[this.stages.length - 1].vapStream();
    }

    public liqOut(): Stream {
        return this.stages[0].liqStream();
    }

    private evolve(deltaTime: number) {
        const T = T0;
        const P = this.getPressure() + 1;
        // Iterate mass balance
        // for (const stage of this.stages) {
        //     stage.massBal(deltaTime, P);
        //     if (stage.vapStream().ndot < 0) throw new Error("gas rate under in evolve");
        // }
        // Solve eqm
        for (const stage of this.stages) {
            stage.equilibrium(T, P, deltaTime);
            if (stage.vapStream().ndot < 0) throw new Error(`gas under in settle`);
        }
    }

    public start() {
        if (this.playing) return;
        this.playing = true;
        
        const frame = (deltaTime: number) => {
            this.evolve(deltaTime);
            this.setUpdated(u => !u); // Trigger update for any listening scopes
            return this.playing;
        }

        animate(frame);
    }

    public stop() {
        this.playing = false;
    }

    public viewPPM(stageIdx: number, stream: "liquid" | "vapor"): number {
        const stage = this.stages[stageIdx];
        const str = stream === "liquid" ? stage.liqStream() : stage.vapStream();
        return str.ppm;
    }

    public currentPressure() {
        return this.getPressure();
    }

    public operatingLine() {
        const { liqIn, vapIn } = this.debugInfo;
        const lin = liqIn();
        const vin = vapIn();
        const vout = this.stages[0].vapStream();
        const slope = lin.ndot / vin.ndot;
        const intercept = (vout.ppm - slope * lin.ppm);
        return { slope, intercept };
    }
}
