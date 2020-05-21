function loop(sk) {
  sk.draw = () => {
    separator.advance();
    separator.createCoords();
    graphics.TPlot.plotDraw();
    graphics.PPlot.plotDraw();
    graphics.LPlot.plotDraw();
  }
}

module.exports = loop;