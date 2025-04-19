import { smoothLerp } from "../js/helpers";
import { vec2 } from "./globals";

export enum TubeDirection {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
}

export class StraightTube {
    private element: HTMLElement;
    private dir: TubeDirection;
    private coord: vec2;
    private dim: vec2;

    constructor(id: string, dir: TubeDirection) {
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
        this.dir = dir;
        this.coord = vec2(x, y);
        this.dim = vec2(w, h);
    }

    /**
     * Update rendering
     * @param t Linear interpolant
     */
    private update = (t: number) => {
        let dir = this.dir;
        let coord = this.coord;
        let dim = this.dim;
        let e = this.element;

        // Conditionally set variables based on direction
        switch(dir) {
            case TubeDirection.Left:
                console.log(coord.x, dim.x)
                e.setAttribute("x", `${coord.x + dim.x * (1 - t)}`);
                e.setAttribute("width", `${dim.x * t}`);
                break;
            case TubeDirection.Right:
                e.setAttribute("width", `${dim.x * t}`);
                break;
            case TubeDirection.Up:
                e.setAttribute("y", `${coord.y + dim.y * (1 - t)}`);
                e.setAttribute("height", `${dim.y * t}`);
                break;
            case TubeDirection.Down:
                e.setAttribute("height", `${dim.y * t}`);
                break;
        }
    }

    /**
     * Begin fill animation
     * @param duration Duration of animation
     * @returns Promise<void> - Resolves with animation end
     */
    public async fill(duration: number) {
        return smoothLerp(duration, (t) => {this.update(t)});
    }
}

export class BentTube {
    private element: HTMLElement;
    private dir: TubeDirection;
    private coord: vec2;
    private dim: vec2;

    constructor(id: string) {
        // Get the element
        let e: HTMLElement = document.getElementById(id);
        // Get coordinates
        console.log(e.getBoundingClientRect());

        // let x: number = Number(e.getAttribute("x"));
        // let y: number = Number(e.getAttribute("y"));
        // // Get dimensions
        // let w: number = Number(e.getAttribute("width"));
        // let h: number = Number(e.getAttribute("height"));

        // // Set privates
        this.element = e;
        // this.dir = dir;
        // this.coord = vec2(x, y);
        // this.dim = vec2(w, h);
    }
}