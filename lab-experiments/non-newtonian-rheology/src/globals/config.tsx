import { easeInOutQuad, easeInQuad, easeOutQuad, linear, type AnimationSegmentDescriptor } from "./animate";

export const RPM_MAX = 200;
export const RPM_STEP = 10;

// export type AnimationSegmentDescriptor = {
//     name: string;
//     duration: number;
//     easing: EasingFn | undefined;
// }

export const transitionDescriptors: Array<AnimationSegmentDescriptor> = [
    {
        name: "fade-out",
        duration: 1,
        easing: easeOutQuad
    },
    {
        name: "rotate",
        duration: 2,
        easing: easeInOutQuad
    },
    {
        name: "fade-in",
        duration: 1,
        easing: easeOutQuad
    }
];

export type FluidProps = {
    density: number;
    flowConsistencyIdx: number;
    flowBehaviorIdx: number;
    shearThreshold: number;
}

export const FluidProps = (density: number, k: number, n: number=1, t0: number=0): FluidProps => {
    return {
        density,
        flowConsistencyIdx: k, // Pa s^n
        flowBehaviorIdx: n, // dimless
        shearThreshold: t0 // Pa
    }
}

export type MenuFluidType = {
    key: string;
    label: string;
    color: string;
    props: FluidProps;
    scaleMax: number;
}

export const Fluids: Array<MenuFluidType> = [
    {
        key: "water",
        label: "water",
        color: "#115fa899",
        props: FluidProps(.997, 0.0089),
        scaleMax: 20
    },
    {
        key: "ketchup",
        label: "ketchup",
        color: "#b10000",
        props: FluidProps(1.11, 19.34, 0.228),
        scaleMax: 200
    },
    {
        key: "cornstarch",
        label: "cornstarch solution",
        color: "#7dbae0c4",
        props: FluidProps(1.2, 0.389, 1.15),
        scaleMax: 50
    },
    {
        key: "mayo",
        label: "mayonnaise",
        color: "#f3f3a7",
        props: FluidProps(0.91, 71.3, 0.3, 78.8),
        scaleMax: 1000
    },
    {
        key: "toothepaste",
        label: "toothepaste",
        color: "#00ff77",
        props: FluidProps(1.3, 0.55, 0.78, 92),
        scaleMax: 250
    }
];