import type { ControlType } from "../types";
import { DigitalLabel } from "./classes/Label";
import { SetpointControl } from "./classes/Setpoint";
import { flowSpDescriptor, spLabels, tempSpDescriptor } from "./config";
import { initButton } from "./helpers";

export function initInteractions<T extends ControlType>(flowCtrl: T, tempCtrl: T) {

    // Update the descriptors
    flowSpDescriptor.ctrl = flowCtrl;
    flowSpDescriptor.spLabel = new DigitalLabel(spLabels[0]);
    flowSpDescriptor.outLabel = new DigitalLabel(spLabels[3]);
    tempSpDescriptor.ctrl = tempCtrl;
    tempSpDescriptor.spLabel = new DigitalLabel(spLabels[1]);
    tempSpDescriptor.outLabel = new DigitalLabel(spLabels[2]);

    new SetpointControl(flowSpDescriptor);
    new SetpointControl(tempSpDescriptor);

    initButton("concentrateTareBtn", () => {});
    initButton("condensateTareBtn", () => {});
}