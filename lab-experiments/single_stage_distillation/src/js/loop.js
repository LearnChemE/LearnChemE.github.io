function loop(sk) {
  sk.draw = () => {
    separator.advance();
    separator.createCoords();
    graphics.TPlot.draw();
    graphics.PPlot.draw();
    graphics.LPlot.draw();
    if(sk.frameCount < 2) {window.adjustSpeed(1)}
  }
}

module.exports = loop;