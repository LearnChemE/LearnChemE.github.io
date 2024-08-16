/* ********************************************* */
/* *************** GRAPHICS ******************** */
/* ********************************************* */

import { P5CanvasInstance } from "@p5-wrapper/react";
import { g } from "./Sketch.tsx";

export function doubleTubeGraphic(w: number, h: number, p: P5CanvasInstance) {
  let lx = 50,
    rx = 450;
  let ty = 50,
    by = 350;
  let wHex = rx - lx,
    hHex = by - ty;

  let dt = p.createGraphics(w, h);

  dt.push();
  dt.stroke("black");
  dt.strokeWeight(2);
  dt.rect(lx, ty, wHex, hHex);

  // drawArrow(dt, [rx - 50, ty], [rx - 50, ty - 50]);
  // drawArrow(dt, [rx - 50, by + 50], [rx - 50, by]);
  // drawArrow(dt, [w, ty + 48], [rx, ty + 48]);
  // drawArrow(dt, [rx, by - 54], [w, by - 54]);
  dt.pop();

  let hPipe = horizontalPipe(wHex, hHex, p);

  dt.image(hPipe, lx + 1, ty + 30);
  dt.image(hPipe, lx + 1, ty + 96);
  dt.image(hPipe, lx + 1, ty + 162);
  dt.image(hPipe, lx + 1, ty + 228);

  // Connecting pipes for blue
  dt.push();
  dt.stroke("black");
  dt.strokeWeight(1);
  dt.rect(lx + 40, ty + 66, 20, 31);
  dt.rect(lx + 40, ty + 198, 20, 31);
  dt.rect(rx - 60, ty, 20, 31);
  dt.rect(rx - 60, ty + 132, 20, 31);
  dt.rect(rx - 60, ty + 264, 20, 35);
  dt.pop();

  let cPipe = curvePipe(p);
  dt.image(cPipe, 0, 86);
  dt.image(cPipe, 0, 218);

  dt.push();
  dt.translate(rx + 51, 242);
  dt.rotate(p.radians(180));
  dt.image(cPipe, 0, 0);
  dt.pop();

  return dt;
}

export function doubleTubeBlue(
  w: number,
  h: number,
  lx: number,
  rx: number,
  ty: number,
  p: P5CanvasInstance
) {
  let dtb = p.createGraphics(w, h);
  dtb.push();
  dtb.fill(g.blueFluidColor);
  dtb.strokeWeight(1);

  // v pipes
  dtb.rect(lx + 40, ty + 66, 20, 31);
  dtb.rect(lx + 40, ty + 198, 20, 31);
  dtb.rect(rx - 60, ty, 20, 31);
  dtb.rect(rx - 60, ty + 132, 20, 31);
  dtb.rect(rx - 60, ty + 264, 20, 35);

  // h pipes
  var wHex = rx - lx;
  dtb.rect(lx + wHex / 16 + 1, ty + 30, (wHex * 7) / 8, 36);
  dtb.rect(lx + wHex / 16 + 1, ty + 96, (wHex * 7) / 8, 36);
  dtb.rect(lx + wHex / 16 + 1, ty + 162, (wHex * 7) / 8, 36);
  dtb.rect(lx + wHex / 16 + 1, ty + 228, (wHex * 7) / 8, 36);
  dtb.pop();

  return dtb;
}

export function doubleTubeOrng(
  w: number,
  h: number,
  lx: number,
  rx: number,
  ty: number,
  p: P5CanvasInstance
) {
  let dto = p.createGraphics(w, h);
  let wHex = rx - lx;
  dto.push();
  dto.fill(g.orangeFluidColor);
  dto.noStroke();
  dto.rect(lx + 1, ty + 38, wHex - 2, 20);
  dto.rect(lx + 1, ty + 104, wHex - 2, 20);
  dto.rect(lx + 1, ty + 170, wHex - 2, 20);
  dto.rect(lx + 1, ty + 236, wHex - 2, 20);

  let orngArc = p.createGraphics(50, 90);
  orngArc.stroke(g.orangeFluidColor);
  orngArc.strokeWeight(20);
  orngArc.noFill();
  orngArc.circle(50, 45, 65);

  dto.image(orngArc, 0, 86);
  dto.image(orngArc, 0, 218);

  dto.push();
  dto.translate(rx + 51, 242);
  dto.rotate(p.radians(180));
  dto.image(orngArc, 0, 0);
  dto.pop();

  dto.pop();
  return dto;
}

function horizontalPipe(wHex: number, hHex: number, p: P5CanvasInstance) {
  let hPipe = p.createGraphics(wHex, hHex);
  hPipe.noFill();
  hPipe.strokeWeight(1);
  hPipe.stroke("black");
  hPipe.rect(0, 8, wHex - 2, 20);
  hPipe.noFill();
  hPipe.rect(wHex / 16, 0, (wHex * 7) / 8, 36);

  return hPipe;
}

function curvePipe(p: P5CanvasInstance) {
  let cPipe = p.createGraphics(50, 90);
  cPipe.stroke("black");
  cPipe.strokeWeight(1);
  cPipe.noFill();

  cPipe.circle(50, 45, 86);
  cPipe.push();

  cPipe.pop();
  cPipe.circle(50, 45, 47);

  return cPipe;
}

function createBeaker(p: P5CanvasInstance) {
  let b = p.createGraphics(120, 120);

  b.strokeWeight(5);
  b.stroke("black");
  // lip
  b.line(0, 2, 10, 2);
  b.line(110, 2, 120, 2);
  // sides
  b.line(10, 2, 10, 118);
  b.line(110, 2, 110, 118);
  // bottom
  b.line(10, 118, 110, 118);
  // measuring lines
  b.strokeWeight(2);
  for (let i = 0; i < 9; i++) {
    if (i % 2 == 0) {
      b.line(30, i * 10 + 20, 80, i * 10 + 20);
    } else {
      b.line(45, i * 10 + 20, 75, i * 10 + 20);
    }
  }
  b.noStroke();
  b.textSize(10);
  b.text("mL", 90, 11);
  b.text("1000", 83, 23);
  b.text("800", 83, 43);
  b.text("600", 83, 63);
  b.text("400", 83, 83);
  b.text("200", 83, 103);
  return b;
}

export function beakersAndTubes(p: P5CanvasInstance) {
  let bt = p.createGraphics(g.width, g.height);
  let b = createBeaker(p);
  bt.push();
  bt.translate(0, 450);
  bt.scale(1.25);
  bt.image(b, 50, 0);
  bt.image(b, 180, 0);
  bt.image(b, 310, 0);
  bt.image(b, 450, 0);
  bt.pop();

  bt.push();
  bt.stroke("black");
  bt.strokeWeight(2);
  bt.pop();

  bt.push();
  bt.stroke("black");
  bt.strokeWeight(2);
  // thi tube
  bt.line(95, 440, 95, 400);
  bt.line(85, 440, 85, 410);
  bt.line(85, 410, 10, 410);
  bt.line(95, 400, 20, 400);
  bt.line(10, 410, 10, 80);
  bt.line(20, 400, 20, 90);
  bt.line(10, 80, 520, 80);
  bt.line(20, 90, 510, 90);
  bt.line(520, 80, 520, 128);
  bt.line(510, 90, 510, 118);
  bt.line(520, 128, 450, 128);
  bt.line(510, 118, 450, 118);

  // tho tube
  bt.line(258, 580, 258, 410);
  bt.line(248, 580, 248, 400);
  bt.line(258, 410, 520, 410);
  bt.line(248, 400, 510, 400);
  bt.line(520, 410, 520, 315);
  bt.line(510, 400, 510, 325);
  bt.line(520, 315, 450, 315);
  bt.line(510, 325, 450, 325);

  // tci tube
  bt.line(420, 450, 420, 430);
  bt.line(410, 450, 410, 420);
  bt.line(420, 430, 430, 430);
  bt.line(410, 420, 420, 420);
  bt.line(430, 430, 430, 300);
  bt.line(420, 420, 420, 300);

  // tco tube
  bt.line(593, 580, 593, 10);
  bt.line(583, 580, 583, 20);
  bt.line(593, 10, 420, 10);
  bt.line(583, 20, 430, 20);
  bt.line(420, 10, 420, 100);
  bt.line(430, 20, 430, 100);
  bt.pop();

  // thiTubes(bt);
  // thoTubes(bt);
  // tciTubes(bt);
  // tcoTubes(bt);

  return bt;
}

export function thiTubes(bt: P5CanvasInstance) {
  bt.push();
  bt.fill(g.orangeFluidColor);
  bt.noStroke();
  bt.rect(83, 450, 13, 100);
  bt.rect(85, 400, 10, 50);
  bt.rect(10, 400, 75, 10);
  bt.rect(10, 80, 10, 320);
  bt.rect(20, 80, 500, 10);
  bt.rect(510, 90, 10, 38);
  bt.rect(450, 118, 60, 10);
  bt.pop();
}

export function thoTubes(bt: P5CanvasInstance) {
  bt.push();
  bt.fill(g.orangeFluidColor);
  bt.noStroke();
  bt.rect(248, 400, 10, 180);
  bt.rect(258, 400, 262, 10);
  bt.rect(510, 315, 10, 85);
  bt.rect(450, 315, 60, 10);
  bt.pop();
}

export function tciTubes(bt: P5CanvasInstance) {
  bt.push();
  bt.fill(g.blueFluidColor);
  bt.noStroke();
  bt.rect(408, 470, 13, 80);
  bt.rect(410, 420, 10, 50);
  bt.rect(420, 300, 10, 130);
  bt.pop();
}

export function tcoTubes(bt: P5CanvasInstance) {
  bt.push();
  bt.fill(g.blueFluidColor);
  bt.noStroke();
  bt.rect(583, 10, 10, 570);
  bt.rect(420, 10, 163, 10);
  bt.rect(420, 20, 10, 80);
  bt.pop();
}

export function valve(p: P5CanvasInstance) {
  let v = p.createGraphics(50, 50);
  v.push();
  v.fill("blue");
  v.stroke("black");
  v.strokeWeight(2);
  v.circle(25, 25, 48);
  v.rect(18, 0, 14, 50);
  v.pop();
  return v;
}

export function fillBeaker(
  x: number,
  vol: number,
  color = [0, 0, 0],
  p: P5CanvasInstance
) {
  vol = vol / 10;

  p.push();
  p.fill(color);
  p.noStroke();
  p.translate(0, 450);
  p.scale(1.25);

  p.translate(x, 0);
  p.rect(10, 120 - vol, 100, vol);
  p.pop();
}

// Places image of valve on x, y with the correct angle based on flow
export function displayValve(
  x: number,
  y: number,
  flow: number,
  minFlow: number,
  maxFlow: number,
  p: P5CanvasInstance,
  v: P5CanvasInstance
) {
  p.push();
  var angle = p.map(flow, minFlow, maxFlow, (3 * Math.PI) / 4, Math.PI);
  p.imageMode(p.CENTER);
  p.translate(x, y);
  p.scale(0.8);
  p.rotate(angle);

  p.image(v, 0, 0);
  p.pop();
}

export function pumpAssembly(p: P5CanvasInstance) {
  let pa = p.createGraphics(50, 150);
  pa.push();

  pa.push();
  pa.fill(0);
  pa.rect(10, 120, 30, 30);
  pa.rect(20, 110, 10, 10);
  pa.pop();

  pa.push();
  pa.stroke("black");
  pa.strokeWeight(3);
  pa.noFill();
  pa.line(17, 120, 17, 0);
  pa.line(32, 120, 32, 0);
  pa.pop();

  pa.pop();
  return pa;
}

export default {
  doubleTubeGraphic,
  doubleTubeBlue,
  doubleTubeOrng,
  beakersAndTubes,
  thiTubes,
  thoTubes,
  tciTubes,
  tcoTubes,
  valve,
  fillBeaker,
  displayValve,
  pumpAssembly,
};

export function singleBeakerGraphics(p: P5CanvasInstance) {
  let b = p.createGraphics(g.width, g.height);
  let beaker = createBeaker(p);
  let v = valve(p);

  b.push();
  b.scale(1.25);
  b.image(beaker, 290, 360);
  b.image(beaker, 450, 360);
  b.pop();

  b.push();
  b.stroke("black");
  b.strokeWeight(2);

  // cold tubes
  b.line(420, 430, 420, 50);
  b.line(430, 430, 430, 40);
  b.line(395, 590, 395, 50);
  b.line(385, 590, 385, 40);
  b.line(420, 50, 395, 50);
  b.line(430, 40, 385, 40);

  // hot out
  b.line(585, 325, 585, 590);
  b.line(595, 315, 595, 590);
  b.line(585, 325, 470, 325);
  b.line(595, 315, 470, 315);

  // hot in
  b.line(620, 127, 620, 430);
  b.line(630, 117, 630, 430);
  b.line(620, 127, 470, 127);
  b.line(630, 117, 470, 117);

  b.pop();

  // valves
  b.push();
  b.translate(406, 425);
  b.scale(0.75);
  b.image(v, 0, 0);
  b.translate(267, 0);
  b.image(v, 0, 0);
  b.pop();

  return b;
}
