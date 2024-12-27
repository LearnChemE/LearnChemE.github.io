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

/* ********************************************* */
/* **************** DRAW DISPLAYS ************** */
/* ********************************************* */

// Main graphics loop called from draw. The logic here plays animations and displays everything inside the P5 canvas
export default function drawAll(
  p: P5CanvasInstance,
  dt: P5CanvasInstance,
  bt: P5CanvasInstance,
  pa: P5CanvasInstance,
  v: P5CanvasInstance,
  dto: P5CanvasInstance,
  dtb: P5CanvasInstance,
  thi: P5CanvasInstance,
  tho: P5CanvasInstance,
  tci: P5CanvasInstance,
  tco: P5CanvasInstance
) {
  let to, tb;
  to = g.orngTime == -1 ? 0 : (p.millis() - g.orngTime) / 1000;
  tb = g.blueTime == -1 ? 0 : (p.millis() - g.blueTime) / 1000;

  changeVols(p);
  integrateTemps(p);

  p.image(pa, 65, 440);
  p.image(pa, 390, 440);

  p.push();
  fillBeaker(50, g.vols[0], g.orangeFluidColor, p);
  fillBeaker(180, g.vols[1], g.orangeFluidColor, p);
  fillBeaker(310, g.vols[2], g.blueFluidColor, p);
  fillBeaker(450, g.vols[3], g.blueFluidColor, p);
  p.pop();

  p.image(bt, 0, 0);
  fillAnimationTubes(to, tb, p, thi, tho, tci, tco);
  p.image(dt, 25, 25);
  fillAnimationOrange(to, 0, 25, p, dto);
  fillAnimationBlue(tb, 0, 25, p, dtb);

  drag(p);
  displayValve(90, 431, g.mDotH, MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE, p, v);
  displayValve(415, 451, g.mDotC, MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE, p, v);

  // console.log(`Flowrates: ${g.mDotH.toFixed(1)} ${g.mDotC.toFixed(1)}\nTemps: ${g.Th_in.toFixed(1)} ${g.Th_out.toFixed(1)} ${g.Tc_in.toFixed(1)} ${g.Tc_out.toFixed(1)}`);
}

// Cold fill animation
function fillAnimationBlue(
  t: number,
  x = 0,
  y = 0,
  p: P5CanvasInstance,
  dtb: P5CanvasInstance
) {
  let s;
  let partBlue;

  p.push();
  p.translate(x, y);
  if (t <= 5) {
    s = 88 + t * 160;
    partBlue = dtb.get(0, 450 - s, 500, 50 + s);
    p.image(partBlue, 25, 450 - s);
  } else if (g.vols[2] > 0) {
    p.image(dtb, 25, 0);
  }
  p.pop();
}

// hot fill animation
function fillAnimationOrange(
  t: number,
  x = 0,
  y = 0,
  p: P5CanvasInstance,
  dto: P5CanvasInstance
) {
  // if (!g.hIsFlowing) return;
  let s;
  let partOrng;

  p.push();
  p.translate(x, y);
  if (t <= 3) {
    s = 88 + t * 160 - 100;
    s = p.constrain(s, 1, 600);
    partOrng = dto.get(0, 0, 500, s);
    p.image(partOrng, 25, 0);
  } else if (g.vols[0] > 0) {
    p.image(dto, 25, 0);
  }
  p.pop();
}

// The tint function is a very costy solution. Better would be to use a framebuffer
function fillAnimationTubes(
  tOrange: number,
  tBlue: number,
  p: P5CanvasInstance,
  thi: P5CanvasInstance,
  tho: P5CanvasInstance,
  tci: P5CanvasInstance,
  tco: P5CanvasInstance
) {
  p.push();
  if (tOrange < 3 && g.hIsFlowing) {
    let s = p.constrain(tOrange * 1000, 0, 255);
    p.tint(255, s);
    p.image(thi, 0, 0);
    s = p.constrain(tOrange * 1000 - 2000, 0, 255);
    p.tint(255, s);
    p.image(tho, 0, 0);
  } else if (g.orngTime != -1 && g.vols[0] > 0) {
    p.image(thi, 0, 0);
    p.image(tho, 0, 0);
    // if (p.hPumpBtn.disabled) {
    //   p.hPumpBtn.disabled = false;
    //   p.hPumpBtn.ariaDisabled = false;
    // }
  }

  if (tBlue < 3 && g.cIsFlowing) {
    let s = p.constrain(tBlue * 1000, 0, 255);
    p.tint(255, s);
    p.image(tci, 0, 0);
    s = p.constrain(tBlue * 1000 - 2000, 0, 255);
    p.tint(255, s);
    p.image(tco, 0, 0);
  } else if (g.blueTime != -1 && g.vols[2] > 0) {
    p.image(tci, 0, 0);
    p.image(tco, 0, 0);
  }

  p.pop();
}

// handle dragging
function drag(p: P5CanvasInstance) {
  if (g.dragging1) {
    var theta = p.atan2(p.mouseY - 431, p.mouseX - 90);
    var prevTheta = p.atan2(p.pmouseY - 431, p.pmouseX - 90);
    var dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
    var dmDot = p.map(dTheta, 0, p.PI / 4, 0, MAX_HOT_FLOWRATE);

    g.mDotH += dmDot;
    g.mDotH = p.constrain(g.mDotH, MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE);
  } else if (g.dragging2) {
    theta = p.atan2(p.mouseY - 461, p.mouseX - 415);
    prevTheta = p.atan2(p.pmouseY - 461, p.pmouseX - 415);
    dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
    dmDot = p.map(dTheta, 0, p.PI / 4, 0, MAX_COLD_FLOWRATE);

    g.mDotC += dmDot;
    g.mDotC = p.constrain(g.mDotC, MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE);
  }
}
