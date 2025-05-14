import { smoothLerp } from "../js/helpers";
import { BendDirection, PointsList } from "./bend-direction";
import { vec2 } from "./globals";

/**
 * Direction enumerants for straight tube pieces.
 */
export enum TubeDirection {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
}

/**
 * Base class for animated tubes.
 */
export interface Tube {
    fill : (t: number) => Promise<void>;
    empty: (t: number) => Promise<void>;
}

/**
 * Class for managing groups of tubes. 
 * Fill and empty methods do not take interpolant but rather play each nested duration sequentially
 */
export class TubeGroup implements Tube {
    private tubeMap: Map<Tube, number>;

    constructor(tubeData: Array<[Tube, number]>) {
        this.tubeMap = new Map(tubeData);
    }

    public async fill() {
        for (const [tube, duration] of this.tubeMap) {
            await tube.fill(duration);
        }
    }

    public async empty() {
        for (const [tube, duration] of this.tubeMap) {
            await tube.empty(duration);
        }
    }
}

/**
 * Straight tube. Works by managing a <rect/> element in the DOM.
 * As such, rotated elements will need different directions
 */
export class StraightTube implements Tube {
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
    public async fill(duration: number) {
        return smoothLerp(duration, (t) => {this.update(t)});
    }

    /**
     * Begin empty animation
     * @param duration Duration of animation
     * @returns Promise<void> - Resolves with animation end
     */
    public async empty(duration: number) {
        return smoothLerp(duration, (t) => {this.update(t)}, -1, 0);
    }
}

/**
 * Tube bends work by adding clip paths to existing 90 degree bends.
 * As such, external transformations don't affect direction.
 */
export class BentTube implements Tube {
    private element: SVGGraphicsElement;
    private dir: TubeDirection;
    private coord: vec2;
    private dim: vec2;
    private clipPath: SVGClipPathElement;
    private points: PointsList;

    constructor(id: string, direction: BendDirection) {
        // Get the element
        let e = (document.getElementById(id) as unknown) as SVGGraphicsElement;
        // Get bounding box
        let bbox = e.getBBox();

        // Set privates
        this.element = e;
        // this.dir = dir;
        this.coord = vec2(bbox.x, bbox.y);
        this.dim = vec2(bbox.width, bbox.height);

        // Generate points
        this.points = new PointsList(bbox, direction);

        // Insert the clip path div
        this.clipPath = this.insertClipPath(id);
    }

    // private

    /**
     * Insert a new clip path to the child of the corresponding element.
     * @param id Id to name the new elements from
     * @returns Clippath inserted by function
     */
    private insertClipPath = (id: string) => {
        id = id.replace(" ","");
        // Take the element
        const e = this.element;
        // Get the parent element
        const parent = e.parentElement;
        const defs = checkForDefs(parent);
        // Create a clip path div
        const clippath = document.createElementNS("http://www.w3.org/2000/svg","clipPath");
        clippath.setAttribute("id", id + "-clip");

        // Create Triangle for clip path
        clippath.innerHTML = this.points.toHTML(0);

        // Insert the new clip path
        parent.appendChild(defs);
        defs.appendChild(clippath);
        // Apply the clip path styling
        var child = e.childNodes[0] as unknown as SVGAElement;
        if (child === undefined)
            child = e as unknown as SVGAElement;
        child.setAttribute("clip-path",`url(#${id + "-clip"})`);

        // Return the polygon element
        return clippath;
    }

    /**
     * Update rendering
     * @param t Linear interpolant
     */
    private update = (t: number) => {
        this.clipPath.innerHTML = this.points.toHTML(t);
    }

    /**
     * Begin fill animation
     * @param duration Duration of animation
     * @returns Promise<void> - Resolves with animation end
     */
    public async fill(duration: number) {
        return smoothLerp(duration, (t) => {this.update(t)});
    }

    /**
     * Begin empty animation
     * @param duration Duration of animation
     * @returns Promise<void> - Resolves with animation end
     */
    public async empty(duration: number) {
        return smoothLerp(duration, (t) => {this.update(t)}, -1, 0);
    }
}

/**
 * Check an element for a child defs element. If none are found, append a new defs element.
 * @param parent Node to be searched for defs children. Note if none are found, a new defs element will be inserted to this node.
 * @returns Reference to new defs element.
 */
const checkForDefs = (parent: HTMLElement): SVGDefsElement => {
    // Start with null defs
    let defs: SVGDefsElement = null;

    // Search each child node for a defs element
    parent.childNodes.forEach((value, key, parent) => {
        if (value.nodeName === "defs")
            defs = value as unknown as SVGDefsElement;
    });

    // If defs were not found, append a new defs element to parent
    if (defs === null) {
        defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
        parent.appendChild(defs);
    }
    // Return the defs element
    return defs;
}