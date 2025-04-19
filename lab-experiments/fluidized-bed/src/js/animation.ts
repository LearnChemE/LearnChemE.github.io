import { BentTube, StraightTube, TubeDirection, vec2 } from "../types";
import { smoothLerp } from "./helpers";

/**
 * Animate the lower tubes filling
 * @param t Animation Interpolant
 */
async function tubesLowerAnimation() {
    // Each lower tube
    const LowerTube1 = new StraightTube("Rectangle 13_2", TubeDirection.Left);
    const LowerTube2 = new BentTube("Tube Bend_7");

    // Run each animation
    await LowerTube1.fill(5000);
}

export function beginTubeFillAnimation() {
    tubesLowerAnimation();
}