import { drawAll } from './draw.js';

let animationId = null;

window.addEventListener('DOMContentLoaded', () => {
  drawAll();

  const playBtn  = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  playBtn.addEventListener('click', () => {
    console.log('Play clicked');
    drawAll(document.getElementById('graph-canvas').parentElement);
    if (animationId) cancelAnimationFrame(animationId);
    window.startSpray();       // turn on p5 spray lines
    window.graphData.start = null;
    animationId = requestAnimationFrame(animateGraph);
  });

  pauseBtn.addEventListener('click', () => {
    console.log('Pause clicked');
    window.stopSpray();
    if (animationId) cancelAnimationFrame(animationId);
  });

  resetBtn.addEventListener('click', () => {
    console.log('Reset clicked');
    window.stopSpray();
    if (animationId) cancelAnimationFrame(animationId);
    drawAll();
  });
});

function animateGraph(timestamp) {
  const gd = window.graphData;
  if (!gd.start) gd.start = timestamp;

  const elapsed = (timestamp - gd.start) / 1000;   // seconds
  const total   = gd.times[gd.times.length - 1];
  const frac    = Math.min(elapsed / total, 1);

  // redraw static graph
  drawAll();

  // compute dot position
  const idx = Math.floor(frac * (gd.times.length - 1));
  const xPos = gd.xScale(gd.times[idx]);
  const yPos = gd.yScale(gd.curves[gd.mode][idx]);

  const ctx = gd.canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(xPos, yPos, 5, 0, 2 * Math.PI);
  ctx.fill();

  if (frac < 1) {
    animationId = requestAnimationFrame(animateGraph);
  } else {
    window.stopSpray();
  }
}
