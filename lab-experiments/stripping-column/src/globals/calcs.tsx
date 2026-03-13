import { stageEfficiency } from "./signals";
import { animate } from "./helpers";
import { createContext, createSignal, type Accessor, type Setter } from "solid-js";
import { FEED_PPM } from "./config";

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

function intersection(line1: { slope: number, intercept: number }, line2: { slope: number, intercept: number }) {
    if (line1.slope === line2.slope) {
        return null; // Lines are parallel
    }

    const x = (line2.intercept - line1.intercept) / (line1.slope - line2.slope);
    const y = line1.slope * x + line1.intercept;
    return [x, y];
}

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

const CONC_PURE_AA = 1.05 / 60.05; // mol / cm3
const CONC_PURE_C  = 1.49 / 119.378; // mol / cm3
const CONC_PURE_W  = 1.00 / 18.01; // mol / cm3

// export function molarMass(comp: Composition) {
//     const xc = comp[0];
//     const xa = comp[1];
//     const xw = 1 - xc - xa;
//     return xc * MM_C + xa * MM_AA + xw * MM_W; // g solution / 1 mol
// }

export type Stream = {
    ndot: number;
    ppm: number;
}

const L_PER_STAGE = 5; // L
class Stage {
    private liqOut: Stream = { ndot: 0, ppm: FEED_PPM };
    private vapOut: Stream = { ndot: 0, ppm: 0 };

    private liqIn: () => Stream;
    private vapIn: (() => Stream) | null = null;
    private leff: number;
    private reff: number;

    constructor(liqIn: () => Stream, efficiency = 1) {
        this.liqIn = liqIn;

        this.leff = efficiency;
        this.reff = efficiency;
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

    public equilibrium() {
        
    }

    public massBal(deltaTime: number) {
        
    }
}

export class ColumnCalc {
    private stages: Stage[];
    private playing: boolean = false;
    public updated: Accessor<boolean>;
    private setUpdated: Setter<boolean>;

    constructor(numStages: number, liqFeed: () => Stream, gasFeed: () => Stream) {
        const eff = numStages === 1 ? 1 : stageEfficiency();
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
    }

    public vapOut(): Stream {
        return this.stages[this.stages.length - 1].vapStream();
    }

    public liqOut(): Stream {
        return this.stages[0].liqStream();
    }

    private evolve(deltaTime: number) {
        // Iterate mass balance
        for (const stage of this.stages) {
            stage.massBal(deltaTime);
            if (stage.vapStream().ndot < 0) throw new Error("gas rate under in evolve");
        }
        // Solve eqm
        for (const stage of this.stages) {
            stage.equilibrium();
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
}
