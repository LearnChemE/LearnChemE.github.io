import { FLOWRATE_GAIN, THERMOMETER_NONE, THERMOMETER_TANK, THERMOMETER_TUBE, type AnimationFn, type GlobalState } from "../types";
import { constrain, insertClipPath } from "./helpers";
import { updateFlowLabel, updateThermLabel } from "./labels";

const FAN_OMEGA = 1.5 * 360;
const TUBE_FILL_DURATION = 5000; // ms
const EXCHANGER_LENGTH = 200;

var fanTh = 0;

export const fanAnimation: AnimationFn = (dt) => {
    const fan = document.getElementById("fanRotate")!;
    const fanBbox = (fan as unknown as SVGAElement).getBBox();

    fanTh += dt * FAN_OMEGA / 1000;
    fanTh %= 360;

    fan.setAttribute("transform", `rotate(${fanTh} ${fanBbox.x + fanBbox.width/2} ${fanBbox.y + fanBbox.height/2})`);
}

export const makeFlowAnimation = (state: GlobalState): AnimationFn => {
    const inTube  = document.getElementById("inTubeFill")!  as unknown as SVGPathElement;
    const outTube = document.getElementById("outTubeFill")! as unknown as SVGPathElement;
    const outStrm = document.getElementById("ouletStream")! as unknown as SVGPathElement;

    // Get lengths
    const  inTubeLength =  inTube.getTotalLength();
    const outTubeLength = outTube.getTotalLength();

    // Get bounding box
    const bbox = outStrm.getBBox();
    const outStrmLength = bbox.height;

    // Add attributes, hide by default
    inTube.setAttribute("stroke-dasharray",  `${inTubeLength}`);
    inTube.setAttribute("stroke-dashoffset", `${inTubeLength}`);
    outTube.setAttribute("stroke-dasharray",  `${outTubeLength}`);
    outTube.setAttribute("stroke-dashoffset", `${outTubeLength}`);

    // Add into a single value for lerp
    const totalLength = inTubeLength + EXCHANGER_LENGTH + outTubeLength + outStrmLength;
    const fillWithoutHead = 1 - outStrmLength / totalLength;
    var fill = 0;
    var streamActivated = false;
    var minFill = 0;

    // Insert the clip path div
    const clipPath = insertClipPath(outStrm, "strm", bbox);
    const r = Math.exp(-1/1500);
    
    return (dt: number) => {
        // If pump is off, flow is 0
        if (!state.pumpIsOn) {
            updateFlowLabel(0);
            fill = (fill - minFill) * r ** dt + minFill;
            fill = constrain(fill, minFill, 1);
        }
        else {
            // Update the flowrate display
            const flowrate = state.pumpIsOn ? state.lift * FLOWRATE_GAIN : 0;
            updateFlowLabel(flowrate);
            if (fill < fillWithoutHead && state.lift > 0) {
                fill += state.lift * dt / TUBE_FILL_DURATION;
            }
            else if (state.lift === 0) {
                if (fill > fillWithoutHead) {
                    fill -= 0.8 * dt / TUBE_FILL_DURATION;
                    fill = constrain(fill, 1 - outStrmLength / totalLength, 1);
                }
            }
            else {
                fill += dt / TUBE_FILL_DURATION;
            }
        }

        if (fill > minFill) {
            minFill = Math.min(fill, 0.505);
        }

        // Lerp the tube fill
        fill = constrain(fill, 0, 1);

        state.systemBalance.setTubeFill(fill);

        // Fill tubes accordingly
        var cumulativeFill = fill * totalLength;
        inTube.setAttribute("stroke-dashoffset", `${Math.max(inTubeLength - cumulativeFill, 0)}`);
        cumulativeFill = Math.max(cumulativeFill - inTubeLength - EXCHANGER_LENGTH, 0);
        outTube.setAttribute("stroke-dashoffset", `${Math.max(outTubeLength - cumulativeFill, 0)}`);
        cumulativeFill = Math.max(cumulativeFill - outTubeLength, 0);
        if (state.pumpIsOn && state.lift > 0) {
            streamActivated = true;
            state.outIsFlowing = true;
            clipPath.innerHTML = `<rect x="${bbox.x}" y="${bbox.y}" width="${bbox.width}" height="${cumulativeFill}">`;
        }
        else if (streamActivated) {
            state.outIsFlowing = false;
            clipPath.innerHTML = `<rect x="${bbox.x}" y="${bbox.y + bbox.height - cumulativeFill}" width="${bbox.width}" height="${bbox.height}">`;
        }

        // Integrate
        state.systemBalance.integrate(state.lift * FLOWRATE_GAIN, dt, state.fanIsOn);
    };
}

export const makeThermometerAnimation = (state: GlobalState): AnimationFn => {
    const clip = document.getElementById("strm-clip")! as unknown as SVGRectElement;
    const r_wet = Math.exp(-1/300);
    const r_dry = Math.exp(-1/1000);

    var counter = 0;
    var thermTemp = 60;

    return (dt: number) => {
        // Only update every so often
        counter += dt;
        if (counter < 500) return;

        // Get the thermometer target
        var measuring = state.thermTarget;
        // If the stream is not active, default to none
        const outlet = clip.childNodes[0]! as unknown as SVGRectElement;
        if (measuring === THERMOMETER_TUBE) {
            if (Number(outlet.getAttribute("height")) < 10 || Number(outlet.getAttribute("y")) > 140) {
                measuring = THERMOMETER_NONE;
            }
        }

        var temp, r;
        switch (measuring) {
            case THERMOMETER_NONE:
                // Measuring air
                temp = 25; // Room Temperature
                r = r_dry;
                break;

            case THERMOMETER_TANK:
                // Measuring tank
                temp = state.systemBalance.getTankTemp();
                r = r_wet;
                break;

            case THERMOMETER_TUBE:
                // Measuring outlet flow
                temp = state.systemBalance.getTubeTemp();
                r = r_wet;
                break;

            default:
                console.warn(`Bad thermometer measure value: ${state.thermTarget}`);
                return;
        }

        // Lerp towards the new value
        thermTemp = (thermTemp - temp) * r ** counter + temp;

        // Update the thermometer
        updateThermLabel(thermTemp);
        counter -= 500;
    };
}