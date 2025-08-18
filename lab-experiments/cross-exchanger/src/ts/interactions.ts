import { vec2 } from "../types";
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
    const e = document.getElementById(id)!;
    // Find the proper offset
    const bbox = e.getBoundingClientRect();
    const center = vec2(
        (bbox.left + bbox.right) / 2,
        (bbox.top + bbox.bottom) / 2
    );

    const moz: vec2 = { x: 0, y: 0 };
    var angle = 0;

    e.addEventListener("mousedown", ({ clientX, clientY }) => {
        // Get initial angle
        let th0 = findAngleFromDown(center, vec2(clientX, clientY));

        // Drag function
        const drag = ({ clientX, clientY }: MouseEvent) => {
            // Find angle from centroid to mouse
            let th = findAngleFromDown(center,vec2(clientX,clientY));
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
            e.setAttribute("transform", `rotate(${angle} 699 ${center.y})`);

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

export function initInteractables() {
    initSwitch("Switch", "switchOn", "switchOff", (isOn: boolean) => {});
    initSwitch("fanSwitch", "fanSwitchOn", "fanSwitchOff", (isOn: boolean) => {});
    initDial("flowDial", (lift: number) => {});
}