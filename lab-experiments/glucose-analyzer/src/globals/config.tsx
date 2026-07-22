import type { Setter } from "solid-js";
import type { AnimationTimer } from "./animate";
import { DyeEpsilon, dyeLookup } from "./calcs";
import rk45_dormand_prince from "./rk45";

export type FluidComposition = {
    rxnIdx: number;
    color: DyeEpsilon;
    conc: number;
};
export type MenuFluidType = { key: string, label: string, contains: FluidComposition }

// [glucose, h2o2, quinoneimine]
const RXN_IDX_RGNT = -2;
const RXN_IDX_NONE = -1;
const RXN_IDX_GLUC = 0;
const RXN_IDX_H2O2 = 1;
const RXN_IDX_QUIN = 2;

export const Fluids = [
    {
        key: "y-dye",
        label: "yellow dye",
        contains: { 
            rxnIdx: RXN_IDX_NONE, 
            color: dyeLookup("yellow"), 
            conc: 1
        },
    },
    {
        key: "b-dye",
        label: "blue dye",
        contains: { 
            rxnIdx: RXN_IDX_NONE,
            color: dyeLookup("blue"), 
            conc: 1 
        }
    },
    {
        key: "water",
        label: "water",
        contains: { 
            rxnIdx: RXN_IDX_NONE,
            color: dyeLookup("clear"), 
            conc: 1 
        }
    },
    {
        key: "reagent",
        label: "reagent solution",
        contains: {
            rxnIdx: RXN_IDX_RGNT,
            color: dyeLookup("clear"),
            conc: 1
        }
    },
    {
        key: "peroxides",
        label: "H₂O₂ solution",
        contains: {
            rxnIdx: RXN_IDX_H2O2,
            color: dyeLookup("clear"),
            conc: 1
        }
    },
    {
        key: "glucose",
        label: "D-glucose solution",
        contains: {
            rxnIdx: RXN_IDX_GLUC,
            color: dyeLookup("clear"),
            conc: 1
        }
    }
];

const Km = 0.032; // mM
const r1max = 0.0075; // mmol/s
const c_o2 = 0.27; // mM
const c_enz = 3184; // M

const k1 = 10;
const k2 = 11785649;
const k3 = 53687092;
const k4 = 14260635;
const k5 = 1178566;

const AnimationRxnDelay = 2;

export class RxnCalcs {
    private setColor: Setter<string>;
    private fluids: Array<FluidComposition>;
    private rxn1: boolean = false;

    private glucose = 0;
    private h2o2 = 0;
    private quinoneimine = 0;

    constructor(fluids: Array<FluidComposition>, timer: AnimationTimer, setColor: Setter<string>) {
        this.fluids = fluids;
        this.setColor = setColor;
        this.updateColor();
        this.updateRxns();

        timer.subscribe(this.onIterate.bind(this));
    }

    private updateColor() {
        if (this.rxn1) {
            const added_quin = dyeLookup("Quinoneimine").mult(this.quinoneimine);
            this.setColor(added_quin.toColorHex());
            return;
        }

        const dyes = this.fluids.map(fl => fl.color.mult(fl.conc));


        const sum = dyes.reduce((a, b) => a.add(b));
        this.setColor(sum.toColorHex());
    }

    private updateRxns() {
        const fs = this.fluids;
        const rxnIndices = fs.map(f => f.rxnIdx);
        const includesReagent = rxnIndices.includes(RXN_IDX_RGNT);
        if (!includesReagent) {
            this.rxn1 = false;
            return;
        }
        const includesGlucose = rxnIndices.includes(RXN_IDX_GLUC);
        const includesPeroxide = rxnIndices.includes(RXN_IDX_H2O2);

        this.rxn1 = includesGlucose || includesPeroxide;

        if (includesGlucose) {
            const glucFluid = this.fluids.find(f => f.rxnIdx === RXN_IDX_GLUC)!;
            this.glucose = glucFluid.conc / 2;
        }
        else if (includesPeroxide) {
            const perxFluid = this.fluids.find(f => f.rxnIdx === RXN_IDX_H2O2)!;
            this.h2o2 = perxFluid.conc / 2;
        }

        return;
    }

    public setFluids(fluids: Array<FluidComposition>) {
        this.fluids = fluids;
        this.updateColor();
        this.updateRxns();
    }

    private createRhs() {
        // [gluc, h2o2, dye]
        return (_: number, y: Array<number>) => {
            const gluc = y[RXN_IDX_GLUC];
            const h2o2 = y[RXN_IDX_H2O2];

            const rate_1 = r1max * h2o2 / (Km + h2o2);

            const numerator = k4 * c_enz * gluc;
            const parenth = k4 / k3 / c_o2 + k4 / (k2 + k5 * gluc) + 1;
            const denominator = k4 / k1 + gluc * parenth;
            const rate_2 = numerator / denominator;

            const r_gluc = -rate_2;
            const r_h2o2 = +rate_2 - rate_1;
            const r_quin = +rate_1;

            return [ r_gluc, r_h2o2, r_quin ];
        }
    }

    private onIterate(dt: number, t: number) {
        if (!this.rxn1) return;
        if (t < AnimationRxnDelay) return;
        
        const y0 = [this.glucose, this.h2o2, this.quinoneimine];
        console.log(y0)
        const rxns = this.createRhs();
        
        const sol = rk45_dormand_prince(rxns, y0, 0, dt);
        const [gluc, h2o2, quin] = sol.y.at(-1)!;

        this.glucose = gluc;
        this.h2o2 = h2o2;
        this.quinoneimine = quin;

        this.updateColor();
    }
}