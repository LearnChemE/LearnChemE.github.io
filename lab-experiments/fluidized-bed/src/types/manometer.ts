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
    
            // Function to update the value at each frame
            const animate = (time: number) => {
                if (!prevTime) prevTime = time; // Initialize the first time
        
                // Calculate elapsed time
                const deltaTime = time - prevTime;
        
                // Calculate the interpolation factor t (from 0 to 1)
                var t = this.current; // Ensure t doesn't go beyond 1
        
                // Interpolate between start and end
                t = (t - this.target) * this.r ** deltaTime + this.target;
                this.current = t;
        
                // Call the update callback with the interpolated value
                this.update(t);
        
                // If not at the end, continue the animation
                if (t !== this.target) {
                    requestAnimationFrame(animate);
                }
                // If at the end, give the return callback
                else this.running = false;
            }
        }
    
        // Start the animation
        requestAnimationFrame(frame);
    }
}

export class Manometer {
    private inTube: VaryingTube;
    private outTube: VaryingTube;
    // Keeping track of water heights
    private baseElement: HTMLElement;
    private base: number;

    constructor() {
        this.inTube  = new VaryingTube( "Tube_6", TubeDirection.Left, 3); // 6 for left
        this.outTube = new VaryingTube("Tube_15", TubeDirection.Left, 3); // 14 for right

        this.baseElement = document.getElementById("");
        this.base = 0;
    }

    /**
     * Fill the manometer according to the current parameters
     * @param base 
     * @param pump 
     * @param dif 
     * @returns void promise
     */
    public fillTubes = async (pump: number = 0, dif: number = 0) => {
        // Set privates
        // this.baseLevel = base;
        // this.pump = pump;
        // this.pressureDif = dif;

        this.inTube.setTarget(this.base + pump);
        // this.inFill = target;
        return;
    }
}