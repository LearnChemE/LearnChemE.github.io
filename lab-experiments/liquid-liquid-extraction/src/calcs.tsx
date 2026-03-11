import { stageEfficiency } from "./globals";
import { FEED_COMP } from "./ts/config";
import { animate } from "./ts/helpers";
import { createContext, createSignal, type Accessor, type Setter } from "solid-js";

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

export type Composition = [chloroform: number, aceticAcid: number];

// [chloroform, aceticAcid]
export const envelope: Array<Composition> = [
[0, 0],
[0.006723494384826844,   0.044967475764421366],
[0.013662149462809775,   0.08672298897424133],
[0.018091976199633646,   0.11402467068835438],
[0.028027433139061933,   0.15256822134357292],
[0.03657206949434563,    0.19111177199879126],
[0.04458652803810925,    0.21680747243560344],
[0.0506223360522339,     0.24089719159511497],
[0.061633596457442735,   0.2633809294773257],
[0.07242969616949568,    0.28907662991413796],
[0.08563476779749957,    0.309954386519048],
[0.09825200948000934,    0.3292261618466572],
[0.11541438216729108,    0.3533158810061688],
[0.13578871740917448,    0.37098167505647706],
[0.15300874223043037,    0.38382952527488323],
[0.1738133988586259,     0.3950713942159887],
[0.19542104612547187,    0.40470728187979327],
[0.225803938283498,      0.4079192444343948],
[0.25698982108017443,    0.40952522571169553],
[0.2864122140403682,     0.406313263157094],
[0.32878231364417576,    0.3966773754932895],
[0.37634302633222394,    0.38222354399758257],
[0.4312881633273076,     0.36134578739267253],
[0.4751067356492341,     0.3404680307877625],
[0.5147528462187269,     0.3195902741828525],
[0.5590804942065565,     0.29630354566199135],
[0.6016446523579032,     0.268198873309228],
[0.6472843666502867,     0.24089719159511494],
[0.6857548173287906,     0.21680747243560342],
[0.7384062866758714,     0.17826392178038514],
[0.7746829261315804,     0.15578018389817438],
[0.8111747262804454,     0.1300844834613621],
[0.8468635357906604,     0.10599476430185048],
[0.8855491471623204,     0.07869308258773748],
[0.9330100034251607,     0.044967475764421394],
[0.9645263511829413,     0.020877756604909984],
[0.9964153681930602,     0.0016059812773008206],
[1, 0]
];

const tiePts: Composition[][] = [
    [[0, 0], [1, 0]],
    [[0.021030279370202187, 0.11050532198081608],
    [0.9083300821531416, 0.06406105622076279]],
    [[0.05325583858745653, 0.24022896082786083],
    [0.8116985134474901, 0.12972363884704488]],
    [[0.09995262766565477, 0.329914439536929],
    [0.7049290791707452, 0.20179232709540307]],
    [[0.16522404204955807, 0.39077244294665375],
    [0.6027496602570491, 0.2674549097216851]],
]

function generateTieLines() {
    const lines: Array<{ slope: number, intercept: number }> = [];
    tiePts.forEach(ptSet => {
        const [pt1, pt2] = ptSet;
        const slope = (pt2[1] - pt1[1]) / (pt2[0] - pt1[0]);
        const intercept = pt1[1] - slope * pt1[0];
        lines.push({ slope, intercept });
    });
    return lines;
}

const tieLines = generateTieLines();

function findTieline(x: number, y: number) {
    // Find what lines surround x and y
    let nearestUnder = tieLines[0];
    let nearestOver = undefined;
    for (const { slope, intercept } of tieLines) {
        const yofx = slope * x + intercept;
        if (yofx === y) { // If the point is exactly on a tieline, just return that tieline
            return { slope, intercept };
        }
        if (yofx < y) {
            nearestUnder = { slope, intercept };
        } else {
            nearestOver = { slope, intercept };
            break;
        }
    }

    let slope;
    // If nearest over wasn't set, we are above the top line
    if (!nearestOver) {
        slope = nearestUnder.slope;
    }
    else {
        // Use lever rule to determine slope (linear interpolation)
        const yofxUnder = nearestUnder.slope * x + nearestUnder.intercept;
        const yofxOver = nearestOver.slope * x + nearestOver.intercept;
        // console.log(`x: ${x}, y: ${y}`);
        // console.log(`yofxUnder: ${yofxUnder}, yofxOver: ${yofxOver}\nunderSlope: ${nearestUnder.slope}, overSlope: ${nearestOver.slope}`);
        const dif = yofxOver - yofxUnder;
        slope = nearestUnder.slope * (yofxOver - y) / dif + nearestOver.slope * (y - yofxUnder) / dif;
    }

    // Calculate intercept using point-slope form
    const intercept = y - slope * x;
    return { slope, intercept };
}

function intersection(line1: { slope: number, intercept: number }, line2: { slope: number, intercept: number }) {
    if (line1.slope === line2.slope) {
        return null; // Lines are parallel
    }

    const x = (line2.intercept - line1.intercept) / (line1.slope - line2.slope);
    const y = line1.slope * x + line1.intercept;
    return [x, y];
}

// TODO: Use a bounding volume heirarchy or something to speed this up
function findEnvelopeIntersections(line: { slope: number, intercept: number }) {
    const intersections: Array<Composition> = [];
    for (let i = 0; i < envelope.length - 1; i++) {
        const m = (envelope[i + 1][1] - envelope[i][1]) / (envelope[i + 1][0] - envelope[i][0]);
        const edgeLine = {
            slope: m,
            intercept: envelope[i][1] - m * envelope[i][0]
        };
        const intersectionPt = intersection(line, edgeLine);
        if (intersectionPt) {
            const [x, y] = intersectionPt;
            // Check if the intersection is within the bounds of the edge
            if ((x >= Math.min(envelope[i][0], envelope[i + 1][0]) && x <= Math.max(envelope[i][0], envelope[i + 1][0])) &&
                (y >= Math.min(envelope[i][1], envelope[i + 1][1]) && y <= Math.max(envelope[i][1], envelope[i + 1][1]))) {
                intersections.push([x, y]);
            }
        }
    }
    return intersections;
}

export function separate(x: number, y: number): Composition[] {
    const tieline = findTieline(x, y);
    const intersections = findEnvelopeIntersections(tieline);

    // Tests to make sure the stream should actually be separated
    if (intersections.length !== 2) { // Definitely outside phase envelope if there are not 2 intersections
        return [[x, y]];
    }
    else if (intersections[0][0] >= x || intersections[1][0] <= x) { // Left or right of phase envelope
        return [[x, y]];
    }

    // // If efficiency is less than 1, only return a portion of the intersections
    // if (leff < 1 || reff < 1) {
    //     const mixed: Composition[] = [[0, 0], [0, 0]];
    //     mixed[0][0] = x + leff * (intersections[0][0] - x);
    //     mixed[0][1] = y + leff * (intersections[0][1] - y);
    //     mixed[1][0] = x + reff * (intersections[1][0] - x);
    //     mixed[1][1] = y + reff * (intersections[1][1] - y);
    //     return { streams: mixed, pure: intersections };
    // }

    return intersections; // Return in order of decreasing chloroform concentration
}

const MM_AA = 60.052;
const MM_C = 119.38;
const MM_W = 18.01;
const CONC_PURE_AA = 1.05 / 60.05; // mol / cm3
const CONC_PURE_C  = 1.49 / 119.378; // mol / cm3
const CONC_PURE_W  = 1.00 / 18.01; // mol / cm3
/**
 * Calculate the specific volume using a known composition.
 * @param comp Composition [chloroform, acetic acid] in mole fraction
 * @returns specific volume (L / mol)
 */
export function specificVolume(comp: Composition) {
    const xc = comp[0];
    const xa = comp[1];
    const xw = 1 - xc - xa;
    return (xc / CONC_PURE_C + xa / CONC_PURE_AA + xw / CONC_PURE_W) / 1000; // Convert from cm3 / mol to L / mol
}

export function molarMass(comp: Composition) {
    const xc = comp[0];
    const xa = comp[1];
    const xw = 1 - xc - xa;
    return xc * MM_C + xa * MM_AA + xw * MM_W; // g solution / 1 mol
}

export type Stream = {
    ndot: number;
    comp: Composition;
}

const L_PER_STAGE = 5; // L
class Stage {
    private mixedComp: Composition = [0, 0];
    private raffinate: Composition;
    private extract: Composition;
    private rafObserved: Composition;
    private extObserved: Composition;
    private phi: number = 0; // Relative amount of raffinate vs extract (raffinate / (raffinate + extract))
    private ndot_out: number = 0;

    private orgIn: () => Stream;
    private aqIn: (() => Stream) | null = null;
    private leff: number;
    private reff: number;

    constructor(orgIn: () => Stream, efficiency = 1) {
        this.raffinate = [0, 0];
        this.extract = [0, 0];
        this.rafObserved = [0, 0];
        this.extObserved = [0, 0];
        this.orgIn = orgIn;

        this.leff = efficiency;
        this.reff = efficiency;
    }

    public setAqIn(aqIn: () => Stream) {
        this.aqIn = aqIn;
    }

    public settle() {
        const streams = separate(this.mixedComp[0], this.mixedComp[1]);
        const aqIn = this.aqIn!();
        const orgIn = this.orgIn();

        if (streams.length === 1) {
            // No separation, just one phase with the same composition as the mixed stream
            this.raffinate = this.mixedComp;
            this.extract = this.mixedComp;
            this.rafObserved = this.raffinate;
            this.extObserved = this.extract;
            const aq =  aqIn.ndot;
            const org = orgIn.ndot;
            this.phi = (aq + org !== 0) ? org / (org + aq) : .5; // Just set phi based on relative flow rates since there is no separation

            // Use volume balance to determine the amount of each phase
            this.ndot_out = org + aq;
        }
        else {
            const raffComp = streams[1];
            const extComp = streams[0];
            this.rafObserved = raffComp;
            this.extObserved = extComp;

            // Determine the flowrates of each stream using 2x2 inverse matrix formula
            // Use water and overall mass balances because there will always be water in the system.
            const w_in = (1 - aqIn.comp[0] - aqIn.comp[1]) * aqIn.ndot + (1 - orgIn.comp[0] - orgIn.comp[1]) * orgIn.ndot;
            const n_in = aqIn.ndot + orgIn.ndot;
            const a = (1 - raffComp[0] - raffComp[1]), b = (1 - extComp[0] - extComp[0]), c = 1, d = 1;
            // Pre-calculate inverse of denominator
            if (a * d === c * b) throw new Error('non-invertable 2x2 matrix')
            const inv_denom = 1 / (a * d - c * b);
            // Solve for theoretical raffinate and extract flowrates
            let nr_t = (w_in * d - n_in * b) * inv_denom;
            let ne_t = (n_in * a - w_in * c) * inv_denom;

            if ((nr_t <= 0 && ne_t <= 0) || inv_denom !== inv_denom) {
                // No separation, just one phase with the same composition as the mixed stream
                this.raffinate = this.mixedComp;
                this.extract = this.mixedComp;
                this.rafObserved = this.raffinate;
                this.extObserved = this.extract;
                const aq =  aqIn.ndot;
                const org = orgIn.ndot;
                this.phi = (aq + org !== 0) ? org / (org + aq) : .5; // Just set phi based on relative flow rates since there is no separation

                // Use volume balance to determine the amount of each phase
                this.ndot_out = org + aq;
                return;
            }
            
            // Use efficiency formulas to determine actual flowrates
            // raffinate
            const xrw = 1 - raffComp[0] - raffComp[1], xow = 1 - orgIn.comp[0] - orgIn.comp[1]
            const nrc = this.leff * (raffComp[0] * nr_t - orgIn.comp[0] * orgIn.ndot) + orgIn.comp[0] * orgIn.ndot;
            const nra = this.leff * (raffComp[1] * nr_t - orgIn.comp[1] * orgIn.ndot) + orgIn.comp[1] * orgIn.ndot;
            const nrw = this.leff * (xrw * nr_t - xow * orgIn.ndot) + xow * orgIn.ndot;
            let nr = nrc + nra + nrw;
            // extract
            const xew = 1 - extComp[0] - extComp[1], xaw = 1 - aqIn.comp[0] - aqIn.comp[1];
            const nec = this.reff * (extComp[0] * ne_t - aqIn.comp[0] * aqIn.ndot) + aqIn.comp[0] * aqIn.ndot;
            const nea = this.reff * (extComp[1] * ne_t - aqIn.comp[1] * aqIn.ndot) + aqIn.comp[1] * aqIn.ndot;
            const n_ew= this.reff * (xew * ne_t - xaw * aqIn.ndot) + xaw * aqIn.ndot;
            let ne = nec + nea + n_ew;
            if (nr < 0) nr = 0;
            if (ne < 0) ne = 0;

            // Update extract and raffinate out streams
            this.raffinate = (nr !== 0) ? [ nrc / nr, nra / nr ] : raffComp;
            this.extract   = (ne !== 0) ? [ nec / ne, nea / ne ] : extComp;
            // Use balance to determine the amount of each phase
            if (nr + ne <= 0) return;
            this.phi = nr / (nr + ne);
            this.ndot_out = nr + ne;
        }
    }

    public raffStream(): Stream {
        const ndot = this.ndot_out * this.phi;

        return {
            ndot,
            comp: this.raffinate
        }
    }

    public extStream(): Stream {
        const ndot = this.ndot_out * (1 - this.phi);
        
        return {
            ndot,
            comp: this.extract
        }
    }

    public observe(which: "raffinate" | "extract") {
        if (which === "raffinate") {
            return this.rafObserved;
        } else {
            return this.extObserved;
        }
    }

    public evolve(deltaTime: number) {
        const orgInStream = this.orgIn();
        const aqInStream = this.aqIn!();
        const currMoles = L_PER_STAGE / specificVolume(this.mixedComp); // Convert from L to cm3

        // console.table(orgInStream)
        // console.table(aqInStream)
        const orgIn = orgInStream.ndot * deltaTime;
        const aqIn = aqInStream.ndot * deltaTime;
        const ntot = orgIn + aqIn + currMoles;
        for (let i = 0; i < 2; i++) {
            const xi = (orgInStream.comp[i] * orgIn + aqInStream.comp[i] * aqIn + currMoles * this.mixedComp[i]) / ntot;
            
            this.mixedComp[i] = xi;
        }

        // console.log(`Stage evolve: orgIn ${orgIn}, aqIn ${aqIn}, currMoles ${currMoles}, newComp ${this.mixedComp}`);
        // console.table({ index: this.index, orgIn, aqIn, currMoles, newComp: this.mixedComp });
    }
}

export class ColumnCalc {
    private stages: Stage[];
    private playing: boolean = false;
    public updated: Accessor<boolean>;
    private setUpdated: Setter<boolean>;

    constructor(numStages: number, feed: () => Stream, solvent: () => Stream) {
        const eff = numStages === 1 ? 1 : stageEfficiency();
        this.stages = [];
        // Construct stages with appropriate feed streams.
        this.stages.push(new Stage(feed, eff));
        for (let i = 1; i < numStages; i++) {
            const prevRaff = this.stages[i - 1].raffStream.bind(this.stages[i - 1]);
            this.stages.push(new Stage(prevRaff, eff));
        }
        // Set extract stream of each stage to be the solvent input of the previous stage
        for (let i = 0; i < numStages - 1; i++) {
            const nextExt = this.stages[i + 1].extStream.bind(this.stages[i + 1]);
            this.stages[i].setAqIn(nextExt);
        }
        // Set solvent input of the last stage to be the solvent feed
        this.stages[numStages - 1].setAqIn(solvent);

        // Set up updated signal so other scopes can react to changes in the column
        const [updated, setUpdated] = createSignal(false);
        this.updated = updated;
        this.setUpdated = setUpdated;
    }

    public raffinateOut(): Stream {
        return this.stages[this.stages.length - 1].raffStream();
    }

    public extractOut(): Stream {
        return this.stages[0].extStream();
    }

    private evolve(deltaTime: number) {
        // Iterate mass balance
        for (const stage of this.stages) {
            stage.evolve(deltaTime);
            if (stage.extStream().ndot < 0) throw new Error("ext under in evolve")
        }
        // Solve eqm
        for (const stage of this.stages) {
            stage.settle();
            if (stage.extStream().ndot < 0) throw new Error(`ext under in settle ${stage.extStream().comp}`)
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

    public viewComposition(stageIdx: number, stream: "raffinate" | "extract"): Composition {
        const stage = this.stages[stageIdx];
        return stage.observe(stream);
    }
}

export const FEED_SPECIFIC_VOL = specificVolume(FEED_COMP);
export const SOLV_SPECIFIC_VOL = specificVolume([0, 0]);