import { ValveSetting, vec2 } from "../types";
import { updateCanvasPosition } from "./canvas";
import { constrain, rescale, smoothLerp } from "./helpers";
import State from "./state";

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
        v1Angle = constrain(v1Angle, -90, 0);
        valve1.setAttribute("transform", `rotate(${v1Angle} 129 83)`);

        // Set state after a time delay
        setTimeout(() => {
            State.valveLift = rescale(v1Angle, -90, 0, 0.05, 1, true);
        }, 350);
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
var lastAngle = 0;
var currAngle = 0;
valve2.addEventListener("mousedown", ({ clientX, clientY }) => {
    if (State.valve2isDisabled) return;
    if (State.pumpIsRunning) State.valve2isDisabled = true;
    currAngle = currAngle === 0 ? -90 : 0;

    smoothLerp(150, (val) => {
        valve2.setAttribute("transform", `rotate(${val} 143 29)`);
    }, lastAngle, currAngle);
    lastAngle = currAngle;

    // Update the state
    if (State.valveSetting === ValveSetting.RecycleMode) {
        State.valveSetting = ValveSetting.CatchAndWeigh;
    }
    else {
        State.valveSetting = ValveSetting.RecycleMode;
    }


})

/* ************************************** */
/* *************** Buttons ************** */
/* ************************************** */

/**
 * Pump button
 */
function disableBtnTimeout(b: HTMLElement) {
    const classname = b.className;
    b.className += ' disabled aria-disabled';

}

const pumpBtn = document.getElementById("pump-btn");
pumpBtn.addEventListener("click", () => {
    // Start pump animation
    State.pumpIsRunning = true;
    disableBtnTimeout(pumpBtn);
})

/* ******************************************** */
/* *************** Drag and Zoom ************** */
/* ******************************************** */

type Viewbox = {
    maxViewBox: number[];
    curViewBox: number[];
}
var viewState: Viewbox;

function containsParentWithID(elem: HTMLElement, ids: string | Array<string>) {
    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    // Compare the ids to the elements
    const compare = (elem: HTMLElement, ids: Array<string>) => {
        let eid = elem.id;
        let compare = false;
        for (let id of ids) compare = compare || (id === eid);
        return compare;
    }

    // Check the parents of the target
    for (let i=0;i<3;i++) {
        // Compare
        if (compare(elem, ids)) return true;
        // Check parent next
        if (elem.parentElement) {
            elem = elem.parentElement;
        }
        else return false
    }
    
    return false;
}

export function enableSvgZoom() {
    const wrapper = document.getElementById("apparatus-wrapper");
    const svg = wrapper.childNodes[0] as unknown as SVGAElement;
    const viewBox = svg.getAttribute("viewBox").split(" ").map(Number);
    viewState = {
        maxViewBox: viewBox,
        curViewBox: viewBox
    };

  wrapper.addEventListener("wheel", (e) => {
    e.preventDefault();
    // set the scaling factor (and make sure it's at least 10%)
    let scale = e.deltaY / 1000;
    scale =
      Math.abs(scale) < 0.1 ? (0.1 * e.deltaY) / Math.abs(e.deltaY) : scale;

    // get point in SVG space
    let pt = new DOMPoint(e.clientX, e.clientY);
    pt = pt.matrixTransform(svg.getScreenCTM().inverse());

    // get viewbox transform
    let [x, y, width, height] = svg
      .getAttribute("viewBox")
      .split(" ")
      .map(Number);
    const amountZoomed =
      width / (viewState.maxViewBox[2] - viewState.maxViewBox[0]);
    scale *= Math.max(0.1, amountZoomed);

    // get pt.x as a proportion of width and pt.y as proportion of height
    let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

    // calc new width and height, new x2, y2 (using proportions and new width and height)
    let [width2, height2] = [
      Math.min(viewState.maxViewBox[2], width + width * scale),
      Math.min(viewState.maxViewBox[3], height + height * scale),
    ];
    let x2 = Math.max(0, pt.x - xPropW * width2);
    let y2 = Math.max(0, pt.y - yPropH * height2);

    [width2, height2] = [
      Math.max(10, Math.min(viewState.maxViewBox[2] - x2, width2)),
      Math.max(10, Math.min(viewState.maxViewBox[3] - y2, height2)),
    ];

    if (
      Number.isNaN(x2) ||
      Number.isNaN(y2) ||
      Number.isNaN(width2) ||
      Number.isNaN(height2)
    ) {
      return;
    }

    svg.setAttribute("viewBox", `${x2} ${y2} ${width2} ${height2}`);
    updateCanvasPosition();
  });
}

var mousedown = false;
export function enableSvgDrag() {
    // Get the svg context
    const wrapper = document.getElementById("apparatus-wrapper");
    const svg = wrapper.childNodes[0] as unknown as SVGAElement;
    // Set defaults
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    svg.addEventListener("mousedown", (e) => {
        console.log(e.target)
        if (containsParentWithID(e.target as HTMLElement, ['Valve','Valve_2'])) return;
        mousedown = true;
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    // Hold mouse to move the camera around
    svg.addEventListener("mousemove", (e) => {
        if (isDragging) {
        const [x, y, width, height] = svg
            .getAttribute("viewBox")
            .split(" ")
            .map(Number);
        const dx = ((prevX - e.clientX) * width) / svg.clientWidth;
        const dy = ((prevY - e.clientY) * height) / svg.clientHeight;
        let viewX = Math.max(0, x + dx);
        let viewY = Math.max(0, y + dy);
        let viewWidth = Math.min(viewState.maxViewBox[2], width);
        let viewHeight = Math.min(viewState.maxViewBox[3], height);
        if (viewX + viewWidth >= viewState.maxViewBox[2]) {
            viewX = viewState.maxViewBox[2] - viewWidth;
        }
        if (viewY + viewHeight >= viewState.maxViewBox[3]) {
            viewY = viewState.maxViewBox[3] - viewHeight;
        }
        svg.setAttribute(
            "viewBox",
            `${viewX} ${viewY} ${viewWidth} ${viewHeight}`
        );
        prevX = e.clientX;
        prevY = e.clientY;
        updateCanvasPosition();
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        mousedown = false;
    });
}

enableSvgZoom();
enableSvgDrag();
updateCanvasPosition();