import type { ControlType } from "../types";
import { BallValve } from "./classes/BallValve";
import { DigitalLabel } from "./classes/Label";
import { SetpointControl } from "./classes/Setpoint";
import { Waterfall } from "./classes/Waterfall";
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

    // waterfalls
    const concFallBucket = new Waterfall("concFall");
    const condFallBucket = new Waterfall("condFall");
    const concFallDrain = new Waterfall("concFallDrain");
    const condFallDrain = new Waterfall("condFallDrain");

    // Set initial falls
    concFallDrain.pour();
    condFallDrain.pour();

    // Ball valves
    new BallValve("bottomsValve", true, (measureState) => {
        if (measureState) {
            concFallBucket.pour();
            concFallDrain.stop();
        }
        else {
            concFallBucket.stop();
            concFallDrain.pour();
        }
    });
    new BallValve("condensateValve", false, (measureState) => {
        if (measureState) {
            condFallBucket.pour();
            condFallDrain.stop();
        }
        else {
            condFallBucket.stop();
            condFallDrain.pour();
        }
    });
}