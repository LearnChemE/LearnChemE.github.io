export const svgNS = "http://www.w3.org/2000/svg";

export type EvaporatorState = {
    feedFlow: ControlType,
    feedTemp: ControlType,

    steamFlow: number,
    steamTemp: number,
    steamPres: number,

    evapFlow: number,

    concFlow: number,
    concTemp: number,
    concComp: number
}

export type LabelRange = {
    range: [min: number, max: number],
    overflowString: string,
    underflowString: string
}

export type DigitalLabelDescriptor = {
    id: string,
    gid: string,
    centerId: string,
    fill: string,
    units: string,
    decimals: number,
    initialValue: number,
    range?: LabelRange
};

export type AnimationFn = (dt: number) => void;

export interface ControlType {
    setpoint: number;
    value: number;
    iterate: (dt: number) => void;
    setTimeDelay: (val: number, th?: number) => void;
}

export type SetpointControlDescriptor<T extends ControlType> = {
    ctrl: T | null,
    upBtnId: string,
    downBtnId: string,
    spLabel: DigitalLabel,
    outLabel: DigitalLabel,
    min: number,
    max: number,
    step: number
}