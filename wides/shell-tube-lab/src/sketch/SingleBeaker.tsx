import { P5CanvasInstance, P5WrapperClassName } from "@p5-wrapper/react";
import createGraphicsObjects, {
  graphicsObjects,
  singleGraphicsObj,
  createSingleGraphicsObjects,
} from "./graphics";
import {
  MIN_COLD_FLOWRATE,
  MAX_COLD_FLOWRATE,
  MIN_HOT_FLOWRATE,
  MAX_HOT_FLOWRATE,
  handleDoubleBeakerCalculations,
  randStartVals,
} from "./functions";
import { g } from "./sketch";

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

const SingleBeakerSketch = (p: P5CanvasInstance) => {
  let graphics: graphicsObjects;
  let singleGraphics: singleGraphicsObj;

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
    p.image(singleGraphics.emptyTubes, 0, 0);
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
      p.image(singleGraphics.tubes[0], 0, 0);
      p.image(singleGraphics.tubes[3], 0, 0);

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
      p.image(singleGraphics.tubes[1], 0, 0);
      p.image(singleGraphics.tubes[2], 0, 0);

      p.pop();
    } else {
      // Pumps have been running
      for (let i = 0; i < 4; i++) p.image(singleGraphics.tubes[i], 0, 0); // fill all tubes
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
    singleGraphics = createSingleGraphicsObjects(p);
    randStartVals();
  };

  p.draw = () => {
    if (g.startTime === START_PUMPS_NEXT_FRAME) g.startTime = p.millis();
    p.background(250);
    showDebugCoordinates(p);

    fillAnimation();

    // Pumps and valves
    p.image(graphics.pumpAssembly, 51, 470);
    p.image(graphics.pumpAssembly, 601, 470);

    p.push();
    p.translate(58, 400);
    p.scale(0.6);
    p.image(graphics.valve, 0, 0);
    p.pop();

    // Beakers
    // prettier-ignore
    fillBeaker(p,  55, g.vols[0], g.orangeFluidColor);
    fillBeaker(p, 235, g.vols[1], g.orangeFluidColor);
    fillBeaker(p, 415, g.vols[3], g.blueFluidColor);
    fillBeaker(p, 595, g.vols[2], g.blueFluidColor);
    p.image(singleGraphics.beakers, 0, 0);
  };
};

export default SingleBeakerSketch;
