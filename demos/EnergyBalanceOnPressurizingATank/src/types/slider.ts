export class Slider {
    private prelabel: HTMLElement | undefined;
    private postlabel: HTMLElement | undefined;
    private slider: HTMLInputElement | undefined;
    private units: string;
    private format: number;

    constructor (containerId: string, callback: (val: number) => void, units?: string, format: number = 1) {
        if (units === undefined) units = "";
        this.units = units;
        this.format = format;

        // Get the specified container
        const container = document.getElementById(containerId);
        if (container === null) {
            throw new Error(`Slider container ${containerId} not found`);
        }

        // Get list of child nodes
        const children = container.childNodes;
        for (const child of children) {
            if (child.nodeName === "DIV") {
                let className = (child as unknown as HTMLElement).className;
                if (className === "slider-label") {
                    this.prelabel = child as unknown as HTMLElement;
                }
                else if (className === "slider-val-label") {
                    this.postlabel = child as unknown as HTMLElement;
                }
            }
            else if (child.nodeName === "INPUT") {
                this.slider = child as unknown as HTMLInputElement;
            }
        }

        // Check that all children are accounted for
        if (this.prelabel === undefined || this.postlabel === undefined || this.slider === undefined) {
            throw new Error(`Error: slider ${containerId} must have prelabel, postlabel, and slider elements.`);
        }

        // Add event callback
        this.slider.addEventListener("input", () => {
            let val = Number(this.slider!.value);
            callback(val);
            this.postlabel!.innerHTML = this.formatVal(val);
        })
    }

    private formatVal = (val: number) => {
        return `${val.toFixed(this.format)} ` + this.units;
    }
}