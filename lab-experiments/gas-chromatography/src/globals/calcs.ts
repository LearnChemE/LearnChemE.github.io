
import type { Accessor } from "solid-js";
import { deadTime, injectionErr, N_GC } from "./config";
import { transpose } from "./helpers";

export type GCResult = {
    t: Array<number>,
    fid: Array<number>,
    tcd: Array<number>,
    progress: Accessor<number>,
};

export type GCRunSettings = {
    temp: number;
    runTime: number;
};

export type GCComponentData = {
    alpha: number;
    beta: number;
    fidRF: number;
    tcdRF: number;
}

export type GCInputComponent = {
    data: GCComponentData;
    amount: number;
}

export type GCRuntimeComponent = {
    amountFID: number;
    amountTCD: number;
    timeDependant: (t: number) => number;
}

export type ComponentName = "Ethanol" | "AceticAcid" | "EthylAcetate" | "Water" | "InStd";

function createRuntimeComponent(component: GCInputComponent, temperature: number): GCRuntimeComponent {
    const { data, amount } = component;
    const amountFID = amount * data.fidRF;
    const amountTCD = amount * data.tcdRF;
    const k = data.alpha * Math.exp(data.beta / temperature);
    const tr = deadTime * (1 + k);
    const sigma = tr / Math.sqrt(N_GC);
    const timeDependant = (t: number) => 
        Math.exp(- ((t - tr) ** 2) / 2 * sigma ** 2) / (sigma * Math.sqrt(2 * Math.PI));

    return {
        amountFID,
        amountTCD,
        timeDependant,
    };
}

export const ComponentData: Record<ComponentName, GCComponentData> = {
    Ethanol      : { alpha: 1, beta: 1, fidRF: 1, tcdRF: 1 },
    AceticAcid   : { alpha: 2, beta: 2, fidRF: 2, tcdRF: 2 },
    EthylAcetate : { alpha: 3, beta: 3, fidRF: 3, tcdRF: 3 },
    Water        : { alpha: 4, beta: 4, fidRF: 4, tcdRF: 4 },
    InStd        : { alpha: 0, beta: 0, fidRF: 0, tcdRF: 0 },
};

function createResponseFunction(components: Array<GCInputComponent>, ovenTemp: number) {
    const runtimeComponents = components.map(component => createRuntimeComponent(component, ovenTemp)); 

    return (time: number) => {
        return runtimeComponents.reduce((acc, component) => {
            return {
                fid: acc.fid + component.amountFID * component.timeDependant(time),
                tcd: acc.tcd + component.amountTCD * component.timeDependant(time)
            }
        }, { fid: 0, tcd: 0 });
    };
}

export function calculateResponseArray(responseFunction: (time: number) => { fid: number, tcd: number }, timeArray: Array<number>): { fid: number[], tcd: number[] } {
    const arr = timeArray.map(time => { 
        const res = responseFunction(time);
        return [res.fid, res.tcd];
    });
    const trans = transpose(arr);
    return { fid: trans[0], tcd: trans[1] };
}

function actualInjectionVolume(setVol: number) {
    const randf = Math.random() * 2 - 1;
    return setVol + injectionErr * randf;
}

export type RunResults = {
    timeArr: number[];
    fidArr: number[];
    tcdArr: number[];
    response: (time: number) => { fid: number, tcd: number }
}

export function calculateRun(concentrations: Record<ComponentName, number>, ovenTemp: number, injectionVolume: number) {
    const injVol = actualInjectionVolume(injectionVolume);
    
    const components = Object.entries(concentrations).map(([name, concentration]) => ({
        data: ComponentData[name as ComponentName],
        amount: concentration * injVol
    }));
    const responseFunction = createResponseFunction(components, ovenTemp);
    return {
        timeArr: [],
        fidArr: [],
        tcdArr: [],
        response: responseFunction
    }
}

export function iterateRun(runResults: RunResults, time: number) {
    const { fid, tcd } = runResults.response(time);
    runResults.timeArr.push(time);
    runResults.fidArr.push(fid);
    runResults.tcdArr.push(tcd);
}