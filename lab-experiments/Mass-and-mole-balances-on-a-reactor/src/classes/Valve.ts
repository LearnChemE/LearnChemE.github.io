import { constrain, findAngleFromDown, vec2 } from "../ts/helpers";

export class BallValve {
    private handle: SVGGElement;
    private state = false;
    private onTurn: ((state:boolean) => void) | undefined;
    private angle = 0;
    private turnAngle = 90;
    private coords: { x: number, y: number };

    constructor(id: string, reverse=false, onTurn?: (state: boolean) => void, offset?: vec2) {
        const handle = document.getElementById(id)! as unknown as SVGGElement;
        handle.classList.add("svg-valve");
        handle.addEventListener("click", this.toggleState);
        this.handle = handle;
        this.onTurn = onTurn;

        const bbox = handle.getBBox();
        const dx = (offset !== undefined) ? offset.x : 0;
        console.log(offset)
        const dy = (offset !== undefined) ? offset.y : 0;
        this.coords = { x: bbox.x + bbox.width * .5 + dx , y: bbox.y + bbox.height / 2 + dy };
        if (reverse) this.turnAngle = -90;

        // Set initial transform
        this.handle.setAttribute("transform", `rotate(${0} ${this.coords.x} ${this.coords.y})`);
    }

    public getState = () => {return this.state}
    private toggleState = () => {
        this.state = !this.state;
        this.onTurn?.(this.state);
        this.animate();
    }

    private animate = () => {

        let prevtime: number | null = null;
        const r = Math.exp(-1/100);

        const frame = (time: number) => {
            // Get time
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime!;
            prevtime = time;

            // Find target angle
            const target = this.state ? this.turnAngle : 0;
            const angle = this.angle;
            // Lerp towards target
            const newAngle = (angle - target) * r ** deltaTime + target;

            // Set transform
            this.handle.setAttribute("transform", `rotate(${newAngle} ${this.coords.x} ${this.coords.y})`);
            this.angle = newAngle;

            // Request next frame
            if (Math.abs(newAngle - target) < 0.1) this.angle = target;
            else requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }
}


/**
 * Initialize the dial to turn with user input and return its corresponding lift to a callback.
 * @param id ID of the parent dial element
 * @param callback Callback to set state lift variable
 */
export function initDial(id: string, callback?: (lift: number) => void) {
    // Get the element
    const e = document.getElementById(id)! as unknown as SVGAElement;
    e.classList.add("svg-dial");
    // Find the proper offset
    const bbox = e.getBBox();
    const center = vec2(
        bbox.x + bbox.width / 2,
        bbox.y + bbox.height / 2
    );

    var angle = 0;

    e.addEventListener("mousedown", ({ clientX, clientY }) => {
        // Center for mouse-related things are relative to the window, and can change with resizing
        const bbox = e.getBoundingClientRect();
        const mozCenter = vec2(
            bbox.x + bbox.width / 2,
            bbox.y + bbox.height / 2
        );

        // Get initial angle
        let th0 = findAngleFromDown(mozCenter, vec2(clientX, clientY));

        // Drag function
        const drag = ({ clientX, clientY }: MouseEvent) => {
            // Find angle from centroid to mouse
            let th = findAngleFromDown(mozCenter,vec2(clientX,clientY));
            // Find difference and reset th
            let dth = th - th0;
            if (th * th0 < 0) { // Signs aren't the same
                // Set new th0 and return
                th0 = th;
                return;
            }
            th0 = th;

            // Set angle
            angle += dth;
            angle = constrain(angle, 0, 270);
            e.setAttribute("transform", `rotate(${angle} ${center.x} ${center.y})`);

            // Set callback
            callback?.(angle / 270);
        };

        // Release function
        const release = () => {
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("mouseup", release);
        };

        // Add the event listeners for drag + release
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", release);
    });
}
