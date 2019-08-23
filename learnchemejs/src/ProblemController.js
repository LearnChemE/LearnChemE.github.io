import {DOM} from "./DOM.js";
import {Question} from "./Question.js";
import {Modal} from "./Modal.js"
import {roundTo, getCookie, setCookie, generateVariables} from "./sky-helpers.js";

const VAR = "@";
const textScoreButtonShow = "▲ Show Score ▲";
const textScoreButtonHide = "▼ Hide Score ▼";
const textFeedackButton = "Give Feedback";
const textRestartButton = "Restart Problem";
const textHintButton = "Hint";
const textSubmitButton = "Submit Answer";
const textNextButton = "Next Part";

// Old test URLs, under mirrorcoloured@gmail.com
//const gradecatcherURL = "https://script.google.com/macros/s/AKfycbzNPmE7Qx1mLXdwIvP8FyWVyDdR8FQ-ymkAFyiNcF4QC4zvVwM/exec";
//const feedbackcatcherURL = "https://script.google.com/macros/s/AKfycbyKAKkuvF87WdWUvhHbhbXvjqz3d0qBST7eJIzOTPkNhw9qKuOg/exec";

// URLs to web apps to collect info
const gradecatcherURL = "https://script.google.com/macros/s/AKfycbzFyWWUzGbucE6zlFRtaU__iImClayuS_i4cLQY/exec";
const feedbackcatcherURL = "https://script.google.com/macros/s/AKfycbzrf2_4peZHz_xVyNmHK9zBuF4U5qzdPB6sV2nqKg/exec";

/**
    Master class for controlling page <br>
    Each problem consists of a series of {@link Question}s
*/
export class ProblemController {
    /**
        @param {object} inputarguments
        @param {string} inputarguments.title Title to be displayed at the top of the page and as the html page title
        @param {object} inputarguments.inputvariables Data for variables used in problem
        @param {list} inputarguments.questions List of objects containing data for each {@link Question}
        @param {object} inputarguments.finish Object containing data for display of finishing page
    */
    constructor(inputarguments, containerid) {
        this.inputarguments = inputarguments;
        this.containerid = containerid;
        this.init(this.inputarguments, this.containerid);

        // Catch keyboard events
        document.body.addEventListener("click", e => this.clickEvent(e));
        document.addEventListener("keydown", e => this.keyEvent(e));
    }

    init(inputarguments, containerid) {
        // Insert main page containers
        let html = `<div id=${DOM.problemdivid}>`;
            html += `<div id="${DOM.titledivid}"></div>`;
            html += `<div id="${DOM.stepdivid}"></div>`;
            //html += `<hr>`;
            html += `<div id="${DOM.questiondivid}"></div>`;
            //html += `<hr>`;
            html += `<div id="${DOM.buttonsdivid}"></div>`;
            html += `<div id="${DOM.scoredivid}" class="${DOM.hiddenclass}"></div>`;
            html += `<div id="${DOM.gradedivid}"></div>`;
            html += `<div id=${DOM.modaldivid}></div>`;
        html += `</div>`;
        document.getElementById(containerid).insertAdjacentHTML("beforeend", html);

        // Create begin button
        this.insertButton(DOM.buttonsdivid, DOM.beginbuttonid, "Begin", () => this.begin());

        // Set problem title
        this.title = inputarguments.pagetitle;
        document.title = this.title;
        document.getElementById(DOM.titledivid).insertAdjacentHTML("beforeend", this.title);
        document.getElementById(DOM.stepdivid).insertAdjacentHTML("beforeend", "Introduction");

        // Create questions
        this.questions = [];
        for (let q of inputarguments.questions) {
            this.questions.push(new Question(q));
        }
        this.finishquestion = new Question(inputarguments.finish);
        this.beginquestion = new Question(inputarguments.begin);

        // Create variables
        this.variablevalues = generateVariables(inputarguments.variables);

        // Initialize variables
        this.reviewing = false;
        this.hasbegun = false;
        this.finished = false;
        this.currentquestion = undefined;
        this.score = {};
        for (let i in this.questions) {
            this.score[i] = {"max": this.questions[i].totalPoints,
                             "got": 0,
                             "pct": 0};
        }

        // Create restart modal
        this.restartmodal = new Modal({
            parentid:DOM.modaldivid,
            modalid:DOM.restartmodal,
            modalclass:DOM.modalclass,
            headerstyle: {
                "color": "white",
                "background-color":"#BC5F50",
            },
            contentstyle: {},
            header:"Restart Problem",
            content:`You will lose all progress on the current problem. <br><br>Really start a new problem?<br><br><button id="${DOM.restartoneid}">Restart from step one</button><button id="${DOM.restartzeroid}">Restart from introduction</button><button id="${DOM.restartabortid}">No</button>`,
        });
        // Add event listeners to modal
        document.getElementById(DOM.restartabortid).addEventListener("click", () => this.restartmodal.hide());
        document.getElementById(DOM.restartzeroid).addEventListener("click", () => this.restart());
        document.getElementById(DOM.restartoneid).addEventListener("click", () => this.restartstepone());

        // Create modals
        this.createGradeSubmit();
        this.createFeedbackInput();

        // Show pre-question page
        this.beginquestion.display(this.variablevalues);
    }

    /**
    *   Restart the problem
    */
    promptrestart() {
        this.restartmodal.show();
    }

    /**
    *   Restart from step one (skipping introduction)
    */
    restartstepone() {
        this.restart();
        this.begin();
    }

    /**
    *   Restart from introduction (step zero)
    */
    restart() {
        // Hide modal
        document.getElementById(DOM.restartmodal).remove();
        // Clear container
        let me = document.getElementById(DOM.problemdivid);
        me.parentNode.removeChild(me);
        // Start new problem
        this.init(this.inputarguments, this.containerid);
    }

    /**
    *   Focus window (remove focus from currently focused element)
    */
    defocus() {
        // Give the document focus
        window.focus();

        // Remove focus from any focused element
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }

    /**
     * Handler for click events
     */
    clickEvent(e) {
        // If score button or div was not clicked, hide the div
        if (this.hasbegun) {
            let scoreClick = false;
            for (let p of e.path) {
                if (p.id == "scorediv" || p.id == "scorebutton") {
                    scoreClick = true;
                }
            }
            scoreClick ? null : this.hidescore();
        }
    }

    /**
        Handler for keypress events
    */
    keyEvent(e) {
        // Process keypress
        switch(e.key) {
            case "Enter":
                // If not in a modal
                if (!this.feedbackmodal.showing && !this.grademodal.showing) {
                    // Ignore activating whatever is selected
                    e.preventDefault();
                    // Progress through the problem
                    if (!this.hasbegun) {
                        this.begin();
                    } else if (!this.finished && !this.reviewing) {
                        this.submit();
                    } else if (!this.finished && this.reviewing) {
                        this.next();
                    }
                }
                break;
            case "F2":
                if (this.hasbegun) {
                    this.togglescore();
                }
                break;
        }
    }

    /**
        Removes all html elements from the question div, clearing the page for the next question
    */
    clearPage() {
        // Clear question objects from html
        let container = document.getElementById(DOM.questiondivid);
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }
    }

    /**
        Inserts the HTML for grading submission input
    */
    insertScoreInput() {
        // Create submission button
        this.insertButton(DOM.buttonsdivid, DOM.showgradebuttonid, "Submit for Grade", () => this.grademodal.show());

        this.createGradeSubmit();

        document.getElementById(DOM.gradeformid).addEventListener("submit", e => this.submitForGrade(e));
    }

    /**
    *
    */
    createFeedbackInput() {
        if (this.feedbackmodal != undefined) {
            this.feedbackmodal.remove();
            this.feedbackmodal = undefined;
        }
        this.feedbackmodal = new Modal({
            parentid:DOM.modaldivid,
            modalid:DOM.feedbackmodal,
            modalclass:DOM.modalclass,
            headerstyle: {
                "color": "black",
                "background-color":"lightgray",
            },
            contentstyle: {},
            header:"Feedback",
            content:(function () {
                let feedbackmodalhtml = `<form id="${DOM.feedbackformid}" method="POST" class="pure-form pure-form-stacked" data-email="SOMEEMAIL@email.net"
        action="${feedbackcatcherURL}">`;
                feedbackmodalhtml += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Name (optional)</span><br><input class="${DOM.textboxclass}" id="${DOM.feedbacknametextid}"></input></div>`;
                feedbackmodalhtml += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">E-mail address (optional)</span><br><input class="${DOM.textboxclass}" id="${DOM.feedbackemailtextid}" type="email"></input></div>`;
                feedbackmodalhtml += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Feedback</span><br><textarea class="${DOM.textboxclass}" id="${DOM.feedbackinputtextid}" required></textarea></div>`;
                feedbackmodalhtml += `<button id="${DOM.submitfeedbackbuttonid}">Submit</button>`;
                feedbackmodalhtml += `<p id=${DOM.feedbackservererrorid} class="hidden error">Error while submitting feedback to server. Check console for detailed http report.</p>`
                feedbackmodalhtml += `</form>`;
                return feedbackmodalhtml;
            })(),
        });
        document.getElementById(DOM.feedbackformid).addEventListener("submit", e => this.submitFeedback(e));
    }

    /**
    *
    */
   createGradeSubmit() {
    if (this.grademodal != undefined) {
        this.grademodal.remove();
        this.grademodal = undefined;
    }
    this.grademodal = new Modal({
        parentid:DOM.modaldivid,
        modalid:DOM.gradesubmitmodal,
        modalclass:DOM.modalclass,
        headerstyle: {
            "color": "white",
            "background-color":"#123456",
        },
        contentstyle: {},
        header:"Submit Grade",
        content:(function () {
            let grademodalhtml = `<form id="${DOM.gradeformid}" method="POST" class="pure-form pure-form-stacked" data-email="SOMEEMAIL@email.net"
      action="${gradecatcherURL}">`;
            grademodalhtml += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Name:</span><br><input class="${DOM.textboxclass}" id="${DOM.gradenametextid}" required></input></div>`;
            grademodalhtml += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Student ID:</span><br><input class="${DOM.textboxclass}" id="${DOM.gradecuidtextid}" required></input></div>`;
            grademodalhtml += `<div class="${DOM.textboxdivclass}"><span class="${DOM.textboxspanclass}">Course code:</span><br><input class="${DOM.textboxclass}" id="${DOM.gradecoursetextid}" required></input></div>`;
            grademodalhtml += `<button id="${DOM.submitgradebuttonid}">Submit</button>`;
            grademodalhtml += `<p id=${DOM.gradeservererrorid} class="hidden error">Error while submitting grade to server. Check console for detailed http report.</p>`
            grademodalhtml += `</form>`;
            return grademodalhtml;
        })(),
    });
}

    /**
        Submits grade to spreadsheet <br>
        Followed example at: https://github.com/dwyl/learn-to-send-email-via-google-script-html-no-server
    */
    submitForGrade(e) {
        this.disableElement(DOM.submitgradebuttonid);
        document.getElementById(DOM.gradeservererrorid).classList.add(DOM.hiddenclass);
        e.preventDefault();     // Prevent default form submission, use xhr
        let data = this.getGradeSubmissionData();

//        if (data.cuid.length != 9) {
//            console.log('BAD ID LENGTH');
//            return false;
//        } else if (data.name.length === 0) {
//            console.log('BAD NAME LENGTH');
//            return false;
//        } else if (parseFloat(data.course.length) <= 0) {
//            console.log('BAD COURSE ID');
//            return false;
//        } else {
            const url = e.target.action;
            const method = 'POST';
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.status == 200) {
                    document.getElementById(DOM.gradeformid).innerHTML = "Your grade has been submitted."
                } else {
                    document.getElementById(DOM.submitgradebuttonid).classList.remove(DOM.disabledclass);
                    document.getElementById(DOM.gradeservererrorid).classList.remove(DOM.hiddenclass);
                    console.log(xhr.status, xhr.statusText, xhr.responseText);
                }
                return;
            };
            var encoded = Object.keys(data).map(function(k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
            }).join('&');
            xhr.send(encoded);
//        }
    }

    submitFeedback(e) {
        this.disableElement(DOM.submitfeedbackbuttonid);
        document.getElementById(DOM.feedbackservererrorid).classList.add(DOM.hiddenclass);
        e.preventDefault();     // Prevent default form submission, use xhr
        let data = this.getFeedbackSubmissionData();

        const url = e.target.action;
        const method = 'POST';
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.status == 200) {
                document.getElementById(DOM.feedbackformid).innerHTML = "Thank you, your feedback has been recorded.";
                setTimeout(() => this.createFeedbackInput(), 3000);
            } else {

                document.getElementById(DOM.submitfeedbackbuttonid).classList.remove(DOM.disabledclass);
                document.getElementById(DOM.feedbackservererrorid).classList.remove(DOM.hiddenclass);
                console.log(xhr.status, xhr.statusText, xhr.responseText);
            }
            return;
        }.bind(this);
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
        }).join('&');
        xhr.send(encoded);
    }

    /**
    *
    */
    showfeedback() {
        this.feedbackmodal.show();
        document.getElementById(DOM.feedbacknametextid).focus();
    }

    /**
     * Gathers data from the page to submit to the spreadsheet
     * @return {object} Data that will be passed to the web server
     */
    getGradeSubmissionData() {
        let data = {};
        data.course = document.getElementById(DOM.gradecoursetextid).value;
        data.title = this.title;
        data.name = document.getElementById(DOM.gradenametextid).value;
        data.cuid = document.getElementById(DOM.gradecuidtextid).value;
        data.score = this.sumScore().pct.toFixed(2);

        data.formDataNameOrder = JSON.stringify(["course", "title", "name", "cuid", "score"]); // The data, in order, that is inserted into the sheet
        data.formGoogleSheetName = data.course; // The subsheet to insert data onto

        return data;
    }

    /**
     * Gathers data from the page to submit to the spreadsheet
     * @return {object} Data that will be passed to the web server
     */
    getFeedbackSubmissionData() {
        let data = {};
        data.title = this.title;
        data.name = document.getElementById(DOM.feedbacknametextid).value;
        data.email = document.getElementById(DOM.feedbackemailtextid).value;
        data.feedback = document.getElementById(DOM.feedbackinputtextid).value;
        data.variables = JSON.stringify(this.variablevalues);
        data.score = JSON.stringify(this.score);
        data.currentquestion = this.currentquestion + 1;
        data.formDataNameOrder = `["title", "name", "email", "feedback", "question", "score", "variables"]`; // The data, in order, that is inserted into the sheet
        data.formGoogleSheetName = "feedback"; // The subsheet to insert data onto

        return data;
    }

    /**
        Gets the total score for the problem
        return {object} Score object containing "got", "max", and "pct" keys
    */
    sumScore() {
        let sumscore = 0;
        let sumpoints = 0;
        for (let i in this.score) {
            sumscore += this.score[i].got;
            sumpoints += this.score[i].max;
        }
        return {
            "got": sumscore,
            "max": sumpoints,
            "pct": sumscore / sumpoints,
        };
    }

    /**
    *
    */
    togglescore() {
        if (document.getElementById(DOM.scorebuttonid).textContent == textScoreButtonShow) {
            this.showscore();
        } else {
            this.hidescore();
        }
    }

    /**
    *
    */
    hidescore() {
        document.getElementById(DOM.scoredivid).classList.add(DOM.hiddenclass);
        document.getElementById(DOM.scorebuttonid).textContent = textScoreButtonShow;
    }

    /**
    *
    */
    showscore() {
        document.getElementById(DOM.scoredivid).classList.remove(DOM.hiddenclass);
        document.getElementById(DOM.scorebuttonid).textContent = textScoreButtonHide;
    }

    /**
        Update score summary table on page
    */
    updateScores() {
        let container = document.getElementById(DOM.scoredivid);

        // Clear score objects from html
        while (container.hasChildNodes()) {
            container.firstChild.remove();
        }

        // Create new score object
        //let html = `<div id=${DOM.scoretitleid}>SCORE</div>`;
        let html = ``;
        html += "<table>";
        html += "<tr><th>Step</th><th>Points</th><th>Total</th><th>Pct</th></tr>";
        for (let i in this.score) {
            // Apply formatting to current question
            let cur = "";
            if (i == this.currentquestion) {
                cur = DOM.currentquestionid;
            }
            html += `<tr><td id="${cur}">${parseFloat(i)+1}</td><td>${roundTo(this.score[i].got, 2)}</td><td>${roundTo(this.score[i].max, 2)}</td><td>${roundTo(this.score[i].pct*100, 0)}%</td></tr>`;
        }
        const sumscore = this.sumScore();
        html += `<tr id="${DOM.lastscorerowid}"><td>Total</td><td>${roundTo(sumscore.got, 2)}</td><td>${roundTo(sumscore.max, 2)}</td><td>${roundTo(sumscore.pct * 100,0)}%</td></tr>`;
        html += "</table>";

        container.insertAdjacentHTML("beforeend", html);
    }

    /**
        Insert a dismissable tip box on the page
        @param {string} tip Text content
        @param {int} left Left position of box (in px)
        @param {int} top Top position of box (in px)
        @param {string} uuid Unique id
    */
    insertTipBox(tip, left, top, uuid) {
        const COOKIEEXPIRATION = 30*1000; // In milliseconds
        let container = document.getElementById(DOM.problemdivid);
        // Generate uuid from tip string
        uuid = tip.hashCode();
        // If haven't been told to not show
        if (!getCookie(uuid) === true) {
            // Create id strings
            const re = new RegExp(`${VAR}id${VAR}`, "g");
            const divid = DOM.tipboxdivid.replace(re, uuid);
            const checkid = DOM.tipboxcheckid.replace(re, uuid);
            const buttonid = DOM.tipboxbuttonid.replace(re, uuid);
            // Create html payload for tip
            let html = `<div class="${DOM.tipboxdivclass}" id="${divid}" style="left: ${left}px; top:${top}px;">
                        <span class="${DOM.tipboxtextclass}">${tip}</span>
                        <br>
                        <input type="checkbox" id="${checkid}">
                        <span class="${DOM.tipboxdontshowclass}">don't show this again</span>
                        <button class="${DOM.tipboxbuttonclass}" id="${buttonid}">OK</button>
                        </div>`;
            // Function for closing tip and creating cookie
            let f = function() {
                //console.log("I am tip #", uuid);
                // Set cookie if told to not show again
                if (document.getElementById(checkid).checked) {
                    setCookie(uuid, true, COOKIEEXPIRATION);
                }
                document.getElementById(divid).remove();
            }
            // Add box to html
            container.insertAdjacentHTML("beforeend", html);
            // Create event listener on button
            document.getElementById(buttonid).addEventListener("click", e => f(e));
        }
    }

    /**
        Display current question to page
    */
    display() {
        // Clear current page elements
        document.getElementById(DOM.questiondivid).classList.remove("fadein");
        this.clearPage();
        if (this.currentquestion > -1) {
            // Add current question objects to html
            if (this.currentquestion < this.questions.length) {
                // TODO remove this if wrapper, instead remove event from Next button
                this.questions[this.currentquestion].display(this.variablevalues);
                // Fade in new elements
                document.getElementById(DOM.questiondivid).classList.add("fadein");
            }
        }
        this.updateScores();
        // Slide scores off screen

        /*      TEST COOKIE TIPS
        this.insertTipBox("Interact with the graph by clicking and dragging elements", 270, 300);
        this.insertTipBox("Type answers into text fields (case insensitive)", 530, 720);
        this.insertTipBox("Click here to start over with new values", 2, 890);
        this.insertTipBox("Click here to get a hint on the current step", 206, 890);
        this.insertTipBox("Click here to check your answers and move on to the next step", 410, 890);
        //*/
    }

    /**
        Repeat the current question
    */
    repeat() {
        this.currentquestion--;
        this.next();
    }

    /**
    *   Inserts HTML for a button with specified properties <br>
    *   Uses weird string calling because arrow functions are odd
    *   @param {string} containerid ID of container element for button
    *   @param {string} buttonid ID of button
    *   @param {string} buttontext Text to display in button
    *   @param {string} callback Name of function in {@link ProblemController}
    *   @param {string} [location="beforeend"] Where to insert html in container
    */
    insertButton(containerid, buttonid, buttontext, callback, location="beforeend") {
        let container = document.getElementById(containerid);
        let html = `<button id="${buttonid}">${buttontext}</button>`;
        container.insertAdjacentHTML(location, html);
        document.getElementById(buttonid).addEventListener("click", callback);
    }

    /**
    *
    */
    removeElement(elementid) {
        if (document.getElementById(elementid)) {
            document.getElementById(elementid).remove();
        } else {
            console.log(`element ${elementid} does not exist`);
            console.trace();
        }
    }

    /**
    *
    */
    enableElement(elementid) {
        document.getElementById(elementid).classList.remove(DOM.disabledclass);
    }

    /**
    *
    */
    disableElement(elementid) {
        document.getElementById(elementid).classList.add(DOM.disabledclass);
    }

    /**
    *
    */
    hideElement(elementid) {
        document.getElementById(elementid).classList.add(DOM.hiddenclass);
    }

    /**
    *
    */
    showElement(elementid) {
        document.getElementById(elementid).classList.remove(DOM.hiddenclass);
    }

    /**
     *  Begin the question
     */
    begin() {
        this.hasbegun = true;
        this.removeElement(DOM.beginbuttonid);
        this.insertButton(DOM.buttonsdivid, DOM.scorebuttonid, textScoreButtonShow, () => this.togglescore());
        this.insertButton(DOM.buttonsdivid, DOM.feedbackbuttonid, textFeedackButton, () => this.showfeedback());
        this.insertButton(DOM.buttonsdivid, DOM.restartbuttonid, textRestartButton, () => this.promptrestart());
        this.insertButton(DOM.buttonsdivid, DOM.hintbuttonid, textHintButton, () => this.showhint());
        this.insertButton(DOM.buttonsdivid, DOM.submitbuttonid, textSubmitButton, () => this.submit());
        this.insertButton(DOM.buttonsdivid, DOM.nextbuttonid, textNextButton, () => this.next());

        // Start question sequence
        this.currentquestion = -1;
        this.next();
    }

    /**
        Show the hints for the current {@link Question}
    */
    showhint() {
        this.disableElement(DOM.hintbuttonid);
        // Loop through all hints, remove hidden text class
        let elements = document.getElementsByClassName(DOM.hiddentextclass);
        while (elements[0]) {
            elements[0].classList.add("fadein");
            elements[0].classList.remove(DOM.hiddentextclass);
        }
    }

    /**
        Check user-submitted answers, show correct answers, update score
    */
    submit() {
        this.reviewing = true;
        this.showElement(DOM.nextbuttonid);
        // Update score for this question, call Question.submit
        this.score[this.currentquestion] = this.questions[this.currentquestion].submit();
        if (this.score[this.currentquestion].pct >= this.questions[this.currentquestion].requiredscore) {
            // If on last question, adjust button label and click event
            if (this.currentquestion == this.questions.length - 1) {
                document.getElementById(DOM.nextbuttonid).textContent = "Finish";
                document.getElementById(DOM.nextbuttonid).addEventListener("click", e => this.finish(e));
            }
        } else {
            document.getElementById(DOM.nextbuttonid).textContent = "Retry";
        }
        this.disableElement(DOM.submitbuttonid);
        this.showElement(DOM.nextbuttonid);
        if (this.score[this.currentquestion].pct < 1) {
            this.showhint();
        }
        this.updateScores();
        this.defocus();
    }

    /**
        Finish reviewing correct answers, move on to the next question
    */
    next() {
        this.reviewing = false;
        if (this.currentquestion < this.questions.length - 1) {
            this.hideElement(DOM.nextbuttonid);//this.hideElement(DOM.nextbuttonid);
            this.enableElement(DOM.submitbuttonid);
            this.enableElement(DOM.hintbuttonid);

            this.currentquestion++;
            this.display();
            document.getElementById(DOM.stepdivid).innerHTML = `Step ${this.currentquestion+1} / ${this.questions.length}`;

            window.scrollTo(0,0); // Move to top of page
        } else {
            this.finish();
        }
        this.defocus();
    }

    /**
        Finish the problem, display the finishing page
    */
    finish() {
        if (!this.finished) {
            this.finished = true;
            document.getElementById(DOM.questiondivid).classList.remove("fadein");
            this.clearPage();
            this.removeElement(DOM.hintbuttonid);
            this.removeElement(DOM.submitbuttonid);
            this.removeElement(DOM.nextbuttonid);
            this.insertScoreInput();
            this.updateScores();
            this.finishquestion.display(this.variablevalues);
            document.getElementById(DOM.stepdivid).innerHTML = ``;
            document.getElementById(DOM.questiondivid).classList.add("fadein");
            document.getElementById(DOM.scoredivid).classList.remove(DOM.hiddenclass);
        }
    }
}
