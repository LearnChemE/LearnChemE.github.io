export function sharedLoop(sk, include_stpts) {
  if(!window.pauseSimulation) {
    separator.advance();
  }
  separator.createCoords(include_stpts);
  graphics.TPlot.draw();
  graphics.PPlot.draw();
  graphics.LPlot.draw();
  if(sk.frameCount < 2) {window.adjustSpeed(1)}
}