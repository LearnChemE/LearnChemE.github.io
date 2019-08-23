import {DOM} from "./DOM.js";
import {CanvasElement} from "./CanvasElement.js";
import {TextElement} from "./TextElement.js";
import {TextboxElement} from "./TextboxElement.js";
import {recursiveFind, recursiveNumberfy, recursiveReplace, recursiveExists, generateVariables} from "./sky-helpers.js";

/**
    Container class for each question <br>
    Consists of elements displayed sequentially on the page
*/
const VAR = "@";
export class Question {
    /**
        @param {object} inputarguments
        @param {object} inputarguments.variables: Data for variables used in problem
        @param {list} inputarguments.questionelements List of question element data objects
        @param {float} inputarguments.requiredscore Required % score to move on (0 to 1)
    */
    constructor(inputarguments) {
        this.variables = {"constants":{},
                          "random":{},
                          "calculated":{}};
        this.elements = [];
        this.html = "";
        for (let key of Object.keys(inputarguments)) {
            this[key] = inputarguments[key];
        }
        if ("variables" in inputarguments) {
            this.variables = JSON.parse(JSON.stringify(inputarguments.variables));
        }
        this.createHTML(inputarguments.questionelements);
    }

    /**
        Creates the appropriate class for a given element
        @param {object} elementdata The data object containing everything about the element
        @param {string} elementdata.type "text", "graph", or "textbox"
        @return {TextElement|CanvasElement|TextboxElement} The class instance for the element
    */
    createElement(elementdata) {
        if (elementdata.type === "textbox") {
            return new TextboxElement(elementdata);
        } else if (elementdata.type === "graph") {
            return new CanvasElement(elementdata);
        } else if (elementdata.type === "text") {
            return new TextElement(elementdata);
        }
    }

    /**
        TODO
    */
    createHTML(inputelements, recursion = 0) {
        for (let element of inputelements) {
            // Swap between rows and columns
            if (recursion % 2 == 0) {
                this.html += `<div class="row">`;
            } else {
                this.html += `<div class="column">`;
            }
            // If an array is found, call recursively, otherwise add element html
            if (element instanceof Array) {
                this.createHTML(element, recursion+1);
            } else {
                this.elements.push(this.createElement(JSON.parse(JSON.stringify(element))));
                this.html += this.elements[this.elements.length - 1].getHTML(this.elements.length-1);
            }
            // Finish row/column
            this.html += `</div>`;
        }
    }

    /**
        The total point worth of the question
    */
    get totalPoints() {
        let total = 0;
        for (let element of this.elements) {
            if (element.points) {
                total += element.points;
            }
        }
        return total;
    }

    /**
        Replace variable placeholders with values in all contained elements
    */
    assignVariables() {
        for (let element of this.elements) {
            // Prevent infinite recursion
            const maxloops = 100;
            let loops = 0;
            while (recursiveExists(element, `${VAR}`)) {
                for (let variable of Object.keys(this.variablevalues)) {
                    // Replace variable strings with values
                    element = recursiveReplace(element, `${VAR}${variable}${VAR}`, this.variablevalues[variable]);
                }
                loops++;
                if (loops >= maxloops) {
                    console.log('assignVariables failed:', recursiveFind(element, `${VAR}`));
                    break;
                }
            }
            // Convert number-like strings into numbers
            element = recursiveNumberfy(element);
        }
    }

    /**
        Display this question
        @param {object} parentvariables Variable values from parent (ProblemController)
    */
    display(parentvariables) {
        // console.log('my Tsum:', this.variables.Tsum);
        this.variables = {"constants":{}, "random":{}, "calculated":{}};
        for (let name of Object.keys(parentvariables)) {
            // If variable is not defined more locally
            if (!(name in this.variables.constants)) {
                // Inherit variable from parent
                // console.log('setting', this.variables.constants[name],'to', parentvariables[name]);
                this.variables.constants[name] = parentvariables[name];
            }
        }
        // Generate variable values
        this.variablevalues = {};
        this.variablevalues = generateVariables(this.variables);
        // Replace variables in html
        const maxloops = 100;
        let loops = 0;
        while (this.html.indexOf(`${VAR}`) > -1) {
            for (let variable of Object.keys(this.variablevalues)) {
                this.html = this.html.replace(`${VAR}${variable}${VAR}`, this.variablevalues[variable]);
            }
            loops++;
            if (loops >= maxloops) {
                console.log('assign variables in html failed:', this.html);
                console.log(`${this.html.indexOf(VAR)}`);
                break;
            }
        }
        // Replace variables in elements
        this.assignVariables();
        // Insert question HTML
        document.getElementById(DOM.questiondivid).insertAdjacentHTML("beforeend", this.html);
        // Create GraphCanvasController objects for each CanvasElement
        for (let i in this.elements) {
            if (this.elements[i] instanceof CanvasElement) {
                this.elements[i].init(i);
            }
        }
    }

    /**
        Check answers and display correct ones
        @return {score} Score object containing "got", "max", and "pct" keys
    */
    submit() {
        // Add up score and reveal answers
        let score = {"max": 0,
                     "got": 0,
                     "pct": 0};
        for (let i in this.elements) {
            let element = this.elements[i];
            if (element instanceof TextboxElement) {
                const re = new RegExp(`${VAR}id${VAR}`, "g");
                // Disable textbox
                document.getElementById(DOM.textboxid.replace(re, i)).disabled = true;
                // Get answer from textbox
                let ans = document.getElementById(DOM.textboxid.replace(re, i)).value;
                // Check answer
                score.max += element.points;
                score.got += (element.points * element.checkanswer(ans));
                // Display answer
                document.getElementById(DOM.textboxanswerid.replace(re, i)).textContent = element.answer;
                // Add box around answer
                document.getElementById(DOM.textboxanswerid.replace(re, i)).classList.add(DOM.textboxanswershown);
                document.getElementById(DOM.textboxanswerid.replace(re, i)).classList.add("fadein");
            } else if (element instanceof CanvasElement) {
                // Get answers from canvas
                let ans = element.GraphCanvasController.getanswers();
                // Check answers
                score.max += element.points;
                score.got += (element.points * element.checkanswer(ans));
                element.GraphCanvasController.showanswers(element.answer);
            }
            score.pct = score.got / score.max;
        }
        return score;
    }
}
