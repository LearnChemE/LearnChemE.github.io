import { vec2 } from "../types";
import { beginTubeFillAnimation } from "./animation";
import { constrain, rescale, smoothLerp } from "./helpers";

export const State = {
    pumpIsRunning: false,
    flowrate: 10, // g / s
}

const MIN_FLOWRATE = 10;
const MAX_FLOWRATE = 20;

// Insert an svg image 
function insertSVG(svg: string) {
    const div = document.createElement("div");
  
    // Set basic attributes
    div.id = "apparatus-wrapper";
    div.innerHTML = svg;
    return div;
}

// Create div containing svg
const svg = require("../media/Fluidized-bed Graphics.svg");
const apparatusDiv = insertSVG(svg);

// Find parent and append svg div
const parent = document.getElementById("graphics-wrapper");
parent.appendChild(apparatusDiv);

/* ********************** */
/* ** Set interactions ** */
/* ********************** */

const container = document.getElementById("Fluidized-bed Graphics");
const valve1 = document.getElementById("Valve");
const valve2 = document.getElementById("Valve_2");

// Find the angle between (A -> B) and down
function findAngleFromDown(A: vec2, B: vec2) {
    var dx = B.x - A.x;
    var dy = B.y - A.y;
    var mag = Math.sqrt(dx*dx + dy*dy);
    return -Math.sign(dx) * Math.acos(dy / mag) * 180 / Math.PI;
}

/*
 *  Interaction for valve 1
 */
var v1Angle = 0;
valve1.addEventListener("mousedown", ({ clientX, clientY }) => {
    // Find centroid
    var offset = valve1.getBoundingClientRect();
    var center: vec2 = {
        x: (offset.left + offset.right) / 2,
        y: (offset.top + offset.bottom) / 2,
    };

    // Get client mouse position
    var client = vec2(clientX, clientY);

    // Get initial mouse angle
    let th0 = findAngleFromDown(center, vec2(clientX, clientY));

    const drag = ({ clientX, clientY }: MouseEvent) => {
        // Find angle from centroid to mouse
        let th = findAngleFromDown(center,vec2(clientX,clientY));
        // Find difference and reset th
        let dth = th - th0;
        if (th * th0 < 0) { // This is the tricky bit
            th0 = th;
            return;
        }
        th0 = th;

        // Set angle
        v1Angle += dth;
        v1Angle = constrain(v1Angle, 0, 90);
        valve1.setAttribute("transform", `rotate(${v1Angle} 129 83)`);
        State.flowrate = rescale(v1Angle, 0, 90, MIN_FLOWRATE, MAX_FLOWRATE, true);
    };
    const release = () => {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", release);
    };

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", release);
})

/*
 *  Interaction for valve 2
 */
/*
 *  Interaction for valve 1
 */
var v2Angle = 0;
valve2.addEventListener("mousedown", ({ clientX, clientY }) => {
    // Find centroid
    var offset = valve2.getBoundingClientRect();
    var center = vec2(
        (offset.left + offset.right) / 2,
        (offset.top + offset.bottom) / 2
    );
    // Get initial mouse angle
    let dispAngle = v2Angle;

    const drag = ({ clientX, clientY }: MouseEvent) => {
        // Find angle from centroid to mouse
        let th = findAngleFromDown(center,vec2(clientX,clientY));
        // Find difference and reset th
        let target;
        if (th > -180 && th < -45 || th > 135) target = -90;
        else target = 0;

        if (v2Angle !== target) {
            // Lerp between the current value and the target smoothly
            smoothLerp(150, (val) => {
                valve2.setAttribute("transform", `rotate(${val} 143 29)`);
            }, v2Angle, target);
            v2Angle = target;
        }
    };
    const release = () => {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", release);
    };

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", release);
})

/* ************************************** */
/* *************** Buttons ************** */
/* ************************************** */

/**
 * Pump button
 */
const pumpBtn = document.getElementById("pump-btn");
pumpBtn.addEventListener("click", () => {
    // Start pump animation
    beginTubeFillAnimation();
})