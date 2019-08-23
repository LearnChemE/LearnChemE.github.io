/**
    Generic element for display on page
*/
export class QuestionElement {
    constructor(inputarguments) {
        for (let key of Object.keys(inputarguments)) {
            this[key] = inputarguments[key];
        }
    }
    /**
        Inserts the HTML for a QuestionElement onto the page
        @param {string} containerid HTML id of parent element
        @param {string} html The HTML representation of the desired element
    */
    insertHTML(containerid, html) {
        let container = document.getElementById(containerid);
        container.insertAdjacentHTML("beforeend", html);
    }
}
