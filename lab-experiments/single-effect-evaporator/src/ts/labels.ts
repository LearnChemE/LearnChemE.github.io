import type { DigitalLabelDescriptor } from "../types";
import { DigitalLabel } from "./classes/Label";


const labelDescriptors: Array<DigitalLabelDescriptor> = [
    {
        id: "feedTempLabel",
        gid: "feedTempGauge",
        centerId: "feedTempScreen",
        fill: "#F9F155",
        units: "",
        decimals: 1,
        initialValue: 25,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    },
    {
        id: "feedFlowLabel",
        gid: "feedFlowGauge",
        centerId: "feedFlowScreen",
        fill: "#F9F155",
        units: "",
        decimals: 2,
        initialValue: 0,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    },
    {
        id: "evapTempLabel",
        gid: "evapTempGauge",
        centerId: "evapTempScreen",
        fill: "#F9F155",
        units: "",
        decimals: 1,
        initialValue: 25,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    },
    {
        id: "steamFlowLabel",
        gid: "steamFlowGauge",
        centerId: "steamFlowScreen",
        fill: "#F9F155",
        units: "",
        decimals: 2,
        initialValue: 0,
        range: {
            range: [0, 1000],
            overflowString: "OVER",
            underflowString: "UNDER"
        }
    },
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