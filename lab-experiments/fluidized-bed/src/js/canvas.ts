import p5 from "p5";
import State from "./state";

new p5((p: p5) => {
  let x = 100;
  let y = 100;

  p.setup = () => {
    p.createCanvas(700, 410);
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
});