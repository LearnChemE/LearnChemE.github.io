import { svgNS, type AnalogLabelDescriptor, type DigitalLabelDescriptor, type Label, type LabelRange } from "../../types";

export class DigitalLabel implements Label {
    private label: SVGTextElement;
    private units: string;
    private decimals: number;
    private range: LabelRange | undefined;

    public id;

    constructor(descriptor: DigitalLabelDescriptor) {
        let g = document.getElementById(descriptor.gid)!;

        let screen = document.getElementById(descriptor.centerId)!;
        if (screen.tagName === "g") screen = screen.children[0] as HTMLElement;
        const cx = Number(screen.getAttribute("x")!) + Number(screen.getAttribute("width")!) / 2;
        const cy = Number(screen.getAttribute("y")!) + Number(screen.getAttribute("height")!) / 2;

        // Create label
        const label = document.createElementNS(svgNS, "text")!;
        label.id = descriptor.id;
        label.classList.add("digital-label");
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("x", `${cx}`);
        label.setAttribute("y", `${cy}`);
        label.setAttribute("position", "absolute");
        label.setAttribute("font-size", "11");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("fill", descriptor.fill);

        // Append to group
        g.appendChild(label);

        // Set privates
        this.label = label;
        this.units = descriptor.units;
        this.decimals = descriptor.decimals;
        this.range = descriptor.range;
        this.id = descriptor.id;

        // Initialize label
        this.setLabel(descriptor.initialValue);
    }

    /**
     * Set the digital label to a certain value
     * @param val value to set to
     */
    public setLabel(val: number) {
        this.label.innerHTML = `${val.toFixed(this.decimals)} ${this.units}`;
        if (this.range !== undefined) {
            this.checkOverflow(val);
        }
    }

    /**
     * Ensure that a value lies inside the range, and display the proper string if not
     * @param val value to set to
     */
    private checkOverflow(val: number) {
        const r = this.range!;
        if (val < r.range[0]) {
            this.label.innerHTML = r.underflowString;
        }
        else if (val > r.range[1]) {
            this.label.innerHTML = r.overflowString;
        }
    }
}

export class AnalogLabel implements Label {
    private text: SVGTextElement;
    private box: SVGRectElement;
    private units: string;
    private decimals: number;
    private opacity: number = 0;
    private target: number = 0;
    private playing: boolean = false;

    constructor(descriptor: AnalogLabelDescriptor) {
        const svg = document.querySelector<SVGSVGElement>("svg")!;
        console.log(svg)
        const g = document.createElementNS(svgNS, "g");

        const align = document.getElementById(descriptor.centerId)! as unknown as SVGGElement;
        const bbox = align.getBBox();
        const width = 60;
        const height = 20;
        const x = bbox.x + bbox.width / 2 - width / 2;
        const y = (descriptor.flipToBottom) ? bbox.y + bbox.height + 1 : bbox.y - height - 3;

        // Create label and box
        const box = document.createElementNS(svgNS, "rect")!;
        const text = document.createElementNS(svgNS, "text")!;

        // Box config
        box.setAttribute("x", `${x}`);
        box.setAttribute("y", `${y}`);
        box.setAttribute("width", `${width}`);
        box.setAttribute("height", `${height}`);
        box.setAttribute("fill", "black");
        box.setAttribute("opacity", "0.85");
        box.setAttribute("rx", "4");
        box.setAttribute("ry", "4");
        box.setAttribute("transition", "opacity 200ms");

        // Label config
        text.id = descriptor.id;
        // text.classList.add("tooltip-text");
        text.setAttribute("x", `${x + width / 2}`);
        text.setAttribute("y", `${y + height / 2 + 1}`);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("text-anchor", "middle");
        text.innerHTML = `${descriptor.initialValue.toFixed(descriptor.decimals)} ${descriptor.units}`;
        text.setAttribute("font-size", "10");
        text.setAttribute("transition", "opacity 200ms");

        // Append to group
        g.appendChild(box);
        g.appendChild(text);
        svg.appendChild(g);

        // Add event listeners to show/hide
        align.addEventListener("mouseover", () => this.show());
        align.addEventListener("mouseleave", () => this.hide());

        // Set privates
        this.text = text;
        this.box = box;
        this.units = descriptor.units;
        this.decimals = descriptor.decimals;
        this.hide();
    }

    public setLabel = (val: number) => {
        this.text.innerHTML = `${val.toFixed(this.decimals)} ${this.units}`;
    }

    public show = () => {
        this.target = 1;
        this.animate();
    }

    public hide = () => {
        this.target = 0;
        this.animate();
    }

    private animate = () => {
        if (this.playing) return;
        this.playing = true;

        let prevtime: number | null = null;
        const r = Math.exp(-1/50);

        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime;
            prevtime = time;

            this.opacity = (this.opacity - this.target) * r ** deltaTime + this.target;
            if (Math.abs(this.opacity - this.target) < 0.001) this.opacity = this.target;
            this.box.setAttribute("opacity", `${this.opacity * .85}`);
            this.text.setAttribute("opacity", `${this.opacity}`);

            if (this.opacity !== this.target) requestAnimationFrame(frame);
            else (this.playing = false);
        }

        requestAnimationFrame(frame);
    }
}