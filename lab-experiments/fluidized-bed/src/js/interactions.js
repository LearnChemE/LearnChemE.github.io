export const State = {
    pumpIsRunning: false,
    flowrate: 10, // g / s
}

const MIN_FLOWRATE = 10;
const MAX_FLOWRATE = 20;

// Insert an svg image 
function insertSVG(svg) {
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
function findAngleFromDown(A, B) {
    var dx = B[0] - A[0];
    var dy = B[1] - A[1];
    var mag = Math.sqrt(dx*dx + dy*dy);
    return -Math.sign(dx) * Math.acos(dy / mag) * 180 / Math.PI;
}

// Constain x to the bounds [min, max]
function constrain(x, min, max) {
    if (min > max) {
        throw new Error("Bad range for constrain: min must be less than max");
    }

    if (x < min) x = min;
    if (x > max) x = max;

    return x;
}

// Lerp function
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Rescale x from scale of a to b to scale of c to d 
// 6th argument optionally sets whether to constrain to bounds
function rescale(x, a, b, c, d, constrain=false) {
    if (a > b || c > d) throw new Error("Rescale bounds inverted");

    x = (x - a) / (b - a);
    x = x * (d - c) + c;

    if (constrain) {
        if (x > d) x = d;
        if (x < c) x = c;
    }

    return x;
}

// Smoothly interpolate from start to end over a given duration (in milliseconds)
function smoothLerp(start, end, duration, updateCallback) {
    let startTime = null;

    // Function to update the value at each frame
    const animate = (time) => {
      if (!startTime) startTime = time; // Initialize the start time

      // Calculate elapsed time
      const elapsed = time - startTime;

      // Calculate the interpolation factor t (from 0 to 1)
      const t = Math.min(elapsed / duration, 1); // Ensure t doesn't go beyond 1

      // Interpolate between start and end
      const interpolatedValue = lerp(start, end, t);

      // Call the update callback with the interpolated value
      updateCallback(interpolatedValue);

      // If not at the end, continue the animation
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    }

    // Start the animation
    requestAnimationFrame(animate);
}

/*
 *  Interaction for valve 1
 */
var v1Angle = 0;
valve1.addEventListener("mousedown", ({ clientX, clientY }) => {
    // Find centroid
    var offset = valve1.getBoundingClientRect();
    var cx = (offset.left + offset.right) / 2;
    var cy = (offset.top + offset.bottom) / 2;
    // Get initial mouse angle
    let th0 = findAngleFromDown([cx, cy],[clientX,clientY]);

    const drag = ({ clientX, clientY }) => {
        // Find angle from centroid to mouse
        let th = findAngleFromDown([cx, cy],[clientX,clientY]);
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
    var cx = (offset.left + offset.right) / 2;
    var cy = (offset.top + offset.bottom) / 2;
    // Get initial mouse angle
    let dispAngle = v2Angle;

    const drag = ({ clientX, clientY }) => {
        // Find angle from centroid to mouse
        let th = findAngleFromDown([cx, cy],[clientX,clientY]);
        // Find difference and reset th
        let target;
        if (th > -180 && th < -45 || th > 135) target = -90;
        else target = 0;

        if (v2Angle !== target) {
            smoothLerp(v2Angle, target, 150, (val) => {
                valve2.setAttribute("transform", `rotate(${val} 143 29)`);
            });
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

