import { P5CanvasInstance } from "@p5-wrapper/react";
import { g } from "./Sketch.tsx";
import { changeVols, integrateTemps } from "./Functions.tsx";
import { fillBeaker, displayValve } from "./Graphics.tsx";

import {
  MAX_HOT_FLOWRATE,
  MIN_HOT_FLOWRATE,
  MAX_COLD_FLOWRATE,
  MIN_COLD_FLOWRATE,
} from "./Functions.tsx";
import { AnimationFactory } from "../types/animation.tsx";

export const V1CX = 284;
export const V1CY = 432;
export const V2CX = 658;
export const V2CY = 432;

/* ********************************************* */
/* **************** DRAW DISPLAYS ************** */
/* ********************************************* */

const fillPumps = (p: P5CanvasInstance,s: number = 1) => {
  p.push();
  p.noStroke();
  // Right orange
  p.fill(255, 50, 0, 120);
  p.rect(652,437 + 143 * (1-s),14,143 * s);
  // Left blue
  p.fill(0, 80, 255, 100);
  p.rect(277,437 + 143 * (1-s),14,143 * s);
  p.pop();
}

// Main graphics loop called from draw. The logic here plays animations and displays everything inside the P5 canvas
export default function drawAll(
  p: P5CanvasInstance,
  dt: P5CanvasInstance,
  bt: P5CanvasInstance,
  pa: P5CanvasInstance,
  v: P5CanvasInstance,
  // dto: P5CanvasInstance,
  // dtb: P5CanvasInstance,
  // inTubes: P5CanvasInstance,
  // outTubes: P5CanvasInstance,
  fillingAnimation: AnimationFactory
) {
  let tb;
  tb = g.blueTime == -1 ? 0 : (p.millis() - g.blueTime) / 1000;

  // Calculations
  changeVols(p);
  integrateTemps(p);

  // Pumps 
  p.image(pa, 269, 434);
  p.image(pa, 644, 434);

  // Fill Beakers
  fillBeaker( 62, g.vols[3], g.blueFluidColor, p);
  fillBeaker(247, g.vols[2], g.blueFluidColor, p);
  fillBeaker(436, g.vols[1], g.orangeFluidColor, p);
  fillBeaker(625, g.vols[0], g.orangeFluidColor, p);

  // Tube and Beaker Outlines
  p.image(bt, 0, 0);
  // Tube Fills
  // fillAnimationTubes(to, p, inTubes, outTubes);
  // Apparatus
  p.image(dt, 149, 25);
  // Apparatus Fill
  let pumptime = tb < .3 ? tb / .3 : 1;
  fillPumps(p,pumptime);
  fillingAnimation.draw(p, tb);

  // Valves
  drag(p);
  displayValve(V1CX, V1CY+1, g.mDotH, MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE, p, v);
  displayValve(V2CX, V2CY+1, g.mDotC, MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE, p, v);

  // console.log(`Flowrates: ${g.mDotH.toFixed(1)} ${g.mDotC.toFixed(1)}\nTemps: ${g.Th_in.toFixed(1)} ${g.Th_out.toFixed(1)} ${g.Tc_in.toFixed(1)} ${g.Tc_out.toFixed(1)}`);
}

// handle dragging
function drag(p: P5CanvasInstance) {
  if (g.dragging1) {
    var theta = p.atan2(p.mouseY - V1CY, p.mouseX - V1CX);
    var prevTheta = p.atan2(p.pmouseY - V1CY, p.pmouseX - V1CX);
    var dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
    var dmDot = p.map(dTheta, 0, p.PI / 4, 0, MAX_HOT_FLOWRATE);

    g.mDotH += dmDot;
    g.mDotH = p.constrain(g.mDotH, MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE);
  } else if (g.dragging2) {
    theta = p.atan2(p.mouseY - V2CY, p.mouseX - V2CX);
    prevTheta = p.atan2(p.pmouseY - V2CY, p.pmouseX - V2CX);
    dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
    dmDot = p.map(dTheta, 0, p.PI / 4, 0, MAX_COLD_FLOWRATE);

    g.mDotC += dmDot;
    g.mDotC = p.constrain(g.mDotC, MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE);
  }
}
