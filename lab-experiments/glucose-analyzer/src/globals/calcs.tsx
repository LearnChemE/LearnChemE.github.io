import type { Setter } from "solid-js";
// import { type FluidComposition } from "./config";
import type { AnimationTimer } from "./animate";
import rk45_dormand_prince from "./rk45";

export type FluidComposition = {
    rxnIdx: number;
    color: DyeEpsilon;
    conc: number;
};

// [glucose, h2o2, quinoneimine]
export const RXN_IDX_RGNT = -2;
export const RXN_IDX_NONE = -1;
export const RXN_IDX_GLUC = 0;
export const RXN_IDX_H2O2 = 1;
// const RXN_IDX_QUIN = 2;

export const AnimationRxnDelay = 2;

export class Vec3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x; this.y = y; this.z = z;
    }

    protected create(x: number, y: number, z: number): this {
        const Ctor = this.constructor as new (x: number, y: number, z: number) => this;
        return new Ctor(x, y, z);
    }

    // RGB Aliases
    public get r(): number {
        return this.x;
    }
    public set r(value: number) {
        this.x = value;
    }
    public get g(): number {
        return this.y;
    }
    public set g(value: number) {
        this.y = value;
    }
    public get b(): number {
        return this.z;
    }
    public set b(value: number) {
        this.z = value;
    }

    mult(by: number) {
        return this.create(this.x * by, this.y * by, this.z * by);
    }

    dot(other: Vec3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other: Vec3) {
        return this.create(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    add(other: Vec3) {
        return this.create(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vec3) {
        return this.create(this.x - other.x, this.y - other.y, this.z - other.z);
    }
}

export class DyeEpsilon extends Vec3 { 
    static fromHex(col: string) {
        const [ r, g, b ] = hexToRBG(col);
        console.log(`r: ${r}, g: ${g}, b: ${b}`)

        return new DyeEpsilon(
            -Math.log10(r),
            -Math.log10(g),
            -Math.log10(b)
        );
    }

    mix(other: DyeEpsilon, ratio=1) {
        const volA = ratio;
        const volB = 1;
        const volTot = volA + volB;
        const diluteA =  this.mult(volA / volTot);
        const diluteB = other.mult(volB / volTot);

        return diluteA.add(diluteB) as DyeEpsilon;
    }

    toColorHex(conc=1, length=1) {
        const cl = conc * length;
        const toColFloat = (ep: number) => 10 ** -ep * cl;

        const rgb = [toColFloat(this.r), toColFloat(this.g), toColFloat(this.b)];
        return rgbToHex(rgb);
    }
}

const DyesRaw: Record<string, string> = {
    blue:   "#01FFFF",
    yellow: "#FFFF01",
    clear:  "#FFFFFF",
};

let epCache: Record<string, DyeEpsilon> | undefined;

function initEpsilon() {
    if (epCache) return epCache;
    const Epsilon: Record<string, DyeEpsilon> = {
        "Quinoneimine": new DyeEpsilon(0.1, 1.0, 0.3)
    };
    for (let key in DyesRaw) {
        Epsilon[key] = DyeEpsilon.fromHex(DyesRaw[key]);
    }

    epCache = Epsilon;
    return epCache;
}

export function dyeLookup(name: string) {
    return initEpsilon()[name];
}

function hexToRBG(hex: string) {
    const normalized = hex.trim().replace(/^#/, "");
    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        throw new Error("hexToRBG requires a 6-character hex code without alpha");
    }
    return [
        parseInt(normalized.slice(0, 2), 16) / 0xFF,
        parseInt(normalized.slice(2, 4), 16) / 0xFF,
        parseInt(normalized.slice(4, 6), 16) / 0xFF
    ];
}

function rgbToHex(rgb: number[]) {
    return "#" + rgb.map(val => Math.floor(val * 0xFF).toString(16).padStart(2, "0").toUpperCase()).join("");
}

const Km = 0.032; // mM
const r1max = 0.0075; // mmol/s
const c_o2 = 0.27; // mM
const c_enz = 3184; // M

const k1 = 10;
const k2 = 11785649;
const k3 = 53687092;
const k4 = 14260635;
const k5 = 1178566;

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

    public resetAmts() {
        this.glucose = 0;
        this.h2o2 = 0;
        this.quinoneimine = 0;
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
        // console.log(y0)
        const rxns = this.createRhs();
        
        const sol = rk45_dormand_prince(rxns, y0, 0, dt);
        const [gluc, h2o2, quin] = sol.y.at(-1)!;

        this.glucose = gluc;
        this.h2o2 = h2o2;
        this.quinoneimine = quin;

        this.updateColor();
    }
}