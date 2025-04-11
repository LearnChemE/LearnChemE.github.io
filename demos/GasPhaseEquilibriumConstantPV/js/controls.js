//const selectionElement = document.getElementById('selection');
const heightSlider3 = document.getElementById('height-slider3');
const heightSlider2 = document.getElementById('height-slider2');


//const playButton = document.getElementById("play");
//const pauseButton = document.getElementById("pause");

heightSlider3.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  let pressure = Number(heightSlider3.value);
  const heightLabel3 = document.getElementById("height-value3");
  heightLabel3.innerHTML = pressure.toFixed(2);
  
});

heightSlider2.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  let moles = Number(heightSlider2.value);
  const heightLabel2 = document.getElementById("height-value2");
  heightLabel2.innerHTML = moles.toFixed(2);
  
});