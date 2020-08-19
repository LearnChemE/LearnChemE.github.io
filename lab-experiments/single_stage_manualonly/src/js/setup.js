const shared = require("./shared_setup");
const directionsHTML = require("../html/directions.html").toString();
shared.defineGlobals();

function setup(sk) {

  sk.setup = () => {
    shared.flotInit(false);
    shared.separatorInit(false);
    shared.rippleAnimation();
    shared.initialResize(sk);
    shared.initialFrameRate(sk);
    shared.clickUpdateButtons();
    shared.importDirections(directionsHTML, 1);
  }

  sk.windowResized = () => {
    const elementsToBeResized = shared.elementsToBeResized();
    shared.resizeElements(elementsToBeResized);
    shared.resizePlots();
  }
}

module.exports = setup;