import { GlobalState, ValveSetting } from "../types";
import { beginTubeFillAnimation, initAnimationObjects, onLiftChange, swapValveAnimation } from "./animation";

/* ************************* */
/* ** Create State Object ** */
/* ************************* */

// Create the variable
const state: GlobalState = {
    apparatusDiv: undefined,
    valveSetting: ValveSetting.RecycleMode,
    pumpIsRunning: false,
    valveLift: 1,
}

// Insert an svg image 
function insertSVG(svg: string): HTMLDivElement {
    const div = document.createElement("div");
  
    // Set basic attributes
    div.id = "apparatus-wrapper";
    div.innerHTML = svg;
    return div;
}

// Create div containing svg
const svg = require("../media/Fluidized-bed Graphics.svg");
state.apparatusDiv = insertSVG(svg) as unknown as SVGAElement;

// Find parent and append svg div
const parent = document.getElementById("graphics-wrapper");
parent.appendChild(state.apparatusDiv);


/* ************************************** */
/* ** Create classes utilized by proxy ** */
/* ************************************** */

// Initialize rendering classes
initAnimationObjects();

/* ***************************** */
/* ** Create and expose proxy ** */
/* ***************************** */

// Only expose a proxy for protection
const stateProxy = new Proxy(state, {
    set(target: GlobalState, prop: keyof GlobalState, value: GlobalState[keyof GlobalState]) {
        // console.log(`Setting ${prop} to value ${value}`); // Useful for debug

        // For some reason using the actual types always returns 'never' for GlobalState[keyof GlobalState]?
        // So I just cast to any because it should work this way by definition
        (target as any)[prop] = value;

        if (prop === 'apparatusDiv') {
            // This shouldn't ever happen
            console.warn(`Apparatus Div Changed Externally: ${value}`);
        }
        else if (prop === 'valveSetting') {
            // Valve 2 pressed
            swapValveAnimation(value as ValveSetting);
        }
        else if (prop === 'pumpIsRunning') {
            // Pump button toggled
            beginTubeFillAnimation();
        }
        else if (prop === 'valveLift') {
            // Valve 1 turned
            onLiftChange();
        }
        else {
            // Error type
            throw new Error(`Unknown property for GlobalState: ${prop}`);
            return false;
        }

        return true;
    }
});

// make default export
export default stateProxy;