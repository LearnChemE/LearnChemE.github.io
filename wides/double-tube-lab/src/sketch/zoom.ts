import { P5CanvasInstance } from "@p5-wrapper/react";

const zoomMin = 1;
const zoomMax = 6;

const state = {
    zoom: 1,
    zoomX: 0,
    zoomY: 0,
    dragging: false
};

function constrain(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

var offsetX = 0;
var offsetY = 0;
export function Zoom(p: P5CanvasInstance, width: number, height: number) {
    if (state.dragging) {
        // For bounds
        const mX = p.mouseX;
        const mY = p.mouseY;
        // Subtract the difference from the offset vector times the zoom for tracking
        state.zoomX -= (mX - offsetX) / state.zoom * 1.5;
        state.zoomY -= (mY - offsetY) / state.zoom * 1.5;
        // Constrain so the apparatus doesn't go offscreen
        state.zoomX = constrain(state.zoomX, 0, width);
        state.zoomY = constrain(state.zoomY, 0, height);
        offsetX = mX; offsetY = mY;
    }

  // Calculate and apply matrix
  const s  = state.zoom;
  const zx = -state.zoomX * (s - 1);
  const zy = -state.zoomY * (s - 1);
  p.applyMatrix(s,0 , 0,s , zx,zy);
}


let e: HTMLElement | null = null;
function getContainerElement() : HTMLElement {
  if (!e) {
    e = document.querySelector(".react-p5-wrapper");
    if (!e) throw new Error("Could not find react-p5-wrapper element");
  }
  return e;
}


export function mouseCoordinate(p: P5CanvasInstance): [number, number] {
  // Declare variables
  var x = p.mouseX;
  var y = p.mouseY;
  if (x === 0 && y === 0) return [0, 0];
  const container = getContainerElement();
  const s  = state.zoom; // Will never be 0
  const tx = state.zoomX;
  const ty = state.zoomY;
  // Calculate inverse transform of zoom matrix
  x = x/s + tx/s * (s - 1);
  y = y/s + ty/s * (s - 1);
  const coords = [x / container.offsetWidth * p.width, y / container.offsetHeight * p.height];

  return coords as [number, number];
}

// Add drag event
export function stopDragging() {
  state.dragging = false;
}

export function startDragging(p: P5CanvasInstance) {
  state.dragging = true;
//   [offsetX, offsetY] = mouseCoordinate(p);
offsetX = p.mouseX;
offsetY = p.mouseY;
  
}

// Add mouseWheel handler
export function makeZoomWheelCallback(p: P5CanvasInstance, width: number, height: number) {
    return (event: WheelEvent) => {
        const [mx, my] = mouseCoordinate(p);
        if (mx === 0 && my === 0) return false;
        // Prevent default scrolling
        event.preventDefault();

        // Calculate zoom factor based on scroll direction and magnitude
        const zoomFactor = event.deltaY > 0 ? Math.pow(0.95, Math.abs(event.deltaY) / 100) : Math.pow(1.05, Math.abs(event.deltaY) / 100);

        // Calculate new zoom level
        var newZoom = state.zoom * zoomFactor;

        // Clamp zoom level between min and max
        newZoom = constrain(newZoom, zoomMin, zoomMax);

        if (newZoom !== zoomMin) {
            const dz = newZoom - state.zoom;
            const zdif = newZoom - zoomMin;
            const oldZoom = state.zoom - zoomMin;
            const zoomX = (oldZoom * state.zoomX + mx * dz) / zdif;
            const zoomY = (oldZoom * state.zoomY + my * dz) / zdif;

            state.zoomX = constrain(zoomX, 0, width);
            state.zoomY = constrain(zoomY, 0, height);
        }
        else {
            state.zoomX = width;
            state.zoomY = height;
        }

        state.zoom = newZoom;
        // console.log(`Zoom: ${state.zoom}, ZoomX: ${state.zoomX}, ZoomY: ${state.zoomY}`);

        return false;
    }
};
