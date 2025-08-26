import type { ControlType, DigitalLabelDescriptor, SetpointControlDescriptor } from "../types";
import { DigitalLabel } from "./classes/Label";
import { SetpointControl } from "./classes/Setpoint";
import { initButton } from "./helpers";

const spLabels: Array<DigitalLabelDescriptor> = [
    {
        id: "flowCtrlLabel",
        gid: "flowSp",
        centerId: "flowCtrlScreen",
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
        id: "tempCtrlLabel",
        gid: "tempSp",
        centerId: "tempCtrlScreen",
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
    }
];

export function initInteractions<T extends ControlType>(flowCtrl: T, tempCtrl: T) {
    const flowSpDescriptor: SetpointControlDescriptor<ControlType> = {
        ctrl: flowCtrl,
        upBtnId: "flowUpBtn",
        downBtnId: "flowDownBtn",
        spLabel: new DigitalLabel(spLabels[0]),
        outLabel: new DigitalLabel(spLabels[3]),
        min: 0,
        max: 15,
        step: 0.5
    };
    const tempSpDescriptor: SetpointControlDescriptor<ControlType> = {
        ctrl: tempCtrl,
        upBtnId: "tempUpBtn",
        downBtnId: "tempDownBtn",
        spLabel: new DigitalLabel(spLabels[1]),
        outLabel: new DigitalLabel(spLabels[2]),
        min: 25,
        max: 150,
        step: 5
    };


    new SetpointControl(flowSpDescriptor);
    new SetpointControl(tempSpDescriptor);

    initButton("concentrateTareBtn", () => {});
    initButton("condensateTareBtn", () => {});
}

// function initBallValve(leverId: string, set?: (mode: boolean) => void) {

// }
