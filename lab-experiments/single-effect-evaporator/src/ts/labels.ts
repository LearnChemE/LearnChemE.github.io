import type { DigitalLabelDescriptor } from "../types";
import { DigitalLabel } from "./classes/Label";


const labelDescriptors: Array<DigitalLabelDescriptor> = [
    
];

export function createLabels() {
    const labels: Array<DigitalLabel> = [];

    for (const descriptor of labelDescriptors) {
        labels.push(new DigitalLabel(descriptor));
    }

    return labels;
}