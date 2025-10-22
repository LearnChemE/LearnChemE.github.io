import type { ControlType } from "../types";
import { DigitalLabel } from "./classes/Label";
import { SetpointControl } from "./classes/Setpoint";
import { flowSpDescriptor, presSpDescriptor, spLabels, steamPresLabelDescriptor, tempSpDescriptor } from "./config";

export function initInteractions<T extends ControlType>(flowCtrl: T, tempCtrl: T, presCtrl: T) {

    // Update the descriptors
    flowSpDescriptor.ctrl = flowCtrl;
    flowSpDescriptor.spLabel = new DigitalLabel(spLabels[0]);
    flowSpDescriptor.outLabel = new DigitalLabel(spLabels[3]);
    tempSpDescriptor.ctrl = tempCtrl;
    tempSpDescriptor.spLabel = new DigitalLabel(spLabels[1]);
    tempSpDescriptor.outLabel = new DigitalLabel(spLabels[2]);
    presSpDescriptor.ctrl = presCtrl;
    presSpDescriptor.spLabel = new DigitalLabel(steamPresLabelDescriptor);

    new SetpointControl(flowSpDescriptor);
    new SetpointControl(tempSpDescriptor);
    new SetpointControl(presSpDescriptor);
}