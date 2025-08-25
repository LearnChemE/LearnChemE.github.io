import type { DigitalLabelDescriptor } from "../types";
import { DigitalLabel } from "./classes/Label";


const labelDescriptors: Array<DigitalLabelDescriptor> = [
    {
        id: "concentrateScaleLabel",
        gid: "concentrateScale",
        centerId: "concentrateScreen",
        fill: "#F9F155",
        units: "kg",
        decimals: 2,
        initialValue: 0,
        range: {
            range: [0, 1000],
            overflowString: "FULL",
            underflowString: "NEG"
        }
    },
    {
        id: "condensateScaleLabel",
        gid: "condensateScale",
        centerId: "condensateScreen",
        fill: "#F9F155",
        units: "kg",
        decimals: 2,
        initialValue: 0,
        range: {
            range: [0, 1000],
            overflowString: "FULL",
            underflowString: "NEG"
        }
    }
];

export function createLabels() {
    const labels: Array<DigitalLabel> = [];

    for (const descriptor of labelDescriptors) {
        labels.push(new DigitalLabel(descriptor));
    }

    return labels;
}