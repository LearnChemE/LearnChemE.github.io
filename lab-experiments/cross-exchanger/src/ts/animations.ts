import type { AnimationFn, GlobalState } from "../types";

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
    return (dt: number) => {
        
    };
}
