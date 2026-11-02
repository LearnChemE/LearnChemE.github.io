
import type { Accessor } from "solid-js";
import { deadTime, N_GC } from "./config";

export type GCResult = {
    t: Array<number>,
    y: Array<number>,
    progress: Accessor<number>,
};

export type GCRunSettings = {
    temp: number;
    runTime: number;
};

export type GCComponentData = {
    alpha: number;
    beta: number;
}

export type GCInputComponent = {
    data: GCComponentData;
    amount: number;
}

export type GCRuntimeComponent = {
    amount: number;
    timeDependant: (t: number) => number;
}

export type ComponentName = "Ethanol" | "AceticAcid" | "EthylAcetate" | "Water" | "InStd";

function createRuntimeComponent(component: GCInputComponent, temperature: number): GCRuntimeComponent {
    const { data, amount } = component;
    const k = data.alpha * Math.exp(data.beta / temperature);
    const tr = deadTime * (1 + k);
    const sigma = tr / Math.sqrt(N_GC);
    const timeDependant = (t: number) => 
        amount * Math.exp(- ((t - tr) ** 2) / 2 * sigma ** 2) / (sigma * Math.sqrt(2 * Math.PI));
    
    return {
        amount,
        timeDependant,
    };
}

export const ComponentData: Record<ComponentName, GCComponentData> = {
    Ethanol      : { alpha: 1, beta: 1 },
    AceticAcid   : { alpha: 2, beta: 2 },
    EthylAcetate : { alpha: 3, beta: 3 },
    Water        : { alpha: 4, beta: 4 },
    InStd        : { alpha: 0, beta: 0 },
};

export function createResponseFunction(components: Array<GCInputComponent>, ovenTemp: number) {
    const runtimeComponents = components.map(component => createRuntimeComponent(component, ovenTemp)); 

    return (time: number) => {
        return runtimeComponents.reduce((acc, component) => {
            return acc + component.amount * component.timeDependant(time);
        }, 0);
    };
}

export function calculateResponseArray(responseFunction: (time: number) => number, timeArray: Array<number>): Array<number> {
    return timeArray.map(time => responseFunction(time));
}