import { P5CanvasInstance, P5WrapperClassName } from "@p5-wrapper/react";
import createGraphicsObjects, { graphicsObjects } from "./graphics";
import {
  MIN_COLD_FLOWRATE,
  MAX_COLD_FLOWRATE,
  MIN_HOT_FLOWRATE,
  MAX_HOT_FLOWRATE,
  handleDoubleBeakerCalculations,
  randStartVals,
} from "./functions";

// Globals defined here
export const g = {
  cnv: undefined,
  width: 800,
  height: 640,

  startTime: -1, // -1 means it's not running, will be replaced by millis() once pumps are started
  // blueTime: -1,

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

const showDebugCoordinates = (p: P5CanvasInstance) => {
  p.push();
  p.noStroke();
  p.fill("black");
  p.textAlign(p.LEFT, p.TOP);
  p.text("x: " + p.mouseX.toFixed(0) + " y: " + p.mouseY.toFixed(0), 1, 1);
  p.pop();
};

const NOT_DRAGGING = 0;
const DRAGGING_HOT = 1;
const DRAGGING_COLD = 2;
const PUMPS_NOT_STARTED = -1;
const START_PUMPS_NEXT_FRAME = -2;

// Sketch for P5 Wrapper
const ShellTubeSketch = (p: P5CanvasInstance) => {
  let graphics: graphicsObjects;
  let isDraggingValves: number = NOT_DRAGGING;

  const drag = (isDraggingValves: number) => {
    if (isDraggingValves === NOT_DRAGGING) return;

    // Take the change in angle to find change in mDot. Ignore if angle resets
    if (isDraggingValves === DRAGGING_HOT) {
      var theta = p.atan2(p.mouseY - 440, p.mouseX - 75);
      var prevTheta = p.atan2(p.pmouseY - 440, p.pmouseX - 75);
      var dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
      var dmDot = p.map(
        dTheta,
        0,
        p.PI / 4,
        0,
        MAX_HOT_FLOWRATE - MIN_HOT_FLOWRATE
      );

      g.mDotH += dmDot;
      g.mDotH = p.constrain(g.mDotH, MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE);
    } else {
      theta = p.atan2(p.mouseY - 442, p.mouseX - 447);
      prevTheta = p.atan2(p.pmouseY - 442, p.pmouseX - 447);
      dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
      dmDot = p.map(
        dTheta,
        0,
        p.PI / 4,
        0,
        MAX_COLD_FLOWRATE - MIN_COLD_FLOWRATE
      );

      g.mDotC += dmDot;
      g.mDotC = p.constrain(g.mDotC, MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE);
    }
  };

  const drawValve = (
    x: number,
    y: number,
    flow: number,
    minFlow: number,
    maxFlow: number,
    p: P5CanvasInstance,
    valve: P5CanvasInstance
  ) => {
    p.push();
    var angle: number = p.map(
      flow,
      minFlow,
      maxFlow,
      (3 * Math.PI) / 4,
      Math.PI
    );
    p.imageMode(p.CENTER);
    p.translate(x, y);
    p.scale(0.8);
    p.rotate(angle);

    p.image(valve, 0, 0);
    p.pop();
  };

  const fillAnimation = () => {
    let start: number;
    p.image(graphics.emptyTubes, 0, 0);
    p.image(graphics.shellTube, 75, 75);

    if ((start = g.startTime) === PUMPS_NOT_STARTED) return; // Pumps not started

    let current = p.millis() - start;
    if (current < 5000) {
      // Fill animation
      // fill inlet tubes
      let alpha: number = p.map(current, 0, 1000, 0, 255, true);
      let color: Array<number> = [255, 255, 255, alpha];
      p.push();
      p.tint(color);
      p.image(graphics.tubes[0], 0, 0);
      p.image(graphics.tubes[3], 0, 0);

      // HEX fill
      alpha = p.map(current, 1000, 4000, 0, 475, true);
      let alpha2 = p.map(current, 1000, 4000, 0, 300, true);
      let blue = graphics.blueShellTube.get(475 - alpha, 0, alpha, 300);
      let orng = graphics.orngShellTube.get(0, 0, 475, alpha2);
      if (alpha2 < 1 || alpha < 1) {
        p.pop();
        return;
      }
      p.image(orng, 75, 75);
      p.image(blue, 550 - alpha, 75);

      // Exit tubes
      alpha = p.map(current, 4000, 5000, 0, 255, true);
      color = [255, 255, 255, alpha];
      p.tint(color);
      p.image(graphics.tubes[1], 0, 0);
      p.image(graphics.tubes[2], 0, 0);

      p.pop();
    } else {
      // Pumps have been running
      for (let i = 0; i < 4; i++) p.image(graphics.tubes[i], 0, 0); // fill all tubes
      p.image(graphics.orngShellTube, 75, 75);
      p.image(graphics.blueShellTube, 75, 75);
    }
  };

  const fillBeaker = (
    p: P5CanvasInstance,
    x: number,
    vol: number,
    color: Array<number>
  ) => {
    let width = 150;
    vol *= 0.16;
    p.push();
    p.fill(...color);
    p.noStroke();
    p.rect(x, 630 - vol, width, vol);
    p.pop();
  };

  p.setup = () => {
    p.createCanvas(g.width, g.height);
    graphics = createGraphicsObjects(p); // Load graphics objects
    randStartVals();
  };

  p.draw = () => {
    if (g.startTime === START_PUMPS_NEXT_FRAME) g.startTime = p.millis();
    p.background(250);
    // showDebugCoordinates(p);

    p.image(graphics.pumpAssembly,  60, 455);
    p.image(graphics.pumpAssembly, 430, 455);

    fillAnimation();
    drag(isDraggingValves);
    drawValve(
      75,
      440,
      g.mDotH,
      MIN_HOT_FLOWRATE,
      MAX_HOT_FLOWRATE,
      p,
      graphics.valve
    );
    drawValve(
      445,
      440,
      g.mDotC,
      MIN_COLD_FLOWRATE,
      MAX_COLD_FLOWRATE,
      p,
      graphics.valve
    );

    handleDoubleBeakerCalculations(p.deltaTime);
    // console.log(g.Th_in, g.Th_out, g.Tc_in, g.Tc_out);

    // prettier-ignore
    fillBeaker(p,  55, g.vols[0], g.orangeFluidColor);
    fillBeaker(p, 235, g.vols[1], g.orangeFluidColor);
    fillBeaker(p, 415, g.vols[2], g.blueFluidColor);
    fillBeaker(p, 595, g.vols[3], g.blueFluidColor);
    p.image(graphics.beakers, 0, 0);
  };

  // P5 mousePressed handler determines if dragging
  p.mousePressed = () => {
    let x: number = p.mouseX;
    let y: number = p.mouseY;
    if (y >= 360 && y <= 480) {
      if (x >= 35 && x <= 115) {
        isDraggingValves = DRAGGING_HOT;
      }
      if (x >= 405 && x <= 485) {
        isDraggingValves = DRAGGING_COLD;
      }
    }
  };

  // Stop dragging
  p.mouseReleased = () => {
    isDraggingValves = NOT_DRAGGING;
  };
};

export default ShellTubeSketch;
