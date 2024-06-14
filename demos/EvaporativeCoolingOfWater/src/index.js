import Chart from 'chart.js/auto';
import barChartConfig from './js/barChartConfig.js';
import { calculate } from './js/calculation.js';
import updateFigure from './js/figure.js';
require("bootstrap");
require("./style/style.scss");


var mass = 0;
var T2 = 40;
window.playing = false;

window.updateMass = (value, reset = false) => {
  if (reset) {
    window.playing = false;
    let temp_mass = mass;
    mass = 0;
    updateChart(false);
    mass = temp_mass;
    return;
  }
  document.getElementById('massValue').innerText = Number(value).toFixed(2);
  mass = value;
  updateChart(mass == 1.75 || window.playing);
}



window.play = () => {
  window.playing = !window.playing;
  const play_pause = document.getElementById("play-pause");
  const play = document.getElementById("play");
  const pause = document.getElementById("pause");
  if (window.playing) {
    play.style.display = "none";
    pause.style.display = "block";
  } else {
    play.style.display = "block";
    pause.style.display = "none";
  }
  updateChart(window.playing);
}

let reset = false;

window.reset = () => {
  reset = true;
  window.playing = false;
  clearInterval(intervalID);
  const slider = document.getElementById('mass');
  slider.value = 0; // Reset the slider to the beginning
  let calculated_data = calculate(0)
  myChart.config.data.datasets[0].data = [calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), calculated_data.V.toFixed(2)];
  window.updateMass(parseFloat(document.getElementById("mass").value), false);
  T2 = calculated_data.T2;
  updateFigure(calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), T2, false);
  myChart.update();
}

var intervalID = null;

function updateChart(simulate) {

  clearInterval(intervalID);

  if (!reset && simulate) {
    intervalID = setInterval(function() {
        let current_mass_evaporated = parseFloat(document.getElementById("mass").value);
        if (current_mass_evaporated < 1.75) {
          current_mass_evaporated += 0.01
          document.getElementById("mass").value = (current_mass_evaporated).toFixed(2);
        }
        mass = current_mass_evaporated;
        let calculated_data = calculate(mass)
        myChart.config.data.datasets[0].data = [calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), calculated_data.V.toFixed(2)];
        window.updateMass(parseFloat(document.getElementById("mass").value), false);
        T2 = calculated_data.T2;
        updateFigure(calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), T2, false);
        myChart.update();
      },
      30);
  } else if (!reset) {
    mass = parseFloat(document.getElementById("mass").value);
    let calculated_data = calculate(mass)
    myChart.config.data.datasets[0].data = [calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), calculated_data.V.toFixed(2)];
    T2 = calculated_data.T2;
    updateFigure(calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), T2, false);
    myChart.update();
  }

  reset = false;
}

function initValues() {
  document.getElementById('massValue').innerText = "0.00";
}

window.addEventListener('resize', function() {
  myChart.resize();
});

var canvas = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(canvas, barChartConfig);
window.addEventListener('resize', function() {
  myChart.resize();
});


initValues();