import Graphics from "./Graphics";
import { P5CanvasInstance } from "@p5-wrapper/react";
// import { Tooltip } from "bootstrap";
import { randStartVals } from "./Functions.tsx";
import drawAll from "./Draw.tsx";

// Globals defined here
export const g = {
  cnv: undefined,
  width: 800,
  height: 640,

  orngTime: -1, // -1 means it's not running, will be replaced by millis() once pumps are started
  blueTime: -1,

  orangeFluidColor: [255, 50, 0, 200],
  blueFluidColor: [0, 80, 255, 180],

  cpC: 4.186, // J / g / K
  cpH: 4.186, // J / g / K
  mDotC: 2, // g / s
  mDotH: 1, // g / s

  vols: [1000, 0, 1000, 0], // Beakers always follow order [Th_in, Th_out, Tc_in, Tc_out]
  hIsFlowing: false, // These are separate because the simulation used to have you start them separately
  cIsFlowing: false, // I'll leave it in like this in case that ever changes again

  Th_in: 40.0, // These values are overridden by the randStartVals function
  Tc_in: 10.0,
  Th_out: 40,
  Tc_out: 10,
  Th_out_observed: 25, // These values are the starting observed beaker values...
  Tc_out_observed: 25, // The beakers are integrated over the pump run time and display the average temperature over time

  T_measured: [-1, -1, -1, -1],

  dragging1: false, // These are for the valves, they become true on click in the buttons.js
  dragging2: false,
};

export function togglePumps(pumpsAreRunning: boolean) {
  if (pumpsAreRunning) {
    g.hIsFlowing = true;
    g.cIsFlowing = true;
    if (g.orngTime === -1) {
      g.orngTime = p5_instance.millis();
      g.blueTime = p5_instance.millis();
    }
  } else {
    g.hIsFlowing = false;
    g.cIsFlowing = false;
  }
}

export var p5_instance: P5CanvasInstance;

export default function sketch(p: P5CanvasInstance) {
  p5_instance = p;
  // let canvas: P5CanvasInstance;

  let dt: P5CanvasInstance;
  let dtb: P5CanvasInstance;
  let dto: P5CanvasInstance;
  let bt: P5CanvasInstance;
  let v: P5CanvasInstance;
  let pa: P5CanvasInstance;

  let thi: P5CanvasInstance;
  let tho: P5CanvasInstance;
  let tci: P5CanvasInstance;
  let tco: P5CanvasInstance;

  p.setup = () => {
    p.createCanvas(g.width, g.height);

    dt = Graphics.doubleTubeGraphic(500, 400, p);
    dtb = Graphics.doubleTubeBlue(500, 400, 50, 450, 50, p);
    dto = Graphics.doubleTubeOrng(500, 400, 50, 450, 50, p);
    // b = Graphics.createBeaker(p);
    bt = Graphics.beakersAndTubes(p);
    v = Graphics.valve(p);
    pa = Graphics.pumpAssembly(p);

    Graphics.thiTubes((thi = p.createGraphics(g.width, g.height)));
    Graphics.thoTubes((tho = p.createGraphics(g.width, g.height)));
    Graphics.tciTubes((tci = p.createGraphics(g.width, g.height)));
    Graphics.tcoTubes((tco = p.createGraphics(g.width, g.height)));

    // var options = { placement: "bottom" };
    // $("#hi-tooltip").tooltip(options);
    // $("#ho-tooltip").tooltip(options);
    // $("#ci-tooltip").tooltip(options);
    // $("#co-tooltip").tooltip(options);

    randStartVals(p);
  };

  p.draw = () => {
    p.background(250);

    drawAll(p, dt, bt, pa, v, dto, dtb, thi, tho, tci, tco);
  };

  p.mousePressed = () => {
    if (p.dist(90, 451, p.mouseX, p.mouseY) <= 50) {
      g.dragging1 = true;
    } else if (p.dist(415, 461, p.mouseX, p.mouseY) <= 50) {
      g.dragging2 = true;
    }
  };

  p.mouseReleased = () => {
    g.dragging1 = false;
    g.dragging2 = false;
  };
}
