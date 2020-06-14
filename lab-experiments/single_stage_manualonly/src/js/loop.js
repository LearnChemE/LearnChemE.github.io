function loop(sk) {
  sk.draw = () => {
    separator.advance();
    separator.createCoords();
    graphics.TPlot.plotDraw();
    graphics.PPlot.plotDraw();
    graphics.LPlot.plotDraw();
    if(sk.frameCount < 2) {window.adjustSpeed(1)}
  }
}

module.exports = loop;