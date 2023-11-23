import Chart from 'chart.js/auto';
import { barChartConfig, updateBarChart } from './js/barChartConfig.js';
import { lineChartConfig, updateLineChart } from './js/lineChartConfig.js';
import { calculateOutput, calculateContinousOutput } from './js/calculation.js';
require("bootstrap");
require("./style/style.scss");

var selectedLabels = {
  acetylene: true,
  carbonDioxide: true,
  carbonMonoxide: true,
  ethane: true,
  ethylene: true,
  helium: true,
  hydrogen: true,
  methane: true,
  nitrogen: true,
  oxygen: true
}

var outputValues = [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.005, 0.004, 0.003, 0.002];

var P = 5;
var T = 0;
var isTemperatureSelected = true;

window.updatePressure = (value) => {
  document.getElementById('pressureValue').innerText = value;
  P = value;
  performComputation();
}

window.changeChart = () => {
  isTemperatureSelected = !isTemperatureSelected;
  var barChart = document.getElementById('barChart');
  var lineChart = document.getElementById('lineChart');
  const temperatureDiv = document.getElementById('temperatureDiv');

  if (barChart.style.display === "none") {
    barChart.style.display = "block";
    lineChart.style.display = "none";
    temperatureDiv.style.opacity = '100';  // Removed !important
  } else {
    barChart.style.display = "none";
    lineChart.style.display = "block";
    temperatureDiv.style.opacity = '0';
  }
  performComputation();
}


window.updateTemperature = (value) => {
  document.getElementById('temperatureValue').innerText = value;
  T = value;
  performComputation();
}

document.querySelectorAll('input[name="element"]').forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    selectedLabels[checkbox.id] = checkbox.checked;
    if (isTemperatureSelected) {
      updateBarChart(selectedLabels, outputValues);
      barChart.update();
    }
    else {
      updateLineChart(selectedLabels, outputValues, false);
      lineChart.update();
    }
  });
});

function performComputation() {
  if (isTemperatureSelected) {
    document.getElementById("temperatureDiv").style.display = "block";
    outputValues = calculateOutput(T, P);
    updateBarChart(selectedLabels, outputValues, true);
    barChart.update();
  }
  else {
    outputValues = calculateContinousOutput(T, P);
    document.getElementById("temperatureDiv").style.display = "none";
    updateLineChart(selectedLabels, outputValues, true);
    lineChart.update();
  }
}

function init() {
  document.getElementById('pressureValue').innerText = 5;
  document.getElementById('temperatureValue').innerText = 0;
  performComputation();
}

var barChartCanvas = document.getElementById('barChart').getContext('2d');
var barChart = new Chart(barChartCanvas, barChartConfig);
var lineChartCanvas = document.getElementById('lineChart').getContext('2d');
var lineChart = new Chart(lineChartCanvas, lineChartConfig);
init();
window.addEventListener('resize', function () {
  barChart.resize();
  lineChart.resize();
});