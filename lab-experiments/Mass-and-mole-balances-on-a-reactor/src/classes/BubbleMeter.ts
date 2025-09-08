import { GetElement, insertClipPath } from "../ts/helpers";
import { FirstOrder } from "./Setpoint";
import { Signal } from "./Signal";

export const initBubbleMeter = (normalId: string, squeezeId: string, flowSignal: Signal<number>): BubbleMeter => {
    const bulb = new Signal<boolean>(false);

    // Get the elements
    const nrm = document.getElementById(normalId)!;
    const sqz = document.getElementById(squeezeId)!;

    // Style the bulb
    nrm.classList.add("svg-bulb")
    sqz.setAttribute("opacity","0");

    // Add event listeners to set the bulb
    nrm.addEventListener("mousedown", () => {
        bulb.set(true);
        sqz.setAttribute("opacity","100");
    });
    nrm.addEventListener("mouseup", () => {
        bulb.set(false);
        sqz.setAttribute("opacity","0");
    });

    // Use the bulb to initialize the bubble meter
    const bubbleMeterDescriptor: BubbleMeterDescriptor = {
        bulb: bulb,
        flowrate: flowSignal,
        soapId: "soap",
        bubbleId: "bubble",
        bubbleGid: "bubbleGroup",
        maxBubbleHeight: 71
    };

    // Initialize and return
    return new BubbleMeter(bubbleMeterDescriptor);
}

export type BubbleMeterDescriptor = {
    bulb: Signal<boolean>,
    flowrate: Signal<number>,
    soapId: string,
    bubbleId: string,
    bubbleGid: string,
    maxBubbleHeight: number
};

export class BubbleMeter {
    // Soap
    private soapHeight: FirstOrder;
    private soapClip: SVGClipPathElement;
    private soapBBox: DOMRect;
    private createBubble: boolean = false;
    // Bubble
    private minBubbleHeight: number;
    private maxBubbleHeight: number;
    private bubbleGroup: SVGGElement;
    private bubbles: Array<number> = [];
    // Animation
    private running: boolean = false;
    private flowrate: number = 0;

    constructor(descriptor: BubbleMeterDescriptor) {
        // Set the soap
        this.soapHeight = new FirstOrder(.2, 100, 0);
        const soap = GetElement<SVGPathElement>(descriptor.soapId);
        this.soapBBox =  soap.getBBox();
        this.soapClip = insertClipPath(soap, "soapclip", this.soapBBox);

        // Set the initial clip path
        this.setClip();

        // Subscribe to the bulb
        descriptor.bulb.subscribe((squeeze: boolean) => {
            if (squeeze) {
                this.soapHeight.setpoint = 1.0;
            }
            else {
                this.soapHeight.setpoint = 0.2;
            }
        });
        // Subscribe to the flowrate
        this.flowrate = descriptor.flowrate.get();
        descriptor.flowrate.subscribe((rate: number) => {
            this.flowrate = rate;
        });

        // I'll take a bubble...
        const bubble = GetElement<SVGRectElement>(descriptor.bubbleId);
        this.minBubbleHeight = Number(bubble.getAttribute("y")!);
        this.maxBubbleHeight = descriptor.maxBubbleHeight;
        // ...And delete it!
        bubble.remove();
        this.bubbleGroup = GetElement<SVGGElement>(descriptor.bubbleGid);
        
        this.animate();
    }

    private renderBubbles = (deltaTime: number) => {
        let bubbleHtml: string = '';
        let numOver = 0;
        const dy = -this.flowrate * deltaTime / 60000 * 226 / 50;
        // Iterate through the bubble array and render them all
        for (let i=0;i<this.bubbles.length;i++) {
            const y = this.bubbles[i] + dy;
            if (y < this.maxBubbleHeight) {
                ++numOver;
            }
            else {
                bubbleHtml += `<rect id="bubble" x="856" y="${y}" width="16" height="1" fill="#0E3126"></rect>`;
                this.bubbles[i] = y;
            }
        }
        
        // Shift out bubbles that have overflowed
        while (numOver > 0) {
            this.bubbles.shift();
            --numOver;
        }

        // console.log(bubbleHtml)
        this.bubbleGroup.innerHTML = bubbleHtml;
    }

    private setClip = () => {
        const bbox = this.soapBBox;
        const h = bbox.height * this.soapHeight.value;
        const y = bbox.y + bbox.height - h;
        // Set the clippath rect
        this.soapClip.innerHTML = `<rect x="${bbox.x}" y="${y}" width="${bbox.width}" height="${h}"></rect>`;
    }

    private animate = () => {
        if (this.running) return;
        this.running = true;

        let prevtime: number | null = null;
        
        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime;
            prevtime = time;

            // Iterate the soap
            this.soapHeight.iterate(deltaTime);
            this.setClip();

            // Determine whether a bubble will be created
            if (this.soapHeight.value >= .99) {
                this.createBubble = true;
            }
            else if (this.createBubble) { // Create the bubble
                this.createBubble = false;
                this.bubbles.push(this.minBubbleHeight);
            }
            // Update and render bubbles
            this.renderBubbles(deltaTime);

            requestAnimationFrame(frame);
        }

        // Start
        requestAnimationFrame(frame);
    }
}