import { GlobalState, vec2 } from "../types";
import { constrain, findAngleFromDown } from "./helpers";

/**
 * Initialize a switch component and add a callback to set a state variable for it.
 * @param id ID of the parent switch component
 * @param onId ID of the "on" side of the switch
 * @param offId ID of the "off" side of the switch
 * @param callback Callback to set state variable
 */
function initSwitch(id: string, onId: string, offId: string, callback?: (isOn: boolean) => void) {
    const e  = document.getElementById(id)!;
    const on = document.getElementById(onId)!;
    const off= document.getElementById(offId)!;

    // Get the original on/off colors
    const upCol = on.getAttribute("fill")!;
    const downCol = off.getAttribute("fill")!;
    
    var isOn = false;
    // Attach handler
    e.addEventListener("click", () => {
        // Update internal state
        isOn = !isOn;
        // Recolor
        if (isOn) {
            on.setAttribute("fill", downCol);
            off.setAttribute("fill", upCol);
        }
        else {
            on.setAttribute("fill", upCol);
            off.setAttribute("fill", downCol);
        }
        // Call callback
        callback?.(isOn);
    });
}

/**
 * Initialize the dial to turn with user input and return its corresponding lift to a callback.
 * @param id ID of the parent dial element
 * @param callback Callback to set state lift variable
 */
function initDial(id: string, callback?: (lift: number) => void) {
    // Get the element
    const e = document.getElementById(id)! as unknown as SVGAElement;
    // Find the proper offset
    const bbox = e.getBBox();
    const center = vec2(
        bbox.x + bbox.width / 2,
        bbox.y + bbox.height / 2
    );

    var angle = 0;

    e.addEventListener("mousedown", ({ clientX, clientY }) => {
        // Center for mouse-related things are relative to the window, and can change with resizing
        const bbox = e.getBoundingClientRect();
        const mozCenter = vec2(
            bbox.x + bbox.width / 2,
            bbox.y + bbox.height / 2
        );

        // Get initial angle
        let th0 = findAngleFromDown(mozCenter, vec2(clientX, clientY));

        // Drag function
        const drag = ({ clientX, clientY }: MouseEvent) => {
            // Find angle from centroid to mouse
            let th = findAngleFromDown(mozCenter,vec2(clientX,clientY));
            // Find difference and reset th
            let dth = th - th0;
            if (th * th0 < 0) { // Signs aren't the same
                // Set new th0 and return
                th0 = th;
                return;
            }
            th0 = th;

            // Set angle
            angle += dth;
            angle = constrain(angle, 0, 270);
            console.log(center)
            e.setAttribute("transform", `rotate(${angle} ${center.x} ${center.y})`);

            // Set callback
            callback?.(angle / 270);
        };

        // Release function
        const release = () => {
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("mouseup", release);
        };

        // Add the event listeners for drag + release
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", release);
    });

}

export function initInteractables(state: GlobalState) {
    initSwitch("Switch", "switchOn", "switchOff", (isOn: boolean) => state.setPumpStatus(isOn));
    initSwitch("fanSwitch", "fanSwitchOn", "fanSwitchOff", (isOn: boolean) => state.setFanStatus(isOn));
    initDial("flowDial", (lift: number) => state.setLift(lift));
}

// --- Resize Handling ---
export function enableWindowResize() {
    const e = document.getElementById("apparatus-wrapper")!.childNodes[0] as unknown as SVGAElement;
    const asp = e.clientWidth / e.clientHeight;
    // Attach event handler
    const resize = () => {
        let windowWidth = Math.max(Math.min(window.innerWidth * .8, 1000), 400);
        let windowHeight = window.innerHeight * .8;
        // Enforce asp
        windowWidth = Math.min(windowWidth, windowHeight * asp);
        windowHeight = windowWidth / asp;
        // Resize canvas
        e.setAttribute("width", `${windowWidth}`);
        e.setAttribute("height", `${windowHeight}`);
    };
    window.addEventListener('resize', resize);
    resize();
}