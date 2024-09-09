import { g } from "./Sketch";
import Graphics from "./Graphics";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { singleBeakerGraphics } from "./Graphics";
import {
  MAX_COLD_FLOWRATE,
  MAX_COLD_WATER_TEMP,
  MAX_HOT_FLOWRATE,
  MAX_HOT_WATER_TEMP,
  MIN_COLD_WATER_TEMP,
  MIN_HOT_WATER_TEMP,
  singleBeakerCalculations,
} from "./Functions";
// import { event } from "jquery";

const NOT_STARTED = -1;
const START_ON_RENDER = -2;
let startAniTime = NOT_STARTED; // Start time of fill animation (ms)
export const setAnimationTimeNextFrame = () => {
  if (startAniTime === NOT_STARTED) {
    startAniTime = START_ON_RENDER;
    return true;
  }
  return false;
};

export const setAnimationTimeToNotStarted = () => {
  startAniTime = NOT_STARTED;
};

interface SingleTubeGraphicsObjs {
  dt: any;
  dtb: any;
  dto: any;
  singleBeakers: any;
  pa: any;
  therm: any;
}

export function SingleBeakerSketch(p: P5CanvasInstance) {
  const graphicsObjs = {
    dt: undefined,
    dtb: undefined,
    dto: undefined,
    singleBeakers: undefined,
    pa: undefined,
    therm: undefined,
  };
  let pinchingColdTube = false;

  p.setup = () => {
    p.createCanvas(g.width, g.height);
    randSingleStartVals();

    graphicsObjs.dt = Graphics.doubleTubeGraphic(500, 400, p);
    graphicsObjs.dtb = Graphics.doubleTubeBlue(500, 400, 50, 450, 50, p);
    graphicsObjs.dto = Graphics.doubleTubeOrng(500, 400, 50, 450, 50, p);
    graphicsObjs.singleBeakers = singleBeakerGraphics(p);
    graphicsObjs.pa = Graphics.pumpAssembly(p);
    graphicsObjs.therm = p.loadImage("thermometer.png");
  };

  p.draw = () => {
    p.background(250);
    singleBeakerCalculations(p);
    if (startAniTime === START_ON_RENDER) startAniTime = p.millis();

    p.image(graphicsObjs.pa, 400, 450);
    p.image(graphicsObjs.pa, 600, 450);

    Graphics.fillBeaker(290, 1000, g.blueFluidColor, p);
    Graphics.fillBeaker(450, 1000, g.orangeFluidColor, p);

    singleBeakerFillAnimation(p, graphicsObjs);
    if (startAniTime != NOT_STARTED) drawThermometer(p, graphicsObjs);
    if (pinchingColdTube) {
      pinchColdTubeGraphic(p);
    } else {
      p.push();
      p.noFill();
      p.drawingContext.setLineDash([10, 10]);
      p.stroke("green");
      p.strokeWeight(2);
      p.rect(400, 370, 50, 60);
      p.pop();
    }
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= 400 &&
      p.mouseX <= 450 &&
      p.mouseY >= 370 &&
      p.mouseY <= 430
    ) {
      pinchingColdTube = true;
      setTimeout(() => {
        g.mDotC = MAX_COLD_FLOWRATE / 8;
      }, 1000);
    }
  };

  p.mouseReleased = () => {
    pinchingColdTube = false;
    setTimeout(() => {
      g.mDotC = MAX_COLD_FLOWRATE;
    }, 1000);
  };
}

function singleBeakerFillAnimation(
  p: P5CanvasInstance,
  graphicsObjs: SingleTubeGraphicsObjs
) {
  let aniTime = p.millis() - startAniTime;
  if (startAniTime === NOT_STARTED) {
    // Button not pressed
    p.image(graphicsObjs.singleBeakers, 0, 0);
    p.image(graphicsObjs.dt, 25, 25);
  } else if (aniTime < 7000) {
    // Button just pressed
    let alpha1 = p.map(aniTime, 0, 1000, 0, 200, true);
    let hexCartridgeFillTimer = p.map(aniTime, 0, 3000, 0, 400, true);
    let alpha2 = p.map(aniTime - 3000, 0, 1000, 0, 200, true);

    fillSingleInletTubes(p, alpha1);
    p.image(graphicsObjs.singleBeakers, 0, 0);
    p.image(graphicsObjs.dt, 25, 25);
    hexCartridgeFillAnimation(
      p,
      hexCartridgeFillTimer,
      graphicsObjs.dto,
      graphicsObjs.dtb
    );
    fillSingleOutletTubes(p, alpha2);
  } else {
    // already full
    fillSingleInletTubes(p);
    fillSingleOutletTubes(p);
    p.image(graphicsObjs.singleBeakers, 0, 0);
    p.image(graphicsObjs.dt, 25, 25);
    p.image(graphicsObjs.dto, 25, 25);
    p.image(graphicsObjs.dtb, 25, 25);
  }
}

// Fill the lines going into the HEX
function fillSingleInletTubes(p: P5CanvasInstance, alpha = 200) {
  let color = g.orangeFluidColor.slice();
  color[3] = alpha;

  p.push();
  p.noStroke();
  p.fill(color);
  p.rect(620, 117, 10, 330);
  p.rect(470, 117, 150, 10);
  p.rect(617, 450, 15, 120);

  color = g.blueFluidColor.slice();
  color[3] = alpha;
  p.fill(color);
  p.rect(420, 370, 10, 60);
  p.rect(418, 430, 13, 140);
  p.pop();
}

// Fill tubes coming out of HEX
function fillSingleOutletTubes(p: P5CanvasInstance, alpha = 200) {
  let color = g.orangeFluidColor.slice();
  color[3] = alpha;
  p.push();
  p.noStroke();
  p.fill(color);
  p.rect(585, 315, 10, 160);
  p.rect(475, 315, 110, 10);

  color = g.blueFluidColor.slice();
  color[3] = alpha;
  p.fill(color);
  p.rect(385, 375, 10, 215);
  p.rect(385, 40, 10, 35);
  p.rect(395, 40, 25, 10);
  p.rect(420, 40, 10, 35);
  p.pop();
}

function hexCartridgeFillAnimation(
  p: P5CanvasInstance,
  timer: number,
  dto: any,
  dtb: any
) {
  let partOrng = dto.get(0, 0, 500, timer + 10);
  p.image(partOrng, 25, 25);

  let partBlue = dtb.get(0, 450 - timer, 500, 50 + timer);
  p.image(partBlue, 25, 475 - timer);
}

// Apply overlay to canvas that makes it look like you are pinching the tube
function pinchColdTubeGraphic(p: P5CanvasInstance) {
  p.push();
  p.noStroke();
  // p.rect(419, 385, 12, 30);

  p.fill("white");
  p.triangle(419, 385, 419, 415, 423, 400);
  p.triangle(431, 385, 431, 415, 427, 400);

  p.stroke("black");
  p.strokeWeight(2);
  p.line(420, 385, 423, 400);
  p.line(420, 415, 423, 400);
  p.line(430, 385, 427, 400);
  p.line(430, 415, 427, 400);

  p.pop();
}

// randomize start values for single
export function randSingleStartVals() {
  g.Th_in =
    Math.random() * (MAX_HOT_WATER_TEMP - MIN_HOT_WATER_TEMP) +
    MIN_HOT_WATER_TEMP;
  g.Th_out =
    Math.random() * (MAX_COLD_WATER_TEMP - MIN_COLD_WATER_TEMP) +
    MIN_COLD_WATER_TEMP;
  g.mDotH = MAX_HOT_FLOWRATE;
  g.mDotC = MAX_COLD_FLOWRATE;
}

function drawThermometer(
  p: P5CanvasInstance,
  graphicsObjs: SingleTubeGraphicsObjs
) {
  // show measurement of the outlet stream
  console.log("drawing therm");
  p.push();
  p.translate(495, 455);
  p.rotate(-1.5);
  p.image(graphicsObjs.therm, 0, 0);
  p.pop();
}
