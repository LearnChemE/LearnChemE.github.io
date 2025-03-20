const heightSlider3 = document.getElementById('height-slider-3');
const viscoSlider3 = document.getElementById('visco-slider-3');
const heightSlider2 = document.getElementById('height-slider2');
const viscoSlider2 = document.getElementById('visco-slider-2');

heightSlider3.addEventListener('input', function() {
  heightSlider3.setAttribute("max", String(0.99 - z.hMid));
  heightSlider3.setAttribute("value", String(0.99 - z.hMid));
  z.hTop = Number(heightSlider3.value);
  const heightLabel3 = document.getElementById("height-value3");
  heightLabel3.innerHTML = z.hTop.toFixed(2);
  heightSlider2.setAttribute("max", String(0.99 - z.hTop));
});

heightSlider2.addEventListener('input', function() {
  heightSlider2.setAttribute("max", String(0.99 - z.hTop));
  heightSlider2.setAttribute("value", String(0.99 - z.hTop));
  z.hMid = Number(heightSlider2.value);
  heightSlider3.setAttribute("max", String(0.99 - z.hMid));
  const heightLabel2 = document.getElementById("height-value2");
  heightLabel2.innerHTML = z.hMid.toFixed(2);
});

viscoSlider3.addEventListener('input', function() {
  z.muTop = Number(viscoSlider3.value);
  const viscoLabel3 = document.getElementById("visco-value3");
  viscoLabel3.innerHTML = z.muTop.toFixed(2);
});

viscoSlider2.addEventListener('input', function() {
  z.muMid = Number(viscoSlider2.value);
  const viscoLabel2 = document.getElementById("visco-value2");
  viscoLabel2.innerHTML = z.muMid.toFixed(2);
});