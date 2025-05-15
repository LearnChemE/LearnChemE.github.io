import { State } from "../main";
import p5 from "p5";

const sketch = (p: p5) => {
    p.setup = () => {
        State.canvas = p.createCanvas(800, 520, p.WEBGL);
        State.canvas.parent("#graphics-wrapper");
        p.background(200);
        p.angleMode(p.DEGREES);
    }

    p.draw = () => {
        p.background(200);
        // p.perspective(1, p.width/p.height);
        p.ortho();

        p.push();
        p.translate(0, 100, 0);
        p.rotate(-10, p.createVector(1, 0, 0));
        p.normalMaterial();
        p.cylinder(100, 150, 30, 1, true, true);
        p.pop();
    }
}

new p5(sketch);