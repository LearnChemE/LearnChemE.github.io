import { BeakerHolder, BendDirection, BentTube, Manometer, StraightTube, Tube, TubeDirection, TubeGroup, ValveSetting } from "../types";
import { fillCanvas } from "./canvas";
import { delay } from "./helpers";
import State from "./state";

// Tube Groups
var LowerTubes:   TubeGroup;
var VenturiLeft:  TubeGroup;
var VenturiRight: TubeGroup;
var UpperBase:    TubeGroup;
var Recycle:      TubeGroup;
var ExitTube:     TubeGroup;

// Manometer
var manometer: Manometer;

// Beakers
export var beakers: BeakerHolder | null = null;

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
        [ new StraightTube ( "Rectangle 15"   , TubeDirection.Right        ),  800 ],
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

    // Manometer
    manometer = new Manometer();

    // Beakers
    beakers = new BeakerHolder();
    beakers.setCatchWeighCallback(() => manometer.fillTubes());
}


/**
 * Animate the lower tubes filling
 * @param t Animation Interpolant
 */
var tubesAreFull = false;
async function tubesFillAnimation() {
    if (!tubesAreFull) {
        // Start beaker drain
        beakers.setMode(1);

        // Play each animation
        await LowerTubes.fill();
        // Save a promise for the canvas
        const cnvIsFull = fillCanvas();
        // Fill left manometer tube
        await delay(300);
        await VenturiLeft.fill();
        manometer.fillLeftOnly();
        // Await the canvas before continuing
        await cnvIsFull;
        // Now fill the right venturi
        await VenturiRight.fill();
        manometer.initialFill();
        // Fill the upper base
        await UpperBase.fill();
        if (State.valveSetting === ValveSetting.RecycleMode) {
            await Recycle.fill();
        }
        else {
            await ExitTube.fill();
        }

        // now let the user do stuff
        tubesAreFull = true;

        // Set beaker state
        if (State.valveSetting == ValveSetting.RecycleMode) {
            beakers.setMode(2);
        }
        else {
            beakers.setMode(3);
        }
    }
}


/**
 * External call to begin the animation for the tubes filling.
 */
export async function beginTubeFillAnimation() {
    State.valve2isDisabled = true;
    tubesFillAnimation().then(() => State.valve2isDisabled = false);
}

/**
 * Call animations that happen on lift change
 * @returns void promise
 */
export async function onLiftChange() {
    manometer.fillTubes();
    return;
}

/**
 * Animation for swapping the valve mode between recycle and catch-and-weigh.
 * @param newSetting The setting which the simulation was changed to
 * @returns void Promise
 */
export async function swapValveAnimation(newSetting: ValveSetting) {
    if (!tubesAreFull) return;

    // Swap the animation
    if (newSetting === ValveSetting.RecycleMode) {
        ExitTube.empty();
        Recycle.fill().then(() => {
            beakers.setMode(2); // RECYCLE
            State.valve2isDisabled = false;
        });
    }
    else {
        Recycle.empty();
        ExitTube.fill().then(() => {
            beakers.setMode(3); // CATCH_WEIGH
            State.valve2isDisabled = false;
        });
    }
}
