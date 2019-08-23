import {DOM} from "./DOM.js";
import {QuestionElement} from "./QuestionElement.js";
import {GraphInfo} from "./GraphInfo.js";
import {GraphCanvasController, LAYERS} from "./GraphCanvasController.js";
import {ZCanvas} from "./ZCanvas.js";
import {Point} from "./Point.js";
import {Line} from "./Line.js";

const VAR = "@";

/**
    Container class for canvas-entry questions
*/
export class CanvasElement extends QuestionElement {
    /**
        @param {object} inputarguments
        @param {string} inputarguments.mode ("view, "move", "draw")
        @param {object} inputarguments.answercount Number of elements allowed on graph at time
        @param {object} inputarguments.answercount.point
        @param {object} inputarguments.answercount.line
        @param {list} inputarguments.answer Correct answers
        @param {list} inputarguments.default {@link QuestionElements} that appear on graph by default
        @param {object} inputarguments.tolerance Range above and below answer to accept
        @param {float} inputarguments.tolerance.x
        @param {float} inputarguments.tolerance.y
        @param {int} inputarguments.points How many points this element is worth
        @param {string} inputarguments.imgsrc (deprecated) Location of image source file
        @param {Calibration} inputarguments.imgcal (deprecated) Calibration data for image
    */
    constructor(inputarguments) {
        super(inputarguments);

        if (!(this.graphinfo instanceof GraphInfo)) {
            // Convert graphinfo data into class instance
            this.graphinfo = new GraphInfo(this.graphinfo)
        }
    }

    /**
        Check user-submitted answers against correct answers
        @param {Element} answer The correct answer
        @return The score as a percentage (0 to 1)
    */
    checkanswer(answer) {
        let score = {"max": 0,
                     "got": 0,
                     "pct": 0};
        let used = [];
        if (this.answercount["point"] > 0) {
            // Each answer being looked for
            for (let i in this.answer.point) {
                score.max += 1;
                // Each answer provided
                for (let j in answer) {
                    if (answer[j] instanceof Point) {
                        // If unused
                        if (used.indexOf(j) === -1) {
                            // If close enough
                            if (Math.abs(answer[j].x - this.answer.point[i].x) <= this.answer.point[i].tolerance.x && Math.abs(answer[j].y - this.answer.point[i].y) <= this.answer.point[i].tolerance.y) {
                                score.got += 1;
                                used.push(j);
                                //points.splice(j);
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (this.answercount["line"] > 0) {
            // Each answer being looked for
            for (let i in this.answer.line) {
                score.max += 1;
                let matchscore = 0;
                let matchindex = 0;
                // Each answer provided
                for (let j in answer) {
                    let mymatchscore = 0;
                    let mymaxscore = 0;
                    if (answer[j] instanceof Line) {
                        // If unused
                        if (used.indexOf(j) === -1) {
                            // If same line size
                            if (this.answer.line[i].points.length === answer[j].points.length) {
                                // Each point in the line
                                for (let k in answer[j].points) {
                                    if ((answer[j].points[k].movex || answer[j].points[k].movey) && this.answer.line[i].points[k].answer) {
                                        mymaxscore++;
                                        // If point is not close enough
                                        const ansx = this.answer.line[i].points[k].x;
                                        const inpx = answer[j].points[k].x;
                                        const tolx = this.answer.line[i].tolerance.x;
                                        const ansy = this.answer.line[i].points[k].y;
                                        const inpy = answer[j].points[k].y;
                                        const toly = this.answer.line[i].tolerance.y;
                                        if (Math.abs(ansx - inpx) <= tolx && Math.abs(ansy - inpy) <= toly) {
                                            mymatchscore++;
                                        }
                                    }
                                }
                                if (mymatchscore > matchscore) {
                                    mymatchscore = mymatchscore / mymaxscore;
                                    matchscore = mymatchscore;
                                    matchindex = j;
                                }
                            }
                        }
                    }
                }
                if (matchscore > 0) {
                    score.got += matchscore;
                    used.push(matchindex);
                }
            }
        }
        if (score.max > 0) {
            score.pct = score.got / score.max;
        }
        return score.pct;
    }

    /**
        Generates the HTML for this element <br>
        Includes a style tag to set the min-width to the graph width
        @param {int} id Unique id to be included in the HTML elements
    */
    getHTML(id) {

        let sk = ZCanvas.getHTMLSkeleton({
            "layers":  Object.keys(LAYERS).length,
            "width": this.graphinfo.width,
            "height": this.graphinfo.height,
            "containerid": `canvasarea--${id}`,
            "containerclass": DOM.canvasdivclass,
            "canvasidprefix": "canvas--",
            "canvasclass": DOM.canvasclass,
        });
        //console.log(sk);
        return sk;

        let html = `<div style="min-width:${this.graphinfo.width}px; min-height:${this.graphinfo.height}px;" class="${DOM.canvasdivclass}" id="${DOM.canvasdivid}">`;
        html += `<canvas class="${DOM.canvasclass}" id="${DOM.staticcanvasid}" style="z-index:1"></canvas>`;
        html += `<canvas class="${DOM.canvasclass}" id="${DOM.dynamiccanvasid}" style="z-index:2"></canvas>`;
        html += `</div>`;
        html = html.replace(new RegExp(`${VAR}id${VAR}`, "g"), id);
        return html;
    }

    /**
        Inserts the HTML for a CanvasElement onto the page
        @param {string} containerid HTML id of parent element
        @param {int} id Unique id to be included in the HTML elements
    */
    insertHTML(containerid, id) {
        super.insertHTML(containerid, this.getHTML(id));
        this.init(id);
    }

    init(id) {
        this.GraphCanvasController = new GraphCanvasController(id, this);
    }
}

