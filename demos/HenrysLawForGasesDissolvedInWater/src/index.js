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
  performComputation(true, false, false);
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
  performComputation(false, false, true);
}


window.updateTemperature = (value) => {
  document.getElementById('temperatureValue').innerText = value;
  T = value;
  performComputation(false, true, false);
}

document.querySelectorAll('input[name="element"]').forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    selectedLabels[checkbox.id] = checkbox.checked;
    performComputation(false, false, false, true);
    // if (isTemperatureSelected) {
    //   updateBarChart(selectedLabels, outputValues, true);
    //   barChart.update();
    // }
    // else {
    //   updateLineChart(selectedLabels, outputValues, false);
    //   lineChart.update();
    // }
  });
});

function performComputation(isPChanged, isTChanged, isChartChanged, elementChange = false) {
  if (isChartChanged) {
    updatePressure(5);
  }
  if (isTemperatureSelected) {
    document.getElementById("temperatureDiv").style.display = "block";
    outputValues = calculateOutput(T, P);
    if (!elementChange) {
      updateBarChart(selectedLabels, outputValues, isPChanged || isTChanged);
    }
    else {
      let arrayList = calculateOutput(T, 5);
      let finalList = []
      for (let i = 0; i < arrayList.length; i++) {
        if (selectedLabels[Object.keys(selectedLabels)[i]]) {
          finalList.push(arrayList[i])
        }
      }
      let maxOutputValue = finalList.flat().reduce((a, b) => Math.max(a, b));
      updateBarChart(selectedLabels, outputValues, isPChanged || isTChanged, maxOutputValue);
    }
    barChart.update();

  }
  else {
    outputValues = calculateContinousOutput(T, P);
    document.getElementById("temperatureDiv").style.display = "none";
    var maxValue = calculateContinousOutput(T, 5).flat().reduce((a, b) => Math.max(a, b));
    console.log(maxValue)
    updateLineChart(selectedLabels, outputValues, isPChanged);
    lineChart.update();
  }
}

function init() {
  document.getElementById('pressureValue').innerText = 5;
  document.getElementById('temperatureValue').innerText = 0;
  performComputation(false, false, false);
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