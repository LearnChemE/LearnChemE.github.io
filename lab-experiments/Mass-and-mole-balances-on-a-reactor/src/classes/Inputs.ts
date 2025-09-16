import { constrain, findAngleFromDown, initButton, vec2 } from "../ts/helpers";
import { Signal } from "./Signal";

/**
 * Initialize a switch component and add a callback to set a state variable for it.
 * @param id ID of the parent switch component
 * @param onId ID of the "on" side of the switch
 * @param offId ID of the "off" side of the switch
 * @param callback Callback to set state variable
 */
export function initSwitch(id: string, onId: string, offId: string): Signal<boolean> {
    const e  = document.getElementById(id)!;
    const on = document.getElementById(onId)!;
    const off= document.getElementById(offId)!;

    // Get the original on/off colors
    const upCol = on.getAttribute("fill")!;
    const downCol = off.getAttribute("fill")!;

    e.classList.add("svg-btn");
    
    const signal = new Signal<boolean>(false);
    // Attach handler
    e.addEventListener("click", () => {
        // Update internal state
        const isOn = !signal.get();
        // Recolor components
        if (isOn) {
            on.setAttribute("fill", downCol);
            off.setAttribute("fill", upCol);
        }
        else {
            on.setAttribute("fill", upCol);
            off.setAttribute("fill", downCol);
        }
        // Set signal
        signal.set(isOn);
    });

    return signal
}

/**
 * Initialize the dial to turn with user input and return its corresponding lift to a callback.
 * @param id ID of the parent dial element
 * @param callback Callback to set state lift variable
 */
export function initDial(id: string, init: number = 0): Signal<number> {
    // Get the element
    const e = document.getElementById(id)! as unknown as SVGAElement;
    e.classList.add("svg-dial");
    // Find the proper offset
    const bbox = e.getBBox();
    const center = vec2(
        bbox.x + bbox.width / 2,
        bbox.y + bbox.height / 2
    );

    var angle = init;

    const lift = new Signal<number>(init/270);
    e.setAttribute("transform", `rotate(${init} ${center.x} ${center.y})`);

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
            e.setAttribute("transform", `rotate(${angle} ${center.x} ${center.y})`);

            // Set callback
            lift.set(angle / 270);
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

    return lift;
}

/**
 * Create a setpoint using up and down buttons
 * @param upId ID of up button
 * @param downId ID of down button
 * @param min minimum value
 * @param max maximum value
 * @param step amount to change per click
 * @param init initial value
 * @returns setpoint signal object
 */
export function initUpDownButtons(upId: string, downId: string, min: number, max: number, step: number, init: number) {
    const signal = new Signal<number>(init);

    // Increase and decrease callbacks
    const increase = () => {
        let val = signal.get() + step;
        if (val > max) val = max;
        signal.set(val);
    }
    const decrease = () => {
        let val = signal.get() - step;
        if (val < min) val = min;
        signal.set(val);
    }

    // Set the callbacks
    initButton(upId  , increase);
    initButton(downId, decrease);

    return signal;
}