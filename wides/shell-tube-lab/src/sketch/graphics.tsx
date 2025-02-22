import { P5CanvasInstance } from "@p5-wrapper/react";

export const ORANGE_FLUID_COLOR = [255, 50, 0, 200];
export const BLUE_FLUID_COLOR = [0, 80, 255, 180];

// bt.image(b, 50, 450);
// bt.image(b, 230, 450);
// bt.image(b, 410, 450);
// bt.image(b, 590, 450);

// prettier-ignore
const shellTubeBlueVertices = [[60, 5],[110, 5],[110, 230],[115, 230],[115, 5],[220, 5],[220, 230],[225, 230],[225, 5],[330, 5],[330, 230],[335, 230],[335, 5],[440, 5],[440, 295],[390, 295],[390, 70],[385, 70],[385, 295],[280, 295],[280, 70],[275, 70],[275, 295],[170, 295],[170, 70],[165, 70],[165, 295],[60, 295],[60, 5],];
// prettier-ignore
const hiTubeVertices = [[80, 430],[80, 405],[35, 405],[35, 35],[100, 35],[100, 75],[110, 75],[110, 25],[25, 25],[25, 415],[70, 415],[70, 430]];
// prettier-ignore
const hoTubeVertices = [[260, 620],[260, 400],[100, 400],[100, 375],[110, 375],[110, 390],[270, 390],[270, 620],];
// prettier-ignore
const ciTubeVertices = [[620, 620],[620, 35],[165, 35],[165, 75],[155, 75],[155, 25],[450, 25],[630, 25],[630, 620],];
// prettier-ignor
const coTubeVertices = [[440, 450],[440, 430],[440, 400],[485, 400],[485, 375],[495, 375],[495, 410],[450, 410],[450, 450]];

function createShellTubeGraphic(p: P5CanvasInstance) {
  const width = 475,
    height = 300;
  let st = p.createGraphics(width, height);
  st.push();
  st.strokeWeight(3);
  st.rect(0, 0, width, height); // outline
  st.noFill();
  st.strokeWeight(2);

  // orange
  st.rect(5, 5, 50, 140);
  st.rect(5, 155, 50, 140);
  st.rect(445, 20, 25, 260);
  // horizontal pipes
  st.rect(55, 30, 390, 20);
  st.rect(55, 105, 390, 20);
  st.rect(55, 175, 390, 20);
  st.rect(55, 250, 390, 20);

  // blue
  st.beginShape();
  for (let i = 0; i < shellTubeBlueVertices.length; i++) {
    st.vertex(shellTubeBlueVertices[i][0], shellTubeBlueVertices[i][1]);
  }
  st.endShape();
  st.pop();
  return st;
}

function createOrngShellTubeGraphic(p: P5CanvasInstance) {
  const width = 475,
    height = 300;
  let sto = p.createGraphics(width, height);

  sto.push();
  sto.noStroke();
  sto.fill(ORANGE_FLUID_COLOR);

  sto.rect(5, 5, 50, 140);
  sto.rect(5, 155, 50, 140);
  sto.rect(445, 20, 25, 260);
  // horizontal pipes
  sto.rect(55, 30, 390, 20);
  sto.rect(55, 105, 390, 20);
  sto.rect(55, 175, 390, 20);
  sto.rect(55, 250, 390, 20);

  sto.pop();
  return sto;
}

function createBlueShellTubeGraphic(p: P5CanvasInstance) {
  const width = 475,
    height = 300;
  let stb = p.createGraphics(width, height);
  stb.push();
  stb.noStroke();
  stb.fill(BLUE_FLUID_COLOR);
  stb.beginShape();
  for (let i = 0; i < shellTubeBlueVertices.length; i++) {
    stb.vertex(shellTubeBlueVertices[i][0], shellTubeBlueVertices[i][1]);
  }
  stb.endShape();
  stb.pop();
  return stb;
}

function createBeakerGraphic(p: P5CanvasInstance) {
  let b = p.createGraphics(160, 180);
  //   b.background("yellow");
  b.push();
  b.stroke("black");
  b.strokeWeight(3);
  b.line(5, 0, 5, 178);
  b.line(5, 178, 155, 178);
  b.line(155, 0, 155, 178);

  b.strokeWeight(2);
  b.textAlign(p.CENTER, p.CENTER);
  for (let i = 0; i < 10; i++) {
    let hOffset = i % 2 ? 0 : 15;
    let vOffset = i * 16;
    b.line(50 + hOffset, 20 + vOffset, 120, 20 + vOffset);
    b.push();
    b.noStroke();
    b.text(1000 - i * 100, 138, 20 + vOffset);
    b.pop();
  }
  b.noStroke();
  b.text("mL", 134, 8);
  b.pop();
  return b;
}

function createBeakersGraphic(p: P5CanvasInstance) {
  let bt = p.createGraphics(p.width, p.height);
  let b = createBeakerGraphic(p);
  // beakers
  bt.image(b, 50, 450);
  bt.image(b, 230, 450);
  bt.image(b, 410, 450);
  bt.image(b, 590, 450);
  b.remove();
  return bt;
}

function createEmptyTubesGraphic(p: P5CanvasInstance) {
  let bt = p.createGraphics(p.width, p.height);
  // tubes
  // hot in
  bt.strokeWeight(2);
  bt.noFill();
  bt.beginShape();
  for (let i = 0; i < hiTubeVertices.length; i++) {
    bt.vertex(hiTubeVertices[i][0], hiTubeVertices[i][1]);
  }
  bt.endShape();

  // hot out
  bt.beginShape();
  for (let i = 0; i < hoTubeVertices.length; i++) {
    bt.vertex(hoTubeVertices[i][0], hoTubeVertices[i][1]);
  }
  bt.endShape();

  // cold in
  bt.beginShape();
  for (let i = 0; i < ciTubeVertices.length; i++) {
    bt.vertex(ciTubeVertices[i][0], ciTubeVertices[i][1]);
  }
  bt.endShape();

  // cold out
  bt.beginShape();
  for (let i = 0; i < coTubeVertices.length; i++) {
    bt.vertex(coTubeVertices[i][0], coTubeVertices[i][1]);
  }
  bt.endShape();

  return bt;
}

function createTubeFluidGraphic(
  p: P5CanvasInstance,
  vertices: number[][],
  color: any
) {
  let hi = p.createGraphics(p.width, p.height);
  hi.push();
  hi.noStroke();
  hi.fill(color);
  hi.beginShape();
  for (let i = 0; i < vertices.length; i++) {
    hi.vertex(vertices[i][0], vertices[i][1]);
  }
  hi.endShape();
  hi.pop();

  return hi;
}

// exception to tube graphics because ci tube has two parts
function blueTubeFluidGraphicException(
  p: P5CanvasInstance,
  vertices: number[][],
  color: any,
  poly2start: number,
  poly2end: number
) {
  let hi = p.createGraphics(p.width, p.height);
  let i: number,
    n: number = vertices.length;
  hi.push();
  hi.noStroke();
  hi.fill(color);

  // Upper part
  hi.beginShape();
  for (i = poly2start; i < poly2end; i++) {
    hi.vertex(vertices[i][0], vertices[i][1]);
  }
  hi.endShape();

  // Lower part
  hi.beginShape();
  // Before 2nd polygon
  for (i = 0; i < poly2start; i++) {
    hi.vertex(vertices[i][0], vertices[i][1]);
  }

  for (i = poly2end; i < n; i++) {
    hi.vertex(vertices[i][0], vertices[i][1]);
  }
  hi.endShape();
  hi.pop();

  return hi;
}

function createValveGraphic(p: P5CanvasInstance) {
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

function pumpAssembly(p: P5CanvasInstance) {
  let pa = p.loadImage("./Pump.png"); //createGraphics(50, 150);
  // pa.push();

  // pa.push();
  // pa.fill(0);
  // pa.rect(10, 120, 30, 30);
  // pa.rect(20, 110, 10, 10);
  // pa.pop();

  // pa.push();
  // pa.stroke("black");
  // pa.strokeWeight(3);
  // pa.noFill();
  // pa.line(17, 120, 17, 0);
  // pa.line(32, 120, 32, 0);
  // pa.pop();

  // pa.pop();
  return pa;
}

export interface graphicsObjects {
  shellTube: any;
  orngShellTube: any;
  blueShellTube: any;
  emptyTubes: any;
  beakers: any;
  tubes: any[];
  valve: any;
  pumpAssembly: any;
}
export function createGraphicsObjects(p: P5CanvasInstance): graphicsObjects {
  let g = {
    shellTube: createShellTubeGraphic(p),
    orngShellTube: createOrngShellTubeGraphic(p),
    blueShellTube: createBlueShellTubeGraphic(p),
    emptyTubes: createEmptyTubesGraphic(p),
    beakers: createBeakersGraphic(p),
    tubes: [
      createTubeFluidGraphic(p, hiTubeVertices, ORANGE_FLUID_COLOR),
      createTubeFluidGraphic(p, hoTubeVertices, ORANGE_FLUID_COLOR),
      createTubeFluidGraphic(p, ciTubeVertices, BLUE_FLUID_COLOR),
      createTubeFluidGraphic(p, coTubeVertices, BLUE_FLUID_COLOR),
    ],
    valve: createValveGraphic(p),
    pumpAssembly: pumpAssembly(p),
  };

  return g;
}

// Single beaker tube vertices
// prettier-ignore
const hoSingleVert = [[100, 400],[100, 375],[110, 375],[110, 400],];
// prettier-ignore
const coSingleVert = [[650, 470],[650, 35],[165, 35],[165, 75],[155, 75],[155, 25],[660, 25],[660, 470],];
// prettier-ignore
const ciSingleVert = [[600,450],[600,400],[485,400],[485,375],[495,375],[495,390],[610,390],[610,450]];

function createEmptySingleTubes(p: P5CanvasInstance) {
  let bt = p.createGraphics(p.width, p.height);
  // tubes
  // hot in
  bt.strokeWeight(2);
  bt.noFill();
  bt.beginShape();
  for (let i = 0; i < hiTubeVertices.length; i++) {
    bt.vertex(hiTubeVertices[i][0], hiTubeVertices[i][1]);
  }
  bt.endShape();

  // hot out
  bt.beginShape();
  for (let i = 0; i < hoSingleVert.length; i++) {
    bt.vertex(hoSingleVert[i][0], hoSingleVert[i][1]);
  }
  bt.endShape();

  // cold in
  bt.beginShape(); // Wrong name, gets fixed later
  for (let i = 0; i < ciSingleVert.length; i++) {
    bt.vertex(ciSingleVert[i][0], ciSingleVert[i][1]);
  }
  bt.endShape();

  // cold out
  bt.beginShape(); // Actual cold out
  for (let i = 0; i < coSingleVert.length; i++) {
    bt.vertex(coSingleVert[i][0], coSingleVert[i][1]);
  }
  bt.endShape();

  return bt;
}

function createSingleBeakers(p: P5CanvasInstance) {
  let bt = p.createGraphics(p.width, p.height);
  let b = createBeakerGraphic(p);
  // beakers
  bt.image(b, 50, 450);
  bt.image(b, 580, 450);
  b.remove();
  return bt;
}

function createPinchingGraphic(p: P5CanvasInstance) {
  let pinch = p.createGraphics(15, 30);
  pinch.push();
  pinch.noStroke();
  // pinch.rect(419, 385, 12, 30);

  pinch.fill("white");
  pinch.triangle(0, 0, 0, 30, 4, 15);
  pinch.triangle(12, 0, 12, 30, 8, 15);

  pinch.stroke("black");
  pinch.strokeWeight(2);
  pinch.line(1, 0, 4, 15);
  pinch.line(1, 30, 4, 15);
  pinch.line(11, 0, 8, 15);
  pinch.line(11, 30, 8, 15);

  pinch.pop();
  return pinch;
}

export interface singleGraphicsObj {
  emptyTubes: any;
  beakers: any;
  tubes: any[];
  pinching: any;
}
export function createSingleGraphicsObjects(
  p: P5CanvasInstance
): singleGraphicsObj {
  // Create all single beaker graphics objects
  let g: singleGraphicsObj = {
    emptyTubes: createEmptySingleTubes(p),
    beakers: createSingleBeakers(p),
    tubes: [
      createTubeFluidGraphic(p, hiTubeVertices, ORANGE_FLUID_COLOR),
      createTubeFluidGraphic(p, hoSingleVert, ORANGE_FLUID_COLOR),
      createTubeFluidGraphic(p, coSingleVert, BLUE_FLUID_COLOR),
      createTubeFluidGraphic(p, ciSingleVert, BLUE_FLUID_COLOR),
    ],
    pinching: createPinchingGraphic(p),
  };

  // Fix output tubes liquid so it falls in beakers
  // ho
  g.tubes[1].push();
  g.tubes[1].noStroke();
  g.tubes[1].fill(ORANGE_FLUID_COLOR);
  g.tubes[1].rect(100, 400, 10, 70);
  g.tubes[1].pop();

  return g;
}

export default createGraphicsObjects;
