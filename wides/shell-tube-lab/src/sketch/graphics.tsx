import { P5CanvasInstance } from "@p5-wrapper/react";

const ORANGE_FLUID_COLOR = [255, 50, 0, 200];
const BLUE_FLUID_COLOR = [0, 80, 255, 180];

// bt.image(b, 50, 450);
// bt.image(b, 230, 450);
// bt.image(b, 410, 450);
// bt.image(b, 590, 450);

// prettier-ignore
const shellTubeBlueVertices = [[60, 5],[110, 5],[110, 230],[115, 230],[115, 5],[220, 5],[220, 230],[225, 230],[225, 5],[330, 5],[330, 230],[335, 230],[335, 5],[440, 5],[440, 295],[390, 295],[390, 70],[385, 70],[385, 295],[280, 295],[280, 70],[275, 70],[275, 295],[170, 295],[170, 70],[165, 70],[165, 295],[60, 295],[60, 5],];
// prettier-ignore
const hiTubeVertices = [[80, 430],[80, 405],[35, 405],[35, 35],[100, 35],[100, 75],[110, 75],[110, 25],[25, 25],[25, 415],[70, 415],[70, 430],];
// prettier-ignore
const hoTubeVertices = [[260, 620],[260, 400],[100, 400],[100, 375],[110, 375],[110, 390],[270, 390],[270, 620],];
// prettier-ignore
const ciTubeVertices = [[440, 430],[440, 375],[440, 75],[440, 35],[165, 35],[165, 75],[155, 75],[155, 25],[450, 25],[450, 75],[450, 375],[450, 430],];
// prettier-ignore
const coTubeVertices = [[620, 620],[620, 400],[485, 400],[485, 375],[495, 375],[495, 390],[630, 390],[630, 620],];

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

function createBeakersAndTubesGraphic(p: P5CanvasInstance) {
  let bt = p.createGraphics(p.width, p.height);
  let b = createBeakerGraphic(p);

  // beakers
  bt.image(b, 50, 450);
  bt.image(b, 230, 450);
  bt.image(b, 410, 450);
  bt.image(b, 590, 450);

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

  b.remove();
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

export interface graphicsObjects {
  shellTube: any;
  orngShellTube: any;
  blueShellTube: any;
  beakersAndTubes: any;
  tubes: any[];
  valve: any;
  pumpAssembly: any;
}
export default function createGraphicsObjects(
  p: P5CanvasInstance
): graphicsObjects {
  let g = {
    shellTube: createShellTubeGraphic(p),
    orngShellTube: createOrngShellTubeGraphic(p),
    blueShellTube: createBlueShellTubeGraphic(p),
    beakersAndTubes: createBeakersAndTubesGraphic(p),
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
