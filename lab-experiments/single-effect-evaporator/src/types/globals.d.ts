export const svgNS = "http://www.w3.org/2000/svg";

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