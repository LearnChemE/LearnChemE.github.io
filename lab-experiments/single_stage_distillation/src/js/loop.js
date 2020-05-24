function loop(sk) {
  sk.draw = () => {
    separator.advance();
    separator.createCoords();
    graphics.TPlot.plotDraw();
    graphics.PPlot.plotDraw();
    graphics.LPlot.plotDraw();
    // sk.noLoop();
  }
}

module.exports = loop;