require("./style/style.scss");
require("./js/calcs.js");

const O2slider = document.getElementById("excessO2");

const oxidizerSelection = document.getElementById("oxidizer");

O2slider.addEventListener('input', (e) => {
  
  window.simulationSettings.excessO2 = O2slider.value;
  
  const T = window.findFlameTemp();

  document.getElementById("flameTemp").innerHTML = String(T).concat(" K");

  document.getElementById("excessO2label").innerHTML = `excess ${oxidizerSelection.value} = ${Number.parseInt(O2slider.value * 100)}%`;

});

oxidizerSelection.addEventListener('change', (e) => {
  
  window.simulationSettings.oxidizer = oxidizerSelection.value;
  
  const T = window.findFlameTemp();
  
  document.getElementById("flameTemp").innerHTML = String(T).concat(" K");

  document.getElementById("excessO2label").innerHTML = `excess ${oxidizerSelection.value} = ${Number.parseInt(O2slider.value * 100)}%`;

});

document.getElementById("fuel").addEventListener('change', (e) => {

  window.simulationSettings.fuel = e.srcElement.value;
  
  const T = window.findFlameTemp();
  
  document.getElementById("flameTemp").innerHTML = String(T).concat(" K");

});

const T = window.findFlameTemp();
document.getElementById("flameTemp").innerHTML = String(T).concat(" K");