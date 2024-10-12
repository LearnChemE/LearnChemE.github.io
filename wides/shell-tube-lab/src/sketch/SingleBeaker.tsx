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
  handleSingleBeakerCalculations,
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
  let thermometer: any;
  let pinchingColdTube: boolean = false;

  const drawValves = (p: P5CanvasInstance) => {
    p.push();
    p.translate(60, 420);
    p.scale(0.6);
    p.image(graphics.valve, 0, 0);
    p.pop();
    p.push();
    p.translate(610, 420);
    p.scale(0.6);
    p.image(graphics.valve, 0, 0);
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
    // Create canvas
    p.createCanvas(g.width, g.height);
    // Load graphics objects
    graphics = createGraphicsObjects(p);
    singleGraphics = createSingleGraphicsObjects(p);
    thermometer = p.loadImage("thermometer.png");
    // Randomize start Temps
    randStartVals();
    g.mDotH = MAX_HOT_FLOWRATE;
    g.mDotC = MAX_COLD_FLOWRATE;
    // Im used to OpenGL so I like degrees
    p.angleMode(p.DEGREES);
  };

  p.draw = () => {
    if (g.startTime === START_PUMPS_NEXT_FRAME) g.startTime = p.millis();
    p.background(250);
    // Coordinates in top left
    // showDebugCoordinates(p);
    // Calculations
    handleSingleBeakerCalculations(p.deltaTime);

    fillAnimation();
    if (g.startTime !== PUMPS_NOT_STARTED) {
      p.push();
      p.translate(198, 370);
      p.rotate(80);
      p.image(thermometer, 0, 0);
      p.pop();
    }

    // Pumps
    p.image(graphics.pumpAssembly, 51, 470);
    p.image(graphics.pumpAssembly, 601, 470);
    // Valves
    drawValves(p);
    // Beakers
    // prettier-ignore
    fillBeaker(p,  55, g.vols[0], g.orangeFluidColor);
    fillBeaker(p, 235, g.vols[1], g.orangeFluidColor);
    fillBeaker(p, 415, g.vols[3], g.blueFluidColor);
    fillBeaker(p, 595, g.vols[2], g.blueFluidColor);
    p.image(singleGraphics.beakers, 0, 0);

    if (pinchingColdTube) {
      p.push();
      p.translate(575, 389);
      p.rotate(90);
      p.image(singleGraphics.pinching, 0, 0);
      p.pop();
    } else {
      p.push();
      p.noFill();
      p.drawingContext.setLineDash([10, 10]);
      p.stroke("green");
      p.strokeWeight(2);
      p.rect(
        PINCH_LEFT,
        PINCH_TOP,
        PINCH_RIGHT - PINCH_LEFT,
        PINCH_BOTTOM - PINCH_TOP
      );
      p.pop();
    }
    // Debug purposes
    // console.log(
    //   g.Th_in + " " + g.Th_out + " " + g.Tc_in + " " + g.Tc_out + " "
    // );
  };

  const PINCH_LEFT: number = 475;
  const PINCH_RIGHT: number = 635;
  const PINCH_TOP: number = 375;
  const PINCH_BOTTOM: number = 410;
  p.mousePressed = () => {
    if (
      p.mouseX >= PINCH_LEFT &&
      p.mouseX <= PINCH_RIGHT &&
      p.mouseY >= PINCH_TOP &&
      p.mouseY <= PINCH_BOTTOM
    ) {
      pinchingColdTube = true;
      setTimeout(() => {
        g.mDotC = MAX_COLD_FLOWRATE / 4;
      }, 1000);
    }
  };

  p.mouseReleased = () => {
    pinchingColdTube = false;
    setTimeout(() => {
      g.mDotC = MAX_COLD_FLOWRATE;
    }, 1000);
  };
};

export default SingleBeakerSketch;
