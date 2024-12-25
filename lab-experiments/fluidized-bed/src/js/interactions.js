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

/*
 *  Interaction for valve 1
 */
v1Angle = 0;
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
        if (v1Angle === 90) initAngle = 90;
        valve1.setAttribute("transform", `rotate(${v1Angle} 129 83)`);
    };
    const release = () => {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", release);
    };

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", release);
})

