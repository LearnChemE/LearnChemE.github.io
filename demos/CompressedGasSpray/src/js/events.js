// import { triggerSpray, playMolecule, pauseMolecule, resetMolecule, drawAll } from './draw.js';

// document.addEventListener("DOMContentLoaded", () => {
//   // ——————————————
//   // 1) Mode‐button logic (moved from your HTML)
//   // ——————————————
//   const modeButtons = {
//     volume: document.getElementById('volumeBtn'),
//     moles: document.getElementById('molesBtn'),
//     temperature: document.getElementById('temperatureBtn'),
//     pressure: document.getElementById('pressureBtn'),
//   };
//   // set default
//   window.graphMode = 'volume';
//   drawAll();
//   // wire them
//   Object.entries(modeButtons).forEach(([mode, btn]) => {
//     if (!btn) return console.error(`Mode button ${mode} missing`);
//     btn.addEventListener('click', () => {
//       Object.values(modeButtons).forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');
//       window.graphMode = mode;
//       drawAll();
//     });
//   });

//   // ——————————————
//   // 2) Slider logic (moved from your HTML)
//   // ——————————————
//   const volSlider = document.getElementById('volumeFraction');
//   const timeSlider = document.getElementById('timeSprayed');
//   volSlider?.addEventListener('input', () => {
//     document.getElementById('volumeVal').textContent = volSlider.value;
//     drawAll();
//   });
//   timeSlider?.addEventListener('input', () => {
//     document.getElementById('timeVal').textContent = timeSlider.value;
//     drawAll();
//   });

//   // ——————————————
//   // 3) Play/Pause/Reset logic
//   // ——————————————
//   const playBtn = document.getElementById("play-button");
//   const pauseBtn = document.getElementById("pause-button");
//   const resetBtn = document.getElementById("reset-button");

//   playBtn?.addEventListener("click", () => {
//     triggerSpray(500);
//     playMolecule();
//     console.log("▶️ play clicked");
//   });
//   pauseBtn?.addEventListener("click", () => {
//     pauseMolecule();
//   });
//   resetBtn?.addEventListener("click", () => {
//     resetMolecule();
//   });
// });
