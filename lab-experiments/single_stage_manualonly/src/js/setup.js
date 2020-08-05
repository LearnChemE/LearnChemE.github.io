const shared = require("./shared_setup");
shared.defineGlobals();

function setup(sk) {

  sk.setup = () => {
    shared.flotInit(false);
    shared.separatorInit(false);
    shared.rippleAnimation();
    shared.initialResize(sk);
    shared.initialFrameRate(sk);
  }

  sk.windowResized = () => {
    const elementsToBeResized = shared.elementsToBeResized();
    shared.resizeElements(elementsToBeResized);
    shared.resizePlots();
  }
}

module.exports = setup;