import { refractLabelDescriptor } from "../config";
import { animate, smoothLerp } from "../helpers";
import { DigitalLabel } from "./Label";

export class Refractometer {
    private group;
    private rPipette;
    private bPipette;
    private screen;
    private playing = false;
    private onMeasure;

    constructor(onMeasure: () => number) {
        // Get elements
        this.group = document.getElementById("refract")!;
        this.rPipette = document.getElementById("pipette_rfm")!;
        this.bPipette = document.getElementById("pipette_bucket")!;
        this.onMeasure = onMeasure;
        this.screen = new DigitalLabel(refractLabelDescriptor);
        if (!this.group || !this.rPipette || !this.bPipette || !this.screen) throw new Error(`${this.group}, ${this.rPipette}, ${this.bPipette}`);
        // Give styles
        this.group.classList.add("svg-valve");
        this.group.addEventListener("click", this.play);
        this.bPipette.classList.add("svg-valve");
        this.bPipette.addEventListener("click", this.play);
        this.rPipette.classList.add("hidden");

    }

    private play = () => {
        if (this.playing) return;
        this.playing = true;
        this.rPipette.classList.add("hidden");
        this.bPipette.classList.remove("hidden");

        let th = 0;
        let stage = 0;
        let timer = 0;
        animate((dt) => {

            switch(stage) {
                case 0:
                    var targTh = -7;
                    th = smoothLerp(th, targTh, Math.exp(-4), dt);
                    console.log(th)
                    if (Math.abs(th - targTh) < .1) stage++;
                    break;
                case 1:
                    var targTh = 0;
                    th = smoothLerp(th, targTh, Math.exp(-6), dt);
                    if (Math.abs(th - targTh) < .1) {
                        this.bPipette.classList.add("hidden");
                        this.rPipette.classList.remove("hidden");
                        stage++;
                    }
                    break;
                case 2:
                    var targTh = 30.4;
                    th = smoothLerp(th, targTh, Math.exp(-6), dt);
                    if (Math.abs(th - targTh) < .01) stage++;
                    break;
                case 3:
                    this.screen.setLabel(this.onMeasure());
                    stage++;
                    break;
                case 4:
                    timer += dt;
                    if (timer > 0.5) stage++;
                    break;
                case 5:
                    var targTh = 0;
                    th = smoothLerp(th, targTh, Math.exp(-4), dt);
                    if (Math.abs(th - targTh) < .1) this.playing = false;
                    break;
            }

            this.bPipette.setAttribute("transform", `rotate(${th}, 650, 300)`);
            this.rPipette.setAttribute("transform", `rotate(${th}, 560, 400)`);

            return this.playing;
        });
    }
}
