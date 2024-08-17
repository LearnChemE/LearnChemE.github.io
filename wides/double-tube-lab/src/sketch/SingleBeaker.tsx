import { g } from "./Sketch";
import Graphics from "./Graphics";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { singleBeakerGraphics } from "./Graphics";
import { event } from "jquery";

const NOT_STARTED = -1;
const START_ON_RENDER = -2;
let startAniTime = NOT_STARTED; // Start time of fill animation (ms)
export const setAnimationTimeNextFrame = () => {
  startAniTime = START_ON_RENDER;
};

interface SingleTubeGraphicsObjs {
  dt: any;
  dtb: any;
  dto: any;
  singleBeakers: any;
  pa: any;
}

export function SingleBeakerSketch(p: P5CanvasInstance) {
  const graphicsObjs = {
    dt: undefined,
    dtb: undefined,
    dto: undefined,
    singleBeakers: undefined,
    pa: undefined,
  };

  p.setup = () => {
    p.createCanvas(g.width, g.height);

    graphicsObjs.dt = Graphics.doubleTubeGraphic(500, 400, p);
    graphicsObjs.dtb = Graphics.doubleTubeBlue(500, 400, 50, 450, 50, p);
    graphicsObjs.dto = Graphics.doubleTubeOrng(500, 400, 50, 450, 50, p);
    graphicsObjs.singleBeakers = singleBeakerGraphics(p);
    graphicsObjs.pa = Graphics.pumpAssembly(p);
  };

  p.draw = () => {
    p.background(250);
    if (startAniTime === START_ON_RENDER) startAniTime = p.millis();

    p.image(graphicsObjs.pa, 400, 450);
    p.image(graphicsObjs.pa, 600, 450);

    Graphics.fillBeaker(290, 1000, g.blueFluidColor, p);
    Graphics.fillBeaker(450, 1000, g.orangeFluidColor, p);

    singleBeakerFillAnimation(p, graphicsObjs);
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
    let alpha2 = p.map(aniTime, 0, 1000, 0, 200, true);

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
  let color = g.orangeFluidColor;
  color[3] = alpha;
  p.push();
  p.noStroke();
  p.fill(color);
  p.rect(620, 117, 10, 330);
  p.rect(470, 117, 150, 10);
  p.rect(617, 450, 15, 120);

  color = g.blueFluidColor;
  color[3] = alpha;
  p.fill(color);
  p.rect(420, 370, 10, 60);
  p.rect(418, 430, 13, 140);
  p.pop();
}

// Fill tubes coming out of HEX
function fillSingleOutletTubes(p: P5CanvasInstance, alpha = 200) {
  let color = g.orangeFluidColor;
  color[3] = alpha;
  p.push();
  p.noStroke();
  p.fill(color);
  p.rect(585, 315, 10, 160);
  p.rect(475, 315, 110, 10);

  color = g.blueFluidColor;
  color[3] = alpha;
  p.fill(color);
  p.rect(385, 375, 10, 100);
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
