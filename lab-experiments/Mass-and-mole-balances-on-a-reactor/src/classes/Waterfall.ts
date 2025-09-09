import { svgNS, insertClipPath, GetElement } from "../ts/helpers";
import { Signal } from "./Signal";

export class Waterfall {
    private clip: SVGClipPathElement;
    private current: SVGRectElement | null = null;
    private fallen: Array<SVGRectElement> = [];
    private playing: boolean = false;

    private x: number;
    private width: number;
    private y: number;
    private height: number;

    constructor(id: string, pourSignal?: Signal<number>) {
        const e = GetElement<SVGAElement>(id);
        const bbox = e.getBBox();
        const clipPath = insertClipPath(e, id, bbox);

        this.clip = clipPath;
        this.x = bbox.x - 4;
        this.y = bbox.y;
        this.width = bbox.width + 8;
        this.height = bbox.height;

        if (pourSignal) pourSignal.subscribe((flow: number) => {
            if (flow > 0) this.pour();
            else this.stop();
        });
    }

    /**
     * Create a stream at the top with 0 height and make it the current stream
     * @returns 
     */
    private addStream = () => {
        if (this.current !== null) return;

        const rect = document.createElementNS(svgNS, "rect") as unknown as SVGRectElement;
        rect.setAttribute("x", `${this.x}`);
        rect.setAttribute("y", `${this.y}`);
        rect.setAttribute("width", `${this.width}`);
        rect.setAttribute("height", `${0}`);
        this.clip.appendChild(rect);
        this.current = rect;
    }

    /**
     * Begin flowing
     */
    public pour = () => {
        this.addStream();
        this.animate();
    }

    /**
     * Stop the current stream from flowing
     */
    public stop = () => {
        if (this.current === null) return;

        // Stop the current stream
        this.fallen.push(this.current);
        this.current = null;

        this.animate();
    }

    /**
     * Animate all held streams
     */
    private animate = () => {
        if (this.playing) return;
        this.playing = true;

        const vel = 300;
        let prevtime: number | null = null;

        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const dt = (time - prevtime) / 1000;
            prevtime = time;

            const dy = vel * dt;

            // Increase the height of the current
            const current = this.current;
            if (current !== null) {
                const height = Number(current.getAttribute("height")!);
                current.setAttribute("height", `${Math.min(height + dy, this.height)}`);
            }

            // Increase the y of falling
            for (const drop of this.fallen) {
                const y = Number(drop.getAttribute("y")!) + dy;
                if (y > this.y + this.height) {
                    drop.remove();
                }
                else drop.setAttribute("y", `${y}`);
            }

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }
}