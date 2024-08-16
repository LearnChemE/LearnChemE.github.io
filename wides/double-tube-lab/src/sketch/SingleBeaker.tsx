import { g } from "./Sketch";
import Graphics from "./Graphics";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { singleBeakerGraphics } from "./Graphics";

export function SingleBeakerSketch(p: P5CanvasInstance) {
  let dt: any;
  let dtb: any;
  let dto: any;
  let singleBeakers: any;
  let pa: any;

  p.setup = () => {
    p.createCanvas(g.width, g.height);

    dt = Graphics.doubleTubeGraphic(500, 400, p);
    dtb = Graphics.doubleTubeBlue(500, 400, 50, 450, 50, p);
    dto = Graphics.doubleTubeOrng(500, 400, 50, 450, 50, p);
    singleBeakers = singleBeakerGraphics(p);
    pa = Graphics.pumpAssembly(p);
  };

  p.draw = () => {
    p.background(250);

    p.image(pa, 400, 450);
    p.image(pa, 600, 450);

    Graphics.fillBeaker(290, 1000, g.blueFluidColor, p);
    Graphics.fillBeaker(450, 1000, g.orangeFluidColor, p);
    fillSingleInletTubes(p);

    p.image(singleBeakers, 0, 0);
    p.image(dt, 25, 25);
  };
}

export function fillSingleInletTubes(p: P5CanvasInstance) {
  p.push();
  p.noStroke();
  p.fill(g.orangeFluidColor);
  p.rect(620, 117, 10, 330);
  p.rect(470, 117, 150, 10);
  p.rect(617, 450, 15, 120);
  p.pop();
}
