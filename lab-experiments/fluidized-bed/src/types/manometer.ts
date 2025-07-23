import { pressureDrop, pumpPressure } from "../js/calculations";
import { TubeDirection } from "./ani-types";
import { vec2 } from "./globals";

/**
 * Varying tube. Works by managing a <rect/> element in the DOM.
 * As such, rotated elements will need different directions.
 * Note: It does not implement Tube base class.
 */
class VaryingTube {
    private element: HTMLElement;
    private dir: TubeDirection;
    private coord: vec2;
    private dim: vec2;
    // For lerping
    private current: number = 0;
    private target: number = 0;
    private r: number;
    private running: boolean = false;

    constructor(id: string, dir: TubeDirection, tau: number) {
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
        // Precalculate coefficient
        this.r = Math.E**(-1/tau);

        // Hide by default
        this.update(0);
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

        // Account for emptying
        if (t < 0) {
            t = Math.abs(t);
            switch(dir) {
                case TubeDirection.Left:
                    dir = TubeDirection.Right;
                    break;
                case TubeDirection.Right:
                    dir = TubeDirection.Left;
                    break;
                case TubeDirection.Up:
                    dir = TubeDirection.Down;
                    break;
                case TubeDirection.Down:
                    dir = TubeDirection.Up;
                    break;
            }
        }
        this.current = t;

        // Conditionally set variables based on direction
        switch(dir) {
            case TubeDirection.Left:
                e.setAttribute("x", `${coord.x + dim.x * (1 - t)}`);
                e.setAttribute("width", `${dim.x * t}`);
                break;
            case TubeDirection.Right:
                e.setAttribute("x", `${coord.x}`);
                e.setAttribute("width", `${dim.x * t}`);
                break;
            case TubeDirection.Up:
                e.setAttribute("y", `${coord.y + dim.y * (1 - t)}`);
                e.setAttribute("height", `${dim.y * t}`);
                break;
            case TubeDirection.Down:
                e.setAttribute("y", `${coord.y}`);
                e.setAttribute("height", `${dim.y * t}`);
                break;
        }
    }

    /**
     * Begin fill animation
     * @param duration Duration of animation
     * @returns Promise<void> - Resolves with animation end
     */
    public setTarget = async (target: number) => {
        this.target = target;
        this.animate();
        return;
    }

    /**
     * Same as setTarget, but with a specified time delay
     * @param target New target pressure
     * @param timeDelay time before target is set
     * @returns Promise<void>
     */
    public setTargetTimeDelay = async (target: number, timeDelay: number) => {
        target = Math.max(target, 0.001);
        if (timeDelay > 0) setTimeout(() => {
            this.target = target;
            this.animate();
        }, timeDelay);
        else {
            this.target = target;
            this.animate();
        }
        return;
    }

    /**
     * Begin the animation if it is not running already.
     * @returns void promise
     */
    private animate = async () => {
        // Animation is already in progress
        if (this.running === true) return;

        // Start animation
        this.running = true;
        // Previous time for calculating deltaTime
        var prevTime: number | null = null;

        // Loop for each frame
        const frame = (time: number) => {
            if (!prevTime) prevTime = time; // Initialize the first time
    
            // Calculate elapsed time
            const deltaTime = time - prevTime;
            const MaxSpeed = 1e-5;
    
            // Calculate the interpolation factor t (from 0 to 1)
            var t = this.current; // Ensure t doesn't go beyond 1
    
            // Interpolate between start and end
            const exponential = (t - this.target) * this.r ** deltaTime + this.target;
            if (Math.abs(exponential - t) < MaxSpeed * deltaTime) t = exponential;
            else {
                t = t + MaxSpeed * deltaTime * Math.sign(this.target - t);
            }
            
            this.current = 1;
    
            // Call the update callback with the interpolated value
            this.update(t);
    
            // If not at the end, continue the animation
            if (t !== this.target) {
                requestAnimationFrame(frame);
            }
            // If at the end, give the return callback
            else this.running = false;
        }
    
        // Start the animation
        requestAnimationFrame(frame);
    }
}

export class Manometer {
    private inTube: VaryingTube;
    private outTube: VaryingTube;
    // Keeping track of water heights
    private baseElement: SVGAElement;
    // For converting to interpolant
    private bottom: number;
    private height: number;
    // Track whether it's been filled initially
    private initLeft: boolean = false;
    private initRight: boolean = false;

    constructor() {
        this.inTube  = new VaryingTube("Tube_6" , TubeDirection.Left, 5000); // 6 for left
        this.outTube = new VaryingTube("Tube_15", TubeDirection.Left, 5000); // 14 for right

        // Get the bounding box and use to find bottom and height of manometer tube section
        const rect = document.getElementById("Tube_16") as unknown as SVGAElement;
        const bounds = rect.getBBox();
        this.bottom = bounds.y + bounds.width;
        this.height = bounds.width;

        this.baseElement = document.getElementById("Beaker Fill") as unknown as SVGAElement;
    }

    /**
     * Fill the manometer according to the current parameters. If initialFill has not been called,
     * returns immediately.
     * @param base 
     * @param pump 
     * @param dif 
     * @returns void promise
     */
    public fillTubes = async (timeDelay: number) => {
        // If init hasn't been called, return
        if (this.initLeft === false) return;

        // Calculate height in pixels
        const base = this.baseElement.getBBox().y; // fill line of beaker
        // Add pump pressure. Sign should be negative because y pixels go down, and multiply by 5 pixels per cm water
        const pump = 2.45 * pumpPressure(); // pixels water
        const drop = 2.45 * pressureDrop(); // pixels water
        var left = base - pump;
        var right = left + drop;

        // Convert to 0-1 range for tube
        left = (this.bottom - left) / this.height;
        right = (this.bottom - right) / this.height;

        // Set the left tube only
        if (this.initLeft)  this.inTube.setTargetTimeDelay(left, timeDelay);
        if (this.initRight) this.outTube.setTargetTimeDelay(right, timeDelay);
        return;
    }

    public fillLeftOnly = async () => {
        // // Calculate height in pixels
        // const base = this.baseElement.getBBox().y;
        // // TODO: Add pump pressure
        // var level = base - 2.45 * pumpPressure();

        // // Convert to 0-1 range for tube
        // level = (this.bottom - level) / this.height;

        // // Set the left tube only
        // this.inTube.setTarget(level);
        this.initLeft = true;
        this.initRight = false;
        this.fillTubes(0);
        return;
    }
    /**
     * Call this function on the initial fill. Any calls to fillTubes will work after this.
     * @returns void promise
     */
    public initialFill = async () => {
        this.initLeft = true;
        this.initRight = true;
        this.fillTubes(0);
        return;
    }
}