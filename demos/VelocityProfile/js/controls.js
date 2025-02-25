//const selectionElement = document.getElementById('selection');
const heightSlider3 = document.getElementById('height-slider3');
const viscoSlider3 = document.getElementById('visco-slider3');
const heightSlider2 = document.getElementById('height-slider2');
const viscoSlider2 = document.getElementById('visco-slider2');
//const playButton = document.getElementById("play");
//const pauseButton = document.getElementById("pause");



heightSlider3.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.hTop = Number(heightSlider3.value);
  const heightLabel3 = document.getElementById("height-value3");
  heightLabel3.innerHTML = z.hTop.toFixed(2);
  
});

viscoSlider3.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.muTop = Number(viscoSlider3.value);
  const viscoLabel3 = document.getElementById("visco-value3");
  viscoLabel3.innerHTML = z.muTop.toFixed(2);
  
});

heightSlider2.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.hMid = Number(heightSlider2.value);
  const heightLabel2 = document.getElementById("height-value2");
  heightLabel2.innerHTML = z.hMid.toFixed(2);
  
});

viscoSlider2.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.muMid = Number(viscoSlider2.value);
  const viscoLabel2 = document.getElementById("visco-value2");
  viscoLabel2.innerHTML = z.muMid.toFixed(2);
  
});