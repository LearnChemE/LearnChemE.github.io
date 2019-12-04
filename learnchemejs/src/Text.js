import {Point} from "./Point.js";
import {randomID} from "./sky-helpers.js";
import {LAYERS} from "./GraphCanvasController.js";

const IDLENGTH = 16;

/**
    Text element for display through GraphCanvasController
    @param {string} text Text to display
    @param {string} [font="sans-serif"] Which font to use
    @param {string} [fontsize="20"] Size of the font (in px)
    @param {string} [fontstyle=""] Styling of the font (bold, italic, etc)
    @param {number} [align="left"] Also accepts strings "left"=0, "center"=0.5, or "right"=1
    @param {number} [valign="center"] Also accepts strings "top"=0, "center"=0.5, or "bottom"=1
    @param {string} [color="black"] Color of text
    @param {number} [opacity=1] Opacity of the text
    @param {number} [rotate=0] Rotation of the text (in degrees, clockwise)
    @param {Point} position Location of text on canvas
*/
export class Text {
    constructor(args) {
        // Default values
        this.ID = randomID(IDLENGTH);
        this.text = "";
        this.font = "sans-serif";
        this.fontsize = "20";
        this.fontstyle = "";
        this.align = "left";
        this.valign = "center";
        this.color = "black";
        /**
            @name Text#layer
            @type number
            @default 3
            @desc Layer to draw element onto
        */
        this.layer = LAYERS.OVER;
        this.opacity = 1;
        this.rotate = 0;
        // Argument values
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        // Convert data to point if not
        if (!(this.position instanceof Point)) {
            if (this.graphinfo) {
                this.position.graphinfo = this.graphinfo;
            }
            this.position = new Point(this.position);
        }
        // Convert text to string
        this.text = String(this.text);
    }
    /**
        @return {object} The internal data of the text
    */
    data() {
        let r = {};
        for (let k of Object.keys(this)) {
            r[k] = this[k];
        }
        return r;
    }

    draw(context) {
        // Set context variables
        context.save();
        context.translate(this.position.rawx, this.position.rawy);
        context.rotate(this.rotate * Math.PI / 180);
        // Plan variables
        let plan = {
            char: [],
            x: [0],
            y: [],
            font: [],
            color: [],
            opacity: [],
        };
        const subscale = 0.5;
        const supoff = -.75;
        let yoff = 0;
        let charcolor = this.color;
        let charopacity = this.opacity;
        // Plan each letter
        let i = 0;
        while (i < this.text.length) {
            while (this.text.charAt(i) === "<") {
                const command = this.text.slice(i,this.text.indexOf(">",i)+1)
                if (command === "<sub>") {
                    this.fontsize *= subscale;
                } else if (command === "</sub>") {
                    this.fontsize /= subscale;
                } else if (command === "<sup>") {
                    this.fontsize *= subscale;
                    yoff += this.fontsize * supoff;
                } else if (command === "</sup>") {
                    yoff -= this.fontsize * supoff;
                    this.fontsize /= subscale;
                } else if (command.slice(0,7) === "<color:") {
                    charcolor = command.slice(7,command.indexOf(">"));
                } else if (command === "</color>") {
                    charcolor = this.color;
                } else if (command.slice(0,9) === "<opacity:") {
                    charopacity = command.slice(9,command.indexOf(">"));
                } else if (command === "</opacity>") {
                    charopacity = this.opacity;
                } else {
                    console.log('Error in Text.draw(), command not recognized:', command);
                    break;
                }
                i += command.length;
            }
            // Set plan
            plan.char.push(this.text.charAt(i));
            plan.font.push(`${this.fontstyle} ${this.fontsize}px ${this.font}`);
            context.font = plan.font[plan.font.length-1];
            plan.color.push(charcolor);
            plan.opacity.push(charopacity);
            plan.x.push(plan.x[plan.x.length-1] + context.measureText(this.text.charAt(i)).width);
            plan.y.push(yoff);
            i++;
        }
        // Change starting position to account for alignment
        switch (this.align) {
            case "left":
                this.align = 0;
                break;
            case "center":
                this.align = 0.5;
                break;
            case "right":
                this.align = 1;
                break;
        }
        let diff = plan.x[plan.x.length-1] * this.align;
        for (i = 0; i < plan.x.length; i++) {
            plan.x[i] -= diff;
        }

        // Shift text to middle y based on largest font (capital M is hacky solution)
        switch (this.valign) {
            case "top":
                this.valign = 0;
                break;
            case "center":
                this.valign = 0.5;
                break;
            case "bottom":
                this.valign = 1;
                break;
        }
        context.font = `${this.fontstyle} ${this.fontsize}px ${this.font}`;
        const lineheight = context.measureText('M').width;
        for (i = 0; i < plan.y.length; i++) {
            plan.y[i] += (lineheight * this.valign);
        }
        // Draw letters
        for(i = 0; i < plan.char.length; i++) {
            context.font = plan.font[i];
            context.fillStyle = plan.color[i];
            context.globalAlpha = plan.opacity[i];
            context.fillText(plan.char[i], plan.x[i], plan.y[i]);
        }
        context.restore();
    }
}

