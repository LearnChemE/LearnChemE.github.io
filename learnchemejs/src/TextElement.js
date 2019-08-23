import {DOM} from "./DOM.js";
import {QuestionElement} from "./QuestionElement.js";

/**
    Container class for basic text display
*/
export class TextElement extends QuestionElement{
    /**
        @param {object} inputarguments
        @param {string} inputarguments.label Text to display
        @param {string} inputarguments.class CSS classes to apply
    */
    constructor(inputarguments) {
        super(inputarguments);
    }
    /**
        Generates the HTML for this element
        @param {object} DOM Document object model name associations
        @param {int} id Unique id to be included in the HTML elements
    */
    getHTML(id) {
        let html = `<span class="${DOM.textspanclass} ${this.class}">${this.label}</span>`;
        return html;
    }
    /**
        Inserts the HTML for a this element
        @param {object} DOM Document object model name associations
        @param {string} containerid HTML id of parent element
        @param {int} id Unique id to be included in the HTML elements
    */
    insertHTML(containerid, id) {
        super.insertHTML(containerid, this.getHTML(id));
    }
}
