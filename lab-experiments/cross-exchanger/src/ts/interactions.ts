import { Simulation, THERMOMETER_NONE, THERMOMETER_TANK, THERMOMETER_TUBE, vec2 } from "../types";
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

    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.innerHTML = `turn switch on`;
    e.appendChild(title);
    for (const child of e.children) {
        if (child.id.includes("switchSymbol")) {
            child.classList.add("switch-symbol");
        }
    }

    on.classList.add("svg-btn");
    off.classList.add("svg-btn");
    off.classList.add("hidden");
    
    const turnOn = (isOn: boolean) => {
        // Recolor components
        if (isOn) {
            on.classList.add("hidden");
            off.classList.remove("hidden");
            title.innerHTML = `turn switch off`;
        }
        else {
            on.classList.remove("hidden");
            off.classList.add("hidden");
            title.innerHTML = `turn switch on`;
        }
        // Call callback
        callback?.(isOn);
    }

    // Attach handler
    on.addEventListener("click", () => turnOn(true));
    off.addEventListener("click", () => turnOn(false));
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

function initThermometer(id: string, callback?: (target: number) => void) {
    const therm = document.getElementById(id)! as unknown as SVGGElement;
    const svg = document.querySelector<SVGSVGElement>("svg")!;

    const [,, width, height] = svg
        .getAttribute("viewBox")!
        .split(" ")
        .map(Number);

    var isDragging = false;
    var prevX = 0;
    var prevY = 0;
    var dtx = 0;
    var dty = 0;

    // Control isDragging logic
    therm.addEventListener("mousedown", (e) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Mouse move
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        // Find change in mouse coodinates
        const dmx = e.clientX - prevX;
        const dmy = e.clientY - prevY;

        // Translate to change in thermometer position
        dtx += dmx * width  / svg.clientWidth ;
        dty += dmy * height / svg.clientHeight;

        // Constrain to be in tank
        dtx = constrain(dtx, -169, 26);
        dty = constrain(dty, -100, 0);

        // Determine target based on current position
        var targetAngle = 0;
        if (dtx < -120) {
            targetAngle = 45 * (dtx + 120) / -49;

        }

        therm.setAttribute("transform", `translate(${dtx} ${dty}) rotate(${targetAngle} 705 210)`);

        // Update previous coordinates
        prevX = e.clientX;
        prevY = e.clientY;

        // Determine what the user is measuring
        var measureTarget = THERMOMETER_NONE;
        if (dty > -60) measureTarget = THERMOMETER_TANK;
        else if (dtx < -150) measureTarget = THERMOMETER_TUBE;

        callback?.(measureTarget);
    });
}

function initResetBtn(state: Simulation) {
    const e = document.createElement("button");
    document.getElementById("app")!.append(e);
    e.innerHTML = "reset";
    e.id = "reset-btn";
    e.classList.add("btn");
    e.classList.add("btn-danger");

    const reset = () => {
        document.getElementById("pumpSwitchOn")!.classList.remove("hidden");
        document.getElementById("pumpSwitchOff")!.classList.add("hidden");
        document.getElementById("fanSwitchOn")!.classList.remove("hidden");
        document.getElementById("fanSwitchOff")!.classList.add("hidden");
        state.reset();
    }

    e.addEventListener("click", () => reset());
}

/**
 * Initialize all the interactables within the svg. Main export of interactions.ts
 * @param state Simulation state object
 */
export function initInteractables(state: Simulation) {
    initSwitch("pumpSwitch", "pumpSwitchOn", "pumpSwitchOff", (isOn: boolean) => state.setPumpStatus(isOn));
    initSwitch("fanSwitch", "fanSwitchOn", "fanSwitchOff", (isOn: boolean) => state.setFanStatus(isOn));
    initDial("flowDial", (lift: number) => state.setLift(lift));
    initThermometer("thermStick", (target) => state.setTTarg(target));
    initResetBtn(state);
}

// --- Resize Handling ---
export function enableWindowResize() {
    const e = document.getElementById("apparatus-wrapper")!.childNodes[0] as unknown as SVGAElement;
    const asp = e.clientWidth / e.clientHeight;
    // Attach event handler
    const resize = () => {
        let windowWidth = Math.max(Math.min(window.innerWidth * .8, 1800), 400);
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