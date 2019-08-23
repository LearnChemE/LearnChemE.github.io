import {DOM} from "./DOM.js";
import {QuestionElement} from "./QuestionElement.js";

const VAR = "@";

/**
    Container class for textbox-entry questions
*/
export class TextboxElement extends QuestionElement{
    /**
        @param {object} inputarguments
        @param {string} inputarguments.placeholder Placeholder text in textbox
        @param {string} inputarguments.answertype "number" or "text"
        @param {float|string} inputarguments.answer Correct answer
        @param {object} inputarguments.tolerance Range above or below answer to count as correct
        @param {int} inputarguments.points Number of points question is worth
    */
    constructor(inputarguments) {
        super(inputarguments);
    }
    /**
        Checks the answer of the TextboxElement
        @param {float|string} answer The user-submitted answer
        @return {float} Correctness (0 to 1)
    */
    checkanswer(answer) {
        if (this.answertype === "number") {
            // If user entered a number as 45%, convert to 0.45
            if (answer.slice(-1) === "%") {
                answer = parseFloat(answer) / 100;
            }
            if (parseFloat(answer) >= this.answer - this.tolerance && parseFloat(answer) <= this.answer + this.tolerance) {
                return 1;
            } else {
                return 0;
            }
        } else if (this.answertype === "text") {
            if (answer.toUpperCase().trim() === this.answer.toUpperCase().trim()) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    /**
        Generates the HTML for this element
        @param {int} id Unique id to be included in the HTML elements
    */
    getHTML(id) {
        let html = `<div class="${DOM.textboxdivclass}">`;
        html += `<input class="${DOM.textboxclass}" placeholder="${this.placeholder}" id="${DOM.textboxid}">`;
        html += `<br><br>`
        html += `<span class="${DOM.textboxanswerclass}" id="${DOM.textboxanswerid}"></span>`;
        html += `</input></div>`;
        html = html.replace(new RegExp(`${VAR}id${VAR}`, "g"), id);
        return html;
    }
    /**
        Inserts the HTML for this element
        @param {string} containerid HTML id of parent element
        @param {int} id Unique id to be included in the HTML elements
    */
    insertHTML(containerid, id) {
        super.insertHTML(containerid, this.getHTML(id));
    }
}
