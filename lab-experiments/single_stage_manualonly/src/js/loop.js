const sharedLoop = require("./shared_loop").sharedLoop;

function loop(sk) {
  sk.draw = () => {
    sharedLoop(sk);
  }
}

module.exports = loop;