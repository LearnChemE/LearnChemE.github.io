import { FLOWRATE_GAIN, type AnimationFn, type GlobalState } from "../types";
import { updateFlowLabel } from "./labels";

const FAN_OMEGA = 1.5 * 360;

var fanTh = 0;

export const fanAnimation: AnimationFn = (dt) => {
    const fan = document.getElementById("fanRotate")!;
    const fanBbox = (fan as unknown as SVGAElement).getBBox();

    fanTh += dt * FAN_OMEGA / 1000;
    fanTh %= 360;

    fan.setAttribute("transform", `rotate(${fanTh} ${fanBbox.x + fanBbox.width/2} ${fanBbox.y + fanBbox.height/2})`);
}

export const makeFlowAnimation = (state: GlobalState): AnimationFn => {
    const inTube  = document.getElementById("inTubeFill")!;
    const outTube = document.getElementById("outTubeFill")!;

    return (dt: number) => {
        // Update the flowrate display
        const flowrate = state.pumpIsOn ? state.lift * FLOWRATE_GAIN : 0;
        updateFlowLabel(flowrate);
    };
}
