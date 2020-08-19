const shared = require("../../../single_stage_manualonly/src/js/shared_setup");
const directionsHTML = require("../html/directions.html").toString();
shared.defineGlobals();

function setup(sk) {

  sk.setup = () => {
    shared.flotInit(true);
    shared.separatorInit(true);
    shared.rippleAnimation();
    shared.initialResize(sk);
    shared.initialFrameRate(sk);
    shared.clickUpdateButtons();
    shared.importDirections(directionsHTML, "Directions: Part Two");
  }

  sk.windowResized = () => {

    const elementsToBeResized = shared.elementsToBeResized();

    const CodeInputArea = document.getElementById("CodeEntryArea");
    const CodeOutputArea = document.getElementById("TerminalOutputWrapper");

    const CodeInput = document.getElementById("code-input-wrapper");
    const CodeOutput = document.getElementById("code-output");

    elementsToBeResized.push([CodeInput, CodeInputArea]);
    elementsToBeResized.push([CodeOutput, CodeOutputArea]);

    shared.resizeElements(elementsToBeResized);
    shared.resizePlots();

    const bg = document.getElementById("OutermostWrapperIGuess");
    const codeOutput = document.getElementById("code-output");
    const codeInput = document.getElementById("code-input");
    const height = Number(bg.getBoundingClientRect().height);
    // can't do media queries because size is with respect to SVG height/width, not window height/width
    if(height < 580) {
      codeOutput.style.fontSize = "10px";
      codeOutput.style.padding = "6px";
      codeInput.style.fontSize = "12px";
    } else if(height < 750) {
      codeOutput.style.fontSize = "12px";
      codeOutput.style.padding = "8px";
      codeInput.style.fontSize = "13px";
    } else {
      codeOutput.style.fontSize = "14px";
      codeOutput.style.padding = "10px";
      codeInput.style.fontSize = "15px";
    }
  }
}

module.exports = setup;