const sharedLoop = require("../../../single_stage_manualonly/src/js/shared_loop").sharedLoop;

function loop(sk) {
  sk.draw = () => {
    sharedLoop(sk);
  }
}

module.exports = loop;