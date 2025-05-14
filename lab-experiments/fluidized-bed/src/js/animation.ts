import { BentTube, StraightTube, Tube, TubeDirection, TubeGroup, ValveSetting, vec2 } from "../types";
import { BendDirection } from "../types/bend-direction";
import { smoothLerp } from "./helpers";
import { State } from "./interactions";

// Tube Groups
var LowerTubes:   TubeGroup;
var VenturiLeft:  TubeGroup;
var VenturiRight: TubeGroup;
var UpperBase:    TubeGroup;
var Recycle:      TubeGroup;
var ExitTube:     TubeGroup;

/**
 * Initialize all of the animation objects. This must happen after the SVG is loaded
 * in the DOM.
 */
export function initAnimationObjects() {
    const LowerTubeData: Array<[ Tube, number ]> = [
        [ new StraightTube ( "Rectangle 13_2" , TubeDirection.Left         ),  200 ],
        [ new BentTube     ( "Tube Bend_7"    , BendDirection.LowerRight   ),  100 ],
        [ new StraightTube ( "Rectangle 14_2" , TubeDirection.Right        ),  800 ],
        [ new BentTube     ( "Tube Bend_9"    , BendDirection.UpperLeftCW  ),  100 ],
        [ new StraightTube ( "Rectangle 13"   , TubeDirection.Left         ),  200 ],
        [ new BentTube     ( "Tube Bend_6"    , BendDirection.UpperRightCW ),  100 ],
    ];
    const VenturiLeftData: Array<[ Tube, number ]> = [
        [ new StraightTube ( "Tube_8"         , TubeDirection.Right        ),  200 ],
        [ new BentTube     ( "Tube Bend_27"   , BendDirection.UpperRightCW ),  100 ],
        [ new StraightTube ( "Tube_4"         , TubeDirection.Left         ),  500 ],
    ];
    const VenturiRightData: Array<[ Tube, number ]> = [
        [ new BentTube     ( "Tube Bend_22"   , BendDirection.LowerRight   ),  100 ],
        [ new StraightTube ( "Tube_2"         , TubeDirection.Right        ),  500 ],
        [ new BentTube     ( "Tube Bend_24"   , BendDirection.UpperLeftCW  ),  100 ],
        [ new StraightTube ( "Tube_10"        , TubeDirection.Right        ),  200 ],
        [ new BentTube     ( "Tube Bend_26"   , BendDirection.UpperRightCW ),  100 ],
    ];
    const UpperBaseData: Array<[ Tube, number ]> = [
        [ new BentTube     ( "Tube Bend"      , BendDirection.LowerRightCW ),  100 ],
        [ new StraightTube ( "Rectangle 14"   , TubeDirection.Right        ),  800 ],
    ];
    const RecycleData: Array<[ Tube, number ]> = [
        [ new StraightTube ( "Rectangle 15"   , TubeDirection.Right        ),  500 ],
    ];
    const ExitTubeData: Array<[ Tube, number ]> = [
        [ new StraightTube ( "Rectangle 16"   , TubeDirection.Right        ),  200 ],
        [ new BentTube     ( "Tube Bend_3"    , BendDirection.LowerLeftCW  ),  100 ],
        [ new StraightTube ( "Rectangle 17"   , TubeDirection.Right        ),  500 ],
    ];

    // Lower Tubes
    LowerTubes   = new TubeGroup(LowerTubeData);
    VenturiLeft  = new TubeGroup(VenturiLeftData);
    VenturiRight = new TubeGroup(VenturiRightData);
    UpperBase    = new TubeGroup(UpperBaseData);
    Recycle      = new TubeGroup(RecycleData);
    ExitTube     = new TubeGroup(ExitTubeData);
}


/**
 * Animate the lower tubes filling
 * @param t Animation Interpolant
 */
var tubesAreFull = false;
async function tubesFillAnimation() {
    await LowerTubes.fill();
    await VenturiLeft.fill();
    await VenturiRight.fill();
    await UpperBase.fill();
    if (State.valveSetting === ValveSetting.RecycleMode) {
        await Recycle.fill();
    }
    else {
        await ExitTube.fill();
    }
    tubesAreFull = true;
}

/**
 * External call to begin the animation for the tubes filling.
 */
export async function beginTubeFillAnimation() {
    tubesFillAnimation();
}

/**
 * Animation for swapping the valve mode between recycle and catch-and-weigh.
 * @param newSetting The setting which the simulation was changed to
 * @returns void Promise
 */
export async function swapValveAnimation(newSetting: ValveSetting) {
    if (!tubesAreFull) return;

    if (newSetting === ValveSetting.RecycleMode) {
        ExitTube.empty();
        Recycle.fill();
    }
    else {
        Recycle.empty();
        ExitTube.fill();
    }
}