import { vec2 } from "./globals";

export class Beaker {
    private element: HTMLElement;
    private coord: vec2;
    private dim: vec2;
    // For lerping
    private volume: number;

    constructor(id: string, initialVolume: number) {
        // Get the element
        let e: HTMLElement = document.getElementById(id);
        // Get coordinates
        let x: number = Number(e.getAttribute("x"));
        let y: number = Number(e.getAttribute("y"));
        // Get dimensions
        let w: number = Number(e.getAttribute("width"));
        let h: number = Number(e.getAttribute("height"));

        // Set privates
        this.element = e;
        this.coord = vec2(x, y);
        this.dim = vec2(w, h);

        // Set initial fill
        this.update(initialVolume);
    }

    /**
     * Update rendering
     * @param t Linear interpolant
     */
    private update = (vol: number) => {
        let coord = this.coord;
        let dim = this.dim;
        let e = this.element;

        this.volume = vol
        vol /= 1000;

        // Change the attributes
        e.setAttribute("y", `${coord.y + dim.y * (1 - vol)}`);
        e.setAttribute("height", `${dim.y * vol}`);
    }
}