import { State } from "../main";
import p5 from "p5";
import { FluidType, PlayState, type CalculatedValues, type col4 } from "../types";
import { calculations } from "./calcs";

type col3 = [number, number, number];
const SteamColor: col3 = [180,180,255];
const WaterColor: col3 = [0,100,255];

const sketch = async (p: p5) => {
    var piping: p5.Image;
    var valve: p5.Image;
    var font: p5.Font;
    var renderer: WebGL2RenderingContext;
    var startTime: number = -1;

    p.setup = async () => {
        State.canvas = p.createCanvas(800, 520, p.WEBGL);
        State.canvas.parent("#graphics-wrapper");
        p.angleMode(p.DEGREES);
        p.frameRate(24);
        // Load images and font
        piping = await p.loadImage("Piping.png");
        valve = await p.loadImage("Valve.png");
        font = await p.loadFont("Light.ttf");
        p.textFont(font);
        // Change some WebGL settings
        renderer = (p as any)._renderer.GL;
        renderer.enable(renderer.CULL_FACE);
        renderer.frontFace(renderer.CW);
    }

    p.draw = () => {
        // Get the current interpolant
        const t = animationTime();
        // Run calculations
        const results = calculations(t);

        // Begin render pass
        p.background(250);
        p.translate(80, 0, 0);
        // Ortho perspective
        p.ortho();
        p.ambientLight(100,100,100);
        p.directionalLight(200, 200, 200, -1,1,-1);

        var type = State.fluidType;

        // Draw the tank
        tank(type, results.tankComposition, results.tankPressure / 15);

        // Draw fill
        fillPipes(type, State.linePressure / 15, results.tankPressure / 15);
        // Draw piping and valve
        pipingAndValve(t);

        // Draw labels
        labels(type, results, t);
    }

    /**
     * Determine the current animation interpolant based on when State.playState was set to "Played"
     * @returns Interpolant between 0 and 1
     */
    const animationTime = (): number => {
        let playState = State.playState;
        // Determine whether the animation was played
        if (playState === PlayState.NOT_PLAYED) { // Animation not played
            // If the animation was previously played, reset the counter
            startTime = -1;
            // Return 0 for interpolant
            return 0;
        }
        else if (startTime === -1) { // Animation just played
            // Start the animation next frame
            startTime = p.millis();
            return 0;
        }
        else { // Animation is playing/played
            let time = p.millis() - startTime;
            return Math.min(time / 5000, 1);
        }
    }

    /**
     * 
     * @param type 
     * @param composition 
     */
    const tank = (type: FluidType, composition: number, pressure: number) => {
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
            p.fill(...WaterColor, 245);
            p.translate(0, 225 - waterHeight / 2, 0,);
            p.cylinder(100, waterHeight, 24, 1, true, false);
            p.pop();

            // Steam
            let steamHeight = (1 - composition) * totalHeight;
            p.push();
            p.fill(...SteamColor, 200 * pressure);
            p.translate(0, 85 + steamHeight / 2, 0,);
            p.cylinder(100, steamHeight, 24, 1, true, false);
            p.pop();
        }
        // Ideal Gas
        else {
            p.push();
            p.fill(10,255, 50, pressure * 200 + 20);
            p.translate(0, 85 + totalHeight / 2, 0,);
            p.cylinder(100, totalHeight, 24, 1, true, false);
            p.pop();
        }

        p.pop();
    };

    /**
     * Fill the pipes with the proper fluid at proper pressures
     * @param type FluidType from State
     * @param topPressure Pressure in top line from State
     * @param bottomPressure Resulting pressure in tank
     */
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
        p.rect(0, -31, 29, 40);
        p.rect(-24, 9, 50, 65);
        p.pop();
    }

    /**
     * Draw the valve and piping. Should be called last.
     * @param t Interpolant for valve
     */
    const pipingAndValve = (t: number) => {
        // Draw the piping
        p.push();
        p.translate(-335,-180);
        // p.scale(1.6);
        p.image(piping, 0, 0);
        p.pop();

        // Draw the valve
        p.push();
        let offset = 1 - (2 * t - 1) ** 6;
        p.translate(-205 + 20 * offset, -38, 0);
        p.scale(1);
        p.image(valve, 200,0);
        p.pop();
    }

    /**
     * Add the appropriate labels
     * @param type 
     * @param results 
     */
    const labels = (type: FluidType, results: CalculatedValues, t: number): void => {
        p.push();
        p.textSize(24);
        // Top left pipe
        p.text(`P : ${State.linePressure.toFixed(1)} bar`, -465, -160);
        p.text(`T : ${State.lineTemperature} °C`, -460, -130);

        // Subscripts
        p.textSize(12);
        // Top left pipe
        p.text(`2`, -451, -160);
        p.text(`2`, -447, -130);

        if (type === FluidType.WATER) {
            p.textSize(24);
            // Left of tank
            p.text(`P : ${results.tankPressure.toFixed(1)} bar`, -260, 140);
            p.text(`T : ${results.tankTemperature.toFixed(1)} °C`, -260, 170);

            // Tank label
            const comp = results.tankComposition * 100;
            renderer.disable(renderer.DEPTH_TEST);
            let waterHeight = comp * 1.4;
            p.text(`${comp.toFixed(1)}% Liquid`, -60, 240 - waterHeight / 2);

            // Only show vapour % if there is enough
            if (comp <= 80) {
                let steamHeight = (100 - comp) * 1.4;
                p.text(`${(100 - comp).toFixed(1)}% Vapor`, -60, 110 + steamHeight / 2);
            }
            renderer.enable(renderer.DEPTH_TEST);

            // Subscripts
            p.textSize(12);
            // Top left pipe
            p.text('1', -246, 140);
            p.text('1', -247, 170);
        }
        else {
            p.textSize(24);
            // Tank labels
            renderer.disable(renderer.DEPTH_TEST);
            p.text(`P : ${results.tankPressure.toFixed(1)} bar`, -57, 150);
            p.text(`T : ${results.tankTemperature.toFixed(1)} °C`, -60, 190);
            //Subscripts
            p.textSize(12);
            p.text('1', -43, 150);
            p.text('1', -47, 190);
            renderer.enable(renderer.DEPTH_TEST);
        }

        // Pressure Equilibriated
        if (t >= 1) {
            p.textSize(24);
            p.text("pressure equalized", -110, -143);
        }
        p.pop();
    }
}

// Make the sketch
new p5(sketch);