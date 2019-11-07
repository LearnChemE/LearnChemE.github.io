import {ZCanvas} from "./ZCanvas.js";
import {Point} from "./Point.js";
import {Line} from "./Line.js";
import {Text} from "./Text.js";
import {GraphInfo} from "./GraphInfo.js";
import {getDist, constrain, roundTo, getAngle, evalWithContext, isBetween, FindRoot} from "./sky-helpers.js";

const GRABRADIUS = 10;

/**
    Controller class for HTML canvas objects<br>
    Uses two overlaid canvases for background and foreground drawing.
*/
export class GraphCanvas{
    /**
        @param {object} args Object of input arguments
    */
    constructor(id, parent, args) {
        // Pull in arguments
        // this.graphinfo = args.graphinfo;
        this.graphinfo = new GraphInfo(args.graphinfo);
        this.cursor = args.cursor;

        this.layers = {
            "GRID": 0,
            "UNDER": 1,
            "FRAME": 2,
            "OVER": 3,
            "CURSOR": 4,
        };

        // Retrieve DOM elements
        let zc = new ZCanvas({
            "layers": Object.keys(this.layers).length,
            "width": this.graphinfo.width,
            "height": this.graphinfo.height,
            "containerid": `${id}`,
            "containerclass": "graphcanvas",
            "canvasidprefix": "graphcanvas--",
            "canvasclass": "graphcanvas-canvas",
            "parentid": parent,
        });
        this.canvas = zc.canvas;
        this.ctx = zc.ctx;

        // Set up canvas size
        this.height = this.graphinfo.height;
        this.width = this.graphinfo.width;

        // Draw graph layout
        this.drawGraph();

        // State variables
        this.drawing = false; /* True when not finished drawing */

        // Constants
        this.grabradius = GRABRADIUS;

        this.max = [];
        this.finished = [];
        // Set max elements of each type, if specified
        if (args.answercount != undefined) {
            this.max = args.answercount;
        }
        // Set default elements of each type, if specified
        if (args.default != undefined) {
            this.default = [];
            for (let type of Object.keys(args.default)) {
                for (let d of args.default[type]) {
                    this.finished.push(this.dataToElement(type, d));
                }
            }
        }

        // Set up mouse events
        // this.canvas["top"].addEventListener("mousemove", e => this.mouseMove(e));
        // this.canvas["top"].addEventListener("mousedown", e => this.mouseDown(e));
        // this.canvas["top"].addEventListener("mouseup", e => this.mouseUp(e));

        // Initialize
        this.update();
    }

    /**
        Clears the foreground canvas
    */
    clear() {
        //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        // Hacky workaround
        this.canvas[this.layers.UNDER].width = this.canvas[this.layers.UNDER].width;
        this.canvas[this.layers.OVER].width = this.canvas[this.layers.OVER].width;
        this.canvas[this.layers.CURSOR].width = this.canvas[this.layers.CURSOR].width;
    }

    /**
        Updates the canvas to its current state
    */
    update() {
        this.clear();
        // Remove objects if over limits
        if (this.mode != "view") {
            this.trimLists();
        }
        // Draw objects
        for (let obj of this.finished) {
            this.draw(obj);
        }
    }
    /**
        Creates geometric class object from input data
        @param {string} type "point", "line", or "text"
        @param {object} data Object of input arguments for object
        @return {Point|Line|Text} An instance of the chosen class
    */
    dataToElement(type, data) {
        // Append calibration data
        data.graphinfo = this.graphinfo;
        // Create appropriate object
        if (type === "point") {
            return new Point(data);
        } else if (type === "line") {
            let ptlist = [];
            if (data.points) {
                // line constructed from list of points
                for (let ptdata of data.points) {
                    ptdata.graphinfo = this.graphinfo;
                    let pt = new Point(ptdata);
                    ptlist.push(pt);
                    if (pt.show) {
                        this.finished.push(pt);
                    }
                }
                data.points = ptlist;
            } else if (data.equation) {
                // line constructed from equation
                const ind = data.independent;
                const dep = data.dependent;
                const di = (ind.max - ind.min) / (data.steps - 1);
                // Replace independent variable with value
                const re = new RegExp(`${SPVAR}${data.independent.symbol}${SPVAR}`, "g");

                // Calculate points along line
                let i = ind.min;
                while (i <= ind.max) {
                    let ptdata = {};
                    ptdata[ind.symbol] = i;
                    // Evaluate expression (trusted code provided by the question-creator)
                    ptdata[dep.symbol] = evalWithContext(data.equation.replace(re, i));
                    ptdata["graphinfo"] = this.graphinfo;
                    if (data.showpoints) {
                        ptdata.show = true;
                    } else {
                        ptdata.show = false;
                    }
                    let pt = new Point(ptdata);
                    ptlist.push(pt);
                    if (pt.show) {
                        this.finished.push(pt);
                    }

                    i += di;
                }
                if (data.label) {
                    // Calculate y position
                    data.label.dependent = evalWithContext(data.equation.replace(re, data.label.independent));
                    // Calculate slope
                    const nextpt = evalWithContext(data.equation.replace(re, data.label.independent + di));
                    const dy = nextpt - data.label.dependent;
                    const slope = Math.atan((dy * this.graphinfo.y.scale) / (di * this.graphinfo.x.scale));
                    data.label.rotate = 180 / Math.PI * slope;
                    // Adjust for offset
                    data.label.independent += data.label.indoffset;
                    data.label.dependent += data.label.depoffset;
                }
                data.points = ptlist;
            }
            return new Line(data);
        } else if (type === "text") {
            data.position.graphinfo = this.graphinfo;
            return new Text(data);
        }
    }
    /**
        @param {event} e Mouse event
        @return {Point} Point object at the current location of the mouse cursor
    */
    getMousePoint(e) {
        return new Point({"rawx":e.pageX - this.canvas[this.layers.CURSOR].offsetParent.offsetLeft,
                          "rawy":e.pageY - this.canvas[this.layers.CURSOR].offsetParent.offsetTop,
                          "graphinfo":this.graphinfo});
    }
    /**
        Draws an element to the foreground canvas<br>
        To be replaced with Object.draw() calls
        @param {Point|Line|Text} element QuestionElement to be drawn
    */
    draw(element) {
        let layer = undefined;
        if (element.layer) {
            layer = element.layer;
        }
        this.ctx[element.layer]
        this.ctx[layer].save();
        element.draw(this.ctx[layer]);
        this.ctx[layer].restore();
    }

    drawLine(xs, ys, color, width, dashes) {
        let ctx = this.ctx[this.layers.UNDER];

        ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]})`;

        if (width != undefined) {
            ctx.lineWidth = width;
        } else {
            ctx.lineWidth = 1;
        }

        if (dashes != undefined) {
            ctx.setLineDash(dashes);
        } else {
            ctx.setLineDash([1, 0]);
        }

        ctx.beginPath();
        for (let i = 0; i < xs.length; i++) {
            const drawx = this.graphinfo.x.CalToRaw(xs[i]);
            const drawy = this.graphinfo.y.CalToRaw(ys[i]);
            ctx.lineTo(drawx, drawy);
        }
        ctx.stroke();
    }

    fillLine(xs, ys, color) {
        let ctx = this.ctx[this.layers.UNDER];

        ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;

        ctx.beginPath();
        for (let i = 0; i < xs.length; i++) {
            const drawx = this.graphinfo.x.CalToRaw(xs[i]);
            const drawy = this.graphinfo.y.CalToRaw(ys[i]);
            ctx.lineTo(drawx, drawy);
        }
        ctx.fill();
    }

    drawText(text, x, y, properties={}) {
        let props = properties;
        props['text'] = text;
        props['position'] = new Point({'x':x, 'y':y, 'graphinfo':this.graphinfo});
        new Text(properties).draw(this.ctx[this.layers.UNDER]);
    }

    /**
        Draws the background of the graph (background colors, axes, labels)<br>
        Needs serious revision
    */
    drawGraph() {
        // Border region
        this.ctx[this.layers.FRAME].fillStyle = this.graphinfo.axesbackground;
        this.ctx[this.layers.FRAME].fillRect(0, 0, this.graphinfo.width, this.graphinfo.graphtop);
        this.ctx[this.layers.FRAME].fillRect(0, 0, this.graphinfo.graphleft, this.graphinfo.height);
        this.ctx[this.layers.FRAME].fillRect(this.graphinfo.graphright, 0, this.graphinfo.width, this.graphinfo.height);
        this.ctx[this.layers.FRAME].fillRect(0, this.graphinfo.graphbottom, this.graphinfo.width, this.graphinfo.height);

        // Graph region
        this.ctx[this.layers.GRID].fillStyle = this.graphinfo.graphbackground;
        this.ctx[this.layers.GRID].fillRect(this.graphinfo.padding.left, this.graphinfo.padding.top, this.graphinfo.graphwidth, this.graphinfo.graphheight);

        // TODO use text measuring to place label text

        // X axis
        if (this.graphinfo.x != undefined) {
            this.drawAxis({
                axisinfo: this.graphinfo.x,
                stepStart: this.graphinfo.padding.left,
                stepLimit: this.graphinfo.width - this.graphinfo.padding.right,
                axisY0: this.graphinfo.height - this.graphinfo.padding.bottom,
                axisY1: this.graphinfo.padding.top,
                tickSign: -1,
                numberOffset: 10,
                labelX: this.graphinfo.graphwidth / 2 + this.graphinfo.padding.left,
                labelY: this.graphinfo.height - this.graphinfo.padding.bottom + 40,
                labelrotate: 0,
             });
        }
        // Y axis
        if (this.graphinfo.y != undefined) {
            this.drawAxis({
                axisinfo: this.graphinfo.y,
                stepStart: this.graphinfo.padding.top,
                stepLimit: this.height - this.graphinfo.padding.bottom,
                axisX0: this.graphinfo.padding.left,
                axisX1: this.graphinfo.padding.left + this.graphinfo.graphwidth,
                tickSign: 1,
                numberOffset: -20,
                labelX: this.graphinfo.padding.left - 50,
                labelY: this.graphinfo.graphheight / 2 + this.graphinfo.padding.top,
                labelrotate: -90,
             });
        }
        // X2 axis
        if (this.graphinfo.x2 != undefined) {
            this.drawAxis({
                axisinfo: this.graphinfo.x2,
                stepStart: this.graphinfo.padding.left,
                stepLimit: this.graphinfo.width - this.graphinfo.padding.right,
                axisY0: this.graphinfo.padding.top,
                axisY1: this.graphinfo.height - this.graphinfo.padding.bottom,
                tickSign: 1,
                numberOffset: -11,
                labelX: this.graphinfo.graphwidth / 2 + this.graphinfo.padding.left,
                labelY: this.graphinfo.padding.top - 40,
                labelrotate: 0,
             });
        }
        // Y2 axis
        if (this.graphinfo.y2 != undefined) {
            this.drawAxis({
                // TODO test values to make sure they display well
                axisinfo: this.graphinfo.y2,
                stepStart: this.graphinfo.padding.top,
                stepLimit: this.height - this.graphinfo.padding.bottom,
                axisX0: this.graphinfo.padding.left,
                axisX1: this.graphinfo.padding.left + this.graphinfo.graphwidth,
                tickSign: -1,
                numberOffset: 20,
                labelX: this.graphinfo.padding.left + this.graphinfo.graphwidth + 40,
                labelY: this.graphinfo.graphheight / 2 + this.graphinfo.padding.top,
                labelrotate: 90,
             });
        }
        // Bounding box
        this.ctx[this.layers.FRAME].rect(this.graphinfo.padding.left, this.graphinfo.padding.top, this.graphinfo.graphwidth, this.graphinfo.graphheight);
        this.ctx[this.layers.FRAME].strokeStyle = "black";
        this.ctx[this.layers.FRAME].lineWidth = 1;
        this.ctx[this.layers.FRAME].stroke();
    }
    /**
        Abstract method to replace drawGraph
    */
    drawAxis(args) {
        // Constants
        const MajorAxisTickLength = 10;
        const MinorAxisTickLength = 5;
        const LabelDigits = 3;
        const LabelxDigits = LabelDigits;
        const LabelyDigits = LabelDigits;
        const Labelx2Digits = LabelDigits;
        const Labely2Digits = LabelDigits;
        const GridColor = "lightgray";
        const GridThickness = 1;
        const TickColor = "gray";
        const TickThickness = 1;
        const TextColor = "black";
        const TextFont = "sans-serif";
        const TextFontSize = 20;
        const TextFontStyle = "";

        let pt = 0;
        let txt = "";

        // Draw gridlines
        this.ctx[this.layers.GRID].strokeStyle = GridColor;
        this.ctx[this.layers.GRID].lineWidth = GridThickness;
        for (let i = args.stepStart; i <= args.stepLimit; i += Math.abs(args.axisinfo.gridline * args.axisinfo.scale)) {
            this.ctx[this.layers.GRID].beginPath();
            if (args.axisY0 && args.axisY1) {
                this.ctx[this.layers.GRID].moveTo(i, args.axisY0);
                this.ctx[this.layers.GRID].lineTo(i, args.axisY1);
            } else if (args.axisX0 && args.axisX1) {
                this.ctx[this.layers.GRID].moveTo(args.axisX0, i);
                this.ctx[this.layers.GRID].lineTo(args.axisX1, i);
            }
            this.ctx[this.layers.GRID].stroke();
        }
        // Draw minor ticks
        this.ctx[this.layers.FRAME].strokeStyle = TickColor;
        this.ctx[this.layers.FRAME].lineWidth = TickThickness;
        for (let i = args.stepStart; i <= args.stepLimit; i += Math.abs(args.axisinfo.minortick * args.axisinfo.scale)) {
            this.ctx[this.layers.FRAME].beginPath();
            if (args.axisY0 && args.axisY1) {
                this.ctx[this.layers.FRAME].moveTo(i, args.axisY0);
                this.ctx[this.layers.FRAME].lineTo(i, args.axisY0 + args.tickSign * MinorAxisTickLength);
            } else if (args.axisX0 && args.axisX1) {
                this.ctx[this.layers.FRAME].moveTo(args.axisX0, i);
                this.ctx[this.layers.FRAME].lineTo(args.axisX0 + args.tickSign * MinorAxisTickLength, i);
            }
            this.ctx[this.layers.FRAME].stroke();
        }
        // Draw major ticks and numbers
        for (let i = args.stepStart; i <= args.stepLimit; i += Math.abs(args.axisinfo.majortick * args.axisinfo.scale)) {
            this.ctx[this.layers.FRAME].beginPath();
            this.ctx[this.layers.FRAME].strokeStyle = TickColor;
            if (args.axisY0 && args.axisY1) {
                this.ctx[this.layers.FRAME].moveTo(i, args.axisY0);
                this.ctx[this.layers.FRAME].lineTo(i, args.axisY0 + args.tickSign * MajorAxisTickLength);
                txt = roundTo(args.axisinfo.RawToCal(i), LabelDigits);
                pt = new Point({rawx:i, rawy:args.axisY0 + args.numberOffset, graphinfo:this.graphinfo});
            } else if (args.axisX0 && args.axisX1) {
                this.ctx[this.layers.FRAME].moveTo(args.axisX0, i);
                this.ctx[this.layers.FRAME].lineTo(args.axisX0 + args.tickSign * MajorAxisTickLength, i);
                txt = roundTo(args.axisinfo.RawToCal(i), LabelDigits);
                pt = new Point({rawx:args.axisX0 + args.numberOffset, rawy:i, graphinfo:this.graphinfo});
            }
            this.ctx[this.layers.FRAME].stroke();

            new Text({
                "text": txt,
                "align": "center",
                "color": TextColor,
                "font": TextFont,
                "fontsize": TextFontSize,
                "fontstyle": TextFontStyle,
                "position": pt
            }).draw(this.ctx[this.layers.FRAME]);

        }

        // Draw label
        new Text({
            "text": args.axisinfo.label,
            "align": "center",
            "color": TextColor,
            "font": TextFont,
            "fontsize": TextFontSize,
            "fontstyle": TextFontStyle,
            "position": new Point({rawx:args.labelX, rawy:args.labelY, graphinfo:this.graphinfo}),
            graphinfo: this.graphinfo,
            rotate: args.labelrotate,
        }).draw(this.ctx[this.layers.FRAME]);
    }
    /**
        Checks each type of element (point, line, etc) and removes the oldest member(s) if more than the maximum exist
    */
    trimLists() {
        let quota = {};
        for (let type of Object.keys(this.max)) {
            quota[type] = this.max[type];
        }
        for (let i = this.finished.length-1; i >= 0; i--) {
            let obj = this.finished[i];
            if (obj.answer) {
                if (obj instanceof Point) {
                    if (quota["point"] != undefined) {
                        if (quota["point"] > 0) {
                            quota["point"] -= 1;
                        } else {
                            this.finished.splice(this.finished.indexOf(obj),1);
                        }
                    }
                } else if (obj instanceof Line) {
                    if (quota["line"] != undefined) {
                        if (quota["line"] > 0) {
                            quota["line"] -= 1;
                        } else {
                            this.finished.splice(this.finished.indexOf(obj),1);
                        }
                    }
                }
            }
        }
    }
    /**
        Finds a point in the list of drawn objects by its {@link Point#ID}
        @return {Point}
    */
    getPointByID(ID) {
        for (let pt of this.finished) {
            if (pt instanceof Point) {
                if (pt.ID === ID) {
                    return pt;
    }}}}
    /**
        Deletes a point in the list of drawn objects by its {@link Point#ID}
    */
    deletePointByID(ID) {
        for (let pt of this.finished) {
            if (pt instanceof Point) {
                if (pt.ID === ID) {
                    this.finished.splice(this.finished.indexOf(pt),1);
    }}}}
    /**
        Displays cursor data next to the mouse cursor
        @param {Point} cursorpt Location of the cursor
        @param {object} cursordata How the cursor data should look
        @param {string} [cursordata.color="black"] What color the text is written in
        @param {string} [cursordata.font="sans-serif"] What font the text is written in
        @param {string} [cursordata.fontsize="16"] What size the text is written in (in px)
        @param {string} [cursordata.fontstyle="bold"] What style the text is written in
        @param {string} cursordata.format Format of the string to display (use ~x~, ~x2~, ~y~, or ~y2~ for relevant coordinate)
        @param {object} cursordata.digits How many digits to round to for each axis. If using an axis in cursordata.format, it must have a number of digits set.
        @param {int} cursordata.digits.x
        @param {int} cursordata.digits.x2
        @param {int} cursordata.digits.y
        @param {int} cursordata.digits.y2
        @param {number} [cursordata.distance=25] Distance from the center of the cursor to the text display
    */
    drawCursor(cursorpt, cursordata) {
        // Bound cursor within graph
        if (cursorpt.x) {
            cursorpt.x = constrain(cursorpt.x, this.graphinfo.x.min, this.graphinfo.x.max);
        }
        if (cursorpt.y) {
            cursorpt.y = constrain(cursorpt.y, this.graphinfo.y.min, this.graphinfo.y.max);
        }
        if (cursorpt.x2) {
            cursorpt.x2 = constrain(cursorpt.x2, this.graphinfo.x2.min, this.graphinfo.x2.max);
        }
        if (cursorpt.y2) {
            cursorpt.y2 = constrain(cursorpt.y2, this.graphinfo.y2.min, this.graphinfo.y2.max);
        }
        cursorpt.generateRawFromCal();

        // Align text around cursor
        const midx = this.graphinfo.graphwidth / 2 + this.graphinfo.padding.left;
        const midy = this.graphinfo.graphheight / 2 + this.graphinfo.padding.top;
        const theta = getAngle(cursorpt.rawx, cursorpt.rawy, midx, midy);
        let cursoralign = 0;
        let cursorvalign = 0.5;
        if (theta >= Math.PI) {
            cursoralign = -theta / Math.PI + 2;
        } else {
            cursoralign = theta / Math.PI;
        }
        // Default cursor value
        cursordata.distance = cursordata.distance ? cursordata.distance : 25;

        // Calculate text display location
        let cursorrawx = cursorpt.rawx;
        let cursorrawy = cursorpt.rawy;
        const edgemargin = 5;
        if (cursorrawx <= this.graphinfo.graphleft) {
            cursoralign = 0;
            cursorrawx = this.graphinfo.graphleft + edgemargin;
        } else if (cursorrawx >= this.graphinfo.graphright) {
            cursoralign = 1;
            cursorrawx = this.graphinfo.graphright - edgemargin;
        } else {
            cursorrawx += cursordata.distance * Math.cos(theta) / Math.sqrt(Math.abs(Math.cos(theta)));
        }
        if (cursorrawy <= this.graphinfo.graphtop) {
            cursorvalign = 1;
            cursorrawy = this.graphinfo.graphtop + edgemargin;
        } else if (cursorrawy >= this.graphinfo.graphbottom) {
            cursorvalign = 0;
            cursorrawy = this.graphinfo.graphbottom - edgemargin;
        } else {
            cursorrawy += cursordata.distance * Math.sin(theta) / Math.sqrt(Math.abs(Math.sin(theta)));
        }

        // Fill default arguments
        let cursorcolor = "black";
        if (cursordata.color != undefined) {
            cursorcolor = cursordata.color;
        }
        let cursorfont = "sans-serif";
        if (cursordata.font != undefined) {
            cursorfont = cursordata.font;
        }
        let cursorfontsize = "16";
        if (cursordata.fontsize != undefined) {
            cursorfontsize = cursordata.fontsize;
        }
        let cursorfontstyle = "bold";
        if (cursordata.fontstyle != undefined) {
            cursorfontstyle = cursordata.fontstyle;
        }
        // Generate text based on cursordata format
        let content = cursordata.format;
        if (this.graphinfo.x != undefined) {
            content = content.replace(`${SPVAR}x${SPVAR}`, cursorpt.x.toFixed(this.cursor.digits.x));
        }
        if (this.graphinfo.y != undefined) {
            content = content.replace(`${SPVAR}y${SPVAR}`, cursorpt.y.toFixed(this.cursor.digits.y));
        }
        if (this.graphinfo.x2 != undefined) {
            content = content.replace(`${SPVAR}x2${SPVAR}`, cursorpt.x2.toFixed(this.cursor.digits.x2));
        }
        if (this.graphinfo.y2 != undefined) {
            content = content.replace(`${SPVAR}y2${SPVAR}`, cursorpt.y2.toFixed(this.cursor.digits.y2));
        }

        // Draw text
        let cp = new Point({
            "rawx":cursorrawx,
            "rawy":cursorrawy,
            "graphinfo":cursorpt.graphinfo,
            "show":false,
            "label":{
                "text": content,
                "color": cursorcolor,
                "font": cursorfont,
                "fontsize": cursorfontsize,
                "fontstyle": cursorfontstyle,
                "align": cursoralign,
                "valign": cursorvalign}});
        this.draw(cp);
        //this.draw(new Text());
    }
    grabElement(pt) {
        let grabindex = -1;
        let grabdist = 99999;
        // Check which object is being picked up
        for (let i in this.finished) {
            if (this.finished[i] instanceof Point) {
                // Check if movable
                if (this.finished[i].movex || this.finished[i].movey) {
                    // Check if in grabbing distance
                    let d = getDist(pt, this.finished[i], "raw");
                    if (d <= this.grabradius) {
                        if (d < grabdist) {
                            grabindex = i;
                            grabdist = d;
                        }
                    }
                }
            } else if (this.finished[i] instanceof Line) {
                for (let j = 1; j < this.finished[i].points.length; j++) {
                    let pt1 = this.finished[i].points[j];
                    let pt2 = this.finished[i].points[j-1]
                    // If either point is immovable, line isn't movable
                    if ((!pt1.movex && !pt1.movey) || (!pt2.movex && !pt2.movey)) {
                        // If any point is immobile, the line cannot be moved
                        break;
                    }
                    // Shrink grabbing range for line (otherwise assume grabbing a point on either end)
                    let minx = Math.min(pt1.rawx, pt2.rawx) + this.grabradius;
                    let maxx = Math.max(pt1.rawx, pt2.rawx) - this.grabradius;
                    // Check if clicked x is between bounds
                    if (pt.rawx > minx && pt.rawx < maxx) {
                        let ytarget = (pt.rawx - pt1.rawx) * (pt2.rawy - pt1.rawy) / (pt2.rawx - pt1.rawx) + pt1.rawy;
                        let d = Math.abs(pt.rawy - ytarget);
                        // Check if in grabbing range of the line
                        if (d <= this.grabradius) {
                            // Check if this is the closest object
                            if (d < grabdist) {
                                grabindex = i;
                                grabdist = d;
        }}}}}}
        // If an element was clicked on, pick it up
        if (grabindex > -1) {
            this.grabpoint = pt;
            this.held = this.finished[grabindex];
            this.finished.splice(grabindex, 1);
            if (this.held instanceof Line) {
                this.origins = {};
                for (let p of this.held.points) {
                    this.origins[p.ID] = new Point(p.data());
                    this.deletePointByID(p.ID);
                }
            }
            // Grabbed something
            return true;
        }
        // Didn't grab anything
        return false;
    }

    dragElement(pt) {
        if (this.held instanceof Point) {
            // Copy current location data to point
            if (this.held.movex) {
                this.held.rawx = constrain(pt.rawx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
            }
            if (this.held.movey) {
                this.held.rawy = constrain(pt.rawy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
            }
            // Calculated calibrated positions from new raw position
            this.held.generateCalFromRaw();
            // Show held point
            this.draw(this.held);
        } else if (this.held instanceof Line) {
            // Update location data
            let rawdx = pt.rawx - this.grabpoint.rawx;
            let caldx = pt.x - this.grabpoint.x;
            let rawdy = pt.rawy - this.grabpoint.rawy;
            let caldy = pt.y - this.grabpoint.y;
            for (let p of this.held.points) {
                if (p.movex) {
                    p.rawx = constrain(this.origins[p.ID].rawx + rawdx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
                }
                if (p.movey) {
                    p.rawy = constrain(this.origins[p.ID].rawy + rawdy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
                }
                p.generateCalFromRaw();
                // Show points
                if (p.show) {
                    this.draw(p);
                }
            }
            // Show held line
            this.draw(this.held);
        }
    }

    dropElement(pt) {
        if (this.held instanceof Point) {
            // Copy current location data to point
            if (this.held.movex) {
                this.held.rawx = constrain(pt.rawx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
            }
            if (this.held.movey) {
                this.held.rawy = constrain(pt.rawy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
            }
            // Calculated calibrated positions from new raw position
            this.held.generateCalFromRaw();
            // Add point to finished list
            this.finished.push(this.held);
        } else if (this.held instanceof Line) {
            let rawdx = pt.rawx - this.grabpoint.rawx;
            let caldx = pt.x - this.grabpoint.x;
            let rawdy = pt.rawy - this.grabpoint.rawy;
            let caldy = pt.y - this.grabpoint.y;
            for (let p of this.held.points) {
                if (p.movex) {
                    p.rawx = constrain(this.origins[p.ID].rawx + rawdx, this.graphinfo.padding.left, this.graphinfo.padding.left + this.graphinfo.graphwidth);
                }
                if (p.movey) {
                    p.rawy = constrain(this.origins[p.ID].rawy + rawdy, this.graphinfo.padding.top, this.graphinfo.padding.top + this.graphinfo.graphheight);
                }
                p.generateCalFromRaw();
                // Show points
                if (p.show) {
                    this.finished.push(p);
                }
            }
            // Add line to finished list
            this.finished.push(this.held);
            this.origins = undefined;
            this.grabpoint = undefined;
        }
        // Reset holding
        this.held = undefined;
    }
    /**
        Whenever the mouse is moved over the canvas, update the dynamic layer.
    */
    mouseMove(e) {
        // Get location of event

        let pt = this.getMousePoint(e);
        this.update();

        // Draw cursor
        if (this.cursor != undefined) {
            let cursorpt = new Point(pt.data());
            if (this.held) {
                if (this.held.altcursor) {
                    this.drawCursor(cursorpt, this.held.altcursor);
                } else {
                    this.drawCursor(cursorpt, this.cursor);
                }
            } else {
                this.drawCursor(cursorpt, this.cursor);
            }
        }
        // If moving objects
        if (this.mode === "move") {
            // Drag held object
            if (this.held) {
                this.dragElement(pt);
            }
        // If drawing
        } else if (this.drawing) {
            if (this.mode === "point") {
                this.draw(pt);
            } else if (this.mode === "line") {
                this.draw(new Line({"points":[this.pt, pt]}));
            } else if (this.mode === "calibrate") {
                this.draw(new Line({"points":[this.pt, pt]}));
            }
        }
    }
    /**
        Whenever the mouse is released over the canvas
    */
    mouseUp(e) {
        // Get location of event
        let pt = this.getMousePoint(e);
        if (this.mode === "move") {
            if (this.held) {
                this.dropElement(pt);
            }
        } else if (this.mode === "draw") {
            this.drawing = false;
            if (this.mode === "point") {
                this.finished.push(pt);
            } else if (this.mode === "line") {
                this.finished.push(new Line({"points":[this.pt, pt]}));
            } else if (this.mode === "calibrate") {
                // calibration routine
                this.finished.push(new Line({"points":[this.pt, pt]}));
                let x1 = document.getElementById(this.x1).value;
                let y1 = document.getElementById(this.y1).value;
                let x2 = document.getElementById(this.x2).value;
                let y2 = document.getElementById(this.y2).value;
                let str = `let calibration = new Line({"points":[new Point({"rawx":${this.pt.rawx}, "rawy":${this.pt.rawy}, "x":${x1}, "y":${y1}})`
                str += `, new Point({"rawx":${pt.rawx}, "rawy":${pt.rawy}, "x":${x2}, "y":${y2}})]});`;
                console.log("Copy and paste the line between the bars to use this calibration:");
                console.log("-----");
                console.log(str);
                console.log("-----");
            }
        }
    }
    /**
        Whenever the mouse is clicked on the canvas object
    */
    mouseDown(e) {
        // Get location of event
        let pt = this.getMousePoint(e);
        if (this.mode == "move") {
            // Check if an element was grabbed
            if (this.grabElement(pt)) {
                this.update();
                this.draw(this.held);
            }
        } else if (this.mode == "draw") {
            this.pt1 = pt;
            this.drawing = true;
        }
    }
    /**
        Handle key-press events<br>
        Must be forwarded from {@link ProblemController}
    */
    keyPress(key) {
        this.drawing = false;
        this.calibrating = false;
        if (key === "p") {
            this.mode = "point";
        } else if (key === "l") {
            this.mode = "line";
        }
        this.update();
    }
}
