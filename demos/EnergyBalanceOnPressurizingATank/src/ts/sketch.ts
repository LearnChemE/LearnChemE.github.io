import { State } from "../main";
import p5 from "p5";
import { FluidType, type col4 } from "../types";

const sketch = async (p: p5) => {
    var piping: p5.Image;
    var valve: p5.Image;
    var renderer: WebGL2RenderingContext;

    p.setup = async () => {
        State.canvas = p.createCanvas(800, 520, p.WEBGL);
        State.canvas.parent("#graphics-wrapper");
        p.angleMode(p.DEGREES);
        // Load images
        piping = await p.loadImage("Piping.png");
        valve = await p.loadImage("Valve.png");
        console.log(p)
        renderer = (p as any)._renderer.GL;
        renderer.enable(renderer.CULL_FACE);
        renderer.frontFace(renderer.CW);
    }

    p.draw = () => {
        p.background(240);
        // Ortho perspective
        p.ortho();
        p.ambientLight(100,100,100);
        p.directionalLight(200, 200, 200, -1,1,-1);

        var type = State.fluidType;

        // Draw the tank
        tank(type, 1);

        // Draw fill
        fillPipes(type, 1, 1);
        // Draw piping and valve
        pipingAndValve();
    }

    /**
     * 
     * @param type 
     * @param composition 
     */
    const tank = (type: FluidType, composition: number) => {
        // Note: bottom of top cylinder at y=85. Top of bottom at y=225.
        // Thus, total height is 140.
        const totalHeight = 140;

        // Settings
        p.push();
        p.noStroke();
        p.rotate(-10, p.createVector(1, 0, 0));
        p.fill(100);

        // Top
        p.push();
        p.translate(0, 80, 0);
        p.cylinder(100, 10, 24, 1, true, false);
        p.pop();

        // Bottom
        p.push();
        p.translate(0, 230, 0);
        p.cylinder(100, 10, 24, 1, true, false)
        p.pop();

        // Water/Steam
        if (type === FluidType.WATER) {
            // Water
            let waterHeight = composition * totalHeight;
            p.push();
            p.fill(0,100,255,200);
            p.translate(0, 225 - waterHeight / 2, 0,);
            p.cylinder(100, waterHeight, 24, 1, true, false);
            p.pop();

            // Steam
            let steamHeight = (1 - composition) * totalHeight;
            p.push();
            p.fill(150,200,255,200);
            p.translate(0, 85 + steamHeight / 2, 0,);
            p.cylinder(100, steamHeight, 24, 1, true, false);
            p.pop();
        }
        // Ideal Gas
        else {
            p.push();
            p.fill(10,255, 50, composition * 220);
            p.translate(0, 85 + totalHeight / 2, 0,);
            p.cylinder(100, totalHeight, 24, 1, true, false);
            p.pop();
        }

        p.pop();
    };

    const fillPipes = (type: FluidType, topPressure: number, bottomPressure: number) => {
        var topFill: col4;
        var bottomFill: col4;

        p.push();
        p.noStroke();
        // Color for the valves
        if (type === FluidType.IDEAL_GAS) {
            topFill = [10, 255, 50, topPressure * 220];
            bottomFill = [10, 255, 50, bottomPressure * 220];
        }
        else {
            topFill = [150,200,255, topPressure * 220];
            bottomFill = [150,200,255, bottomPressure * 220];
        }
        // Fill for top valves
        p.fill(...topFill);
        p.rect(-335, -175, 600, 40);
        p.rect(-20, -135, 42, 100);
        p.rect(-25, -35, 25, 40);

        // Fill for bottom valves
        p.fill(...bottomFill);
        p.rect(4, -31, 25, 40);
        p.rect(-24, 9, 50, 65);
        p.pop();
    }

    /**
     * Draw the valve and piping. Should be called last.
     */
    const pipingAndValve = () => {
        // Draw the piping
        p.push();
        p.translate(-335,-180);
        p.scale(1.6);
        p.image(piping, 0, 0);
        p.pop();

        // Draw the valve
        p.push();
        p.translate(-205, -38, 0);
        p.scale(2);
        p.image(valve, 100,0);
        p.pop();
    }
}

// Make the sketch
new p5(sketch);