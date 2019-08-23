/**
    Stacked canvases for drawing on different layers
    @param {int} args.layers Number of layers
    @param {int} args.width Width of canvases
    @param {int} args.height Height of canvases
    @param {string} args.containerid ID of container element
    @param {string} args.containerclass class of container element
    @param {string} args.canvasidprefix ID of each canvas, postpended by its layer number
    @param {string} args.canvasclass Classes added to each canvas
    @param {string} args.parentid ID of element to be inserted into
*/
export class ZCanvas {
    constructor(args) {
        // Pull in arguments
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        // If parentid is given, insert html
        if (document.getElementById(this.parentid)) {
            document.getElementById(this.parentid).insertAdjacentHTML("beforeend", this.getHTML());
        }
        // If elements exist, link to them
        if (document.getElementById(this.containerid)) {
            this.link();
        }
    }

    /**
    *   Generates the HTML for a ZCanvas container and internal canvases
    *   @returns { string}  The html block
    */
    getHTML() {
        let html = `<div id="${this.containerid}" class="${this.containerclass}" style="position:relative; min-width:${this.width}px; min-height:${this.height}px;">`
        for (let i = 0; i < this.layers; i++) {
            html += `<canvas id="${this.containerid}-${this.canvasidprefix}${i}" class="${this.canvasclass}" style="z-index:${i}; position:absolute;"></canvas>`;
        }
        html += `</div>`;
        return html;
    }

    static getHTMLSkeleton(args) {
        let html = `<div id="${args.containerid}" class="${args.containerclass}" style="position:relative; min-width:${args.width}px; min-height:${args.height}px;">`
        for (let i = 0; i < args.layers; i++) {
            html += `<canvas id="${args.containerid}-${args.canvasidprefix}${i}" class="${args.canvasclass}" style="z-index:${i}; position:absolute;"></canvas>`;
        }
        html += `</div>`;
        return html;
    }

    /**
    *   Connects the canvas elements to this object and sets the size
    */
    link() {
        if (document.getElementById(`${this.containerid}`)) {
            this.canvas = {};
            this.ctx = {};
            for (let i = 0; i < this.layers; i++) {
                this.canvas[i] = document.getElementById(`${this.containerid}-${this.canvasidprefix}${i}`)
                this.canvas[i].width = this.width;
                this.canvas[i].height = this.height;
                this.ctx[i] = this.canvas[i].getContext("2d");
            }
            this.updateTopBottom();
        } else {
            console.log('Error initializing ZCanvas, does not exist in document yet.', this);
        }
    }
    
    /**
    * Sets 'top' and 'bottom' references to the appropriate layers
    */
    updateTopBottom() {
        this.canvas["top"] = this.canvas[this.layers - 1];
        this.canvas["bottom"] = this.canvas[0];
        this.ctx["top"] = this.ctx[this.layers - 1];
        this.ctx["bottom"] = this.ctx[0];
    }
}
