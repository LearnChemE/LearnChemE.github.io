import { easeInOutQuad, easeOutQuad, type AnimationSegmentDescriptor } from "./animate";

export const aniSeqDescriptors: Array<AnimationSegmentDescriptor> = [
    {
        name: "prep",
        duration: 1,
        easing: easeOutQuad
    },
    {
        name: "inject",
        duration: 2,
        easing: easeInOutQuad
    },
];

export const prepDesc: Partial<AnimationSegmentDescriptor> = {
    name: "prep",
    easing: easeOutQuad
};

export const injectDuration = 2;

export const InjectionState = {
    Idle: 0,
    Prepping: 1,
    InjReady: 2,
    Injecting: 3,
    Finished: 4
} as const;

export const minInjection = 0.5; // uL
export const maxInjection = 2.0; // uL
export const injectionErr = 0.15; // uL
export const deadTime = 60; // s
export const N_GC = 10000;
