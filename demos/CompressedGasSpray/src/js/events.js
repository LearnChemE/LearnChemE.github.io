import { drawAll } from './draw.js';

window.addEventListener('DOMContentLoaded', () => {
  drawAll();

  document.getElementById('playBtn').addEventListener('click', () => {
    console.log('Play clicked');
    
  });

  document.getElementById('pauseBtn').addEventListener('click', () => {
    console.log('Pause clicked');
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    console.log('Reset clicked');
    drawAll();
  });
});
