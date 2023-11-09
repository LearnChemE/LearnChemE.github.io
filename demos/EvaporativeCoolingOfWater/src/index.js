import p5 from 'p5';
import Chart from 'chart.js/auto';
import barChartConfig from './js/barChartConfig.js';
import { calculate } from './js/calculation.js';
import updateFigure from './js/figure.js';
require("bootstrap");
require("./style/style.scss");




var mass = 0;
var T2 = 40;

window.updateMass = (value) => {
  document.getElementById('massValue').innerText = value;
  mass = value;
  updateChart(0);
}

window.play = () => {
  updateChart(1);
  updateFigure(100)
}

var intervalID = null;

function updateChart(simulate) {

  clearInterval(intervalID);
  let calculated_data;
  let temp_mass = 0;
  if (simulate == 1 && mass != 0) {
    intervalID = setInterval(function () {
      calculated_data = calculate(temp_mass)
      myChart.config.data.datasets[0].data = [calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), calculated_data.V.toFixed(2)];
      T2 = calculated_data.T2;
      myChart.update();

      updateFigure(calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), T2, false);
      temp_mass = temp_mass + 0.01;
      document.getElementById('massValue').innerText = temp_mass.toFixed(2);
      document.getElementById('mass').value = temp_mass.toFixed(2);
      if (temp_mass >= mass) {
        updateChart(0);
        clearInterval(intervalID);
      }
      if (temp_mass == mass && mass == 1.75)
        updateFigure(calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), T2, true);
    }, 50);
  }
  else {
    debugger;
    calculated_data = calculate(mass)
    myChart.config.data.datasets[0].data = [calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), calculated_data.V.toFixed(2)];
    T2 = calculated_data.T2;
    myChart.update();

    updateFigure(calculated_data.L.toFixed(2), calculated_data.S.toFixed(2), T2, mass == 1.75);
  }
}

function initValues() {
  document.getElementById('massValue').innerText = 0;
}

window.addEventListener('resize', function () {
  myChart.resize();
});

var canvas = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(canvas, barChartConfig);
window.addEventListener('resize', function () {
  myChart.resize();
});


initValues();

