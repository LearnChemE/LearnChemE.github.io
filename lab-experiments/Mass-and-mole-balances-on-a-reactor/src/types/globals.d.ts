
export interface Label {
    setLabel: (val: number) => void;
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
    signal?: Signal<number>
    range?: LabelRange
};

export type AnalogLabelDescriptor = {
    id: string,
    centerId: string,
    units: string,
    decimals: number,
    initialValue: number,
    flipToBottom: boolean
};

export interface ControlType {
    setpoint: number;
    value: number;
    iterate: (dt: number) => number;
    set: (val: number, th?: number) => Promise<void>;
    get: () => number;
}

export type SetpointControlDescriptor<T extends ControlType> = {
    ctrl: T | null,
    upBtnId: string,
    downBtnId: string,
    spLabel: DigitalLabel | null,
    outLabel: DigitalLabel | null,
    min: number,
    max: number,
    step: number
}
