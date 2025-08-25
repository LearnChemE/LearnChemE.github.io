import { svgNS, type DigitalLabelDescriptor, type LabelRange } from "../../types";

export class DigitalLabel {
    private label: SVGTextElement;
    private units: string;
    private decimals: number;
    private range: LabelRange | undefined;

    constructor(descriptor: DigitalLabelDescriptor) {
        const g = document.getElementById(descriptor.gid)!;

        const screen = document.getElementById(descriptor.centerId)!;
        const cx = Number(screen.getAttribute("x")!) + Number(screen.getAttribute("width")!) / 2;
        const cy = Number(screen.getAttribute("y")!) + Number(screen.getAttribute("height")!) / 2;

        // Create label
        const label = document.createElementNS(svgNS, "text")!;
        label.id = descriptor.id;
        label.classList.add("digital-label");
        label.classList.add("bitcount-grid-single-display");
        label.innerHTML = `${descriptor.initialValue.toFixed(descriptor.decimals)} ${descriptor.units}`;
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("x", `${cx}`);
        label.setAttribute("y", `${cy + 2}`);
        label.setAttribute("position", "absolute");
        label.setAttribute("fontSize", "12");
        label.setAttribute("fill", descriptor.fill);

        // Append to group
        g.appendChild(label);

        // Set privates
        this.label = label;
        this.units = descriptor.units;
        this.decimals = descriptor.decimals;
        this.range = descriptor.range;
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