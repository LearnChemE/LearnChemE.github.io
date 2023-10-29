var P = 50;
var T = 300;
var nN2 = 0;
var nH2 = 0;
var nNH3 = 1;

// ----------------------------------------------------------------


const barLabels = ['N\u2082', 'H\u2082', 'NH\u2083'];
const labels = ['', '', ''];

chartDataset = [nN2, nH2, nNH3]

const data = {
  labels: labels,
  datasets: [{
    label: 'mol',
    data: chartDataset,
    backgroundColor: [
      'rgba(54, 162, 235, 0.2)',
      'rgba(25, 250, 0, 0.2)',
      'rgba(255, 99, 132, 0.2)'
    ],
    borderColor: [
      'rgb(54, 162, 235)',
      'rgb(25, 250, 0)',
      'rgb(255, 99, 132)'
    ],
    borderWidth: 1,
    datalabels: {
      color: 'blue',
      anchor: 'end',
      align: 'top',
      offset: 5,

    }
  }]
};

const config = {
  type: 'bar',
  data: data,
  plugins: [ChartDataLabels],
  responsive: true,
  options: {
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      },
      datalabels: {
        formatter: function (value, context) {
          return barLabels[context.dataIndex] + ' = ' + value;
        },
        font: function (context) {
          var width = context.chart.width;
          var size;
          if (width < 400) {
            size = 12;
          } else if (width < 800) {
            size = 16;
          } else {
            size = 18;
          }
          return {
            size: size
          };
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 12,
        ticks: {
          font: function (context) {
            var width = context.chart.width;
            var size;
            if (width < 400) {
              size = 10;
            } else if (width < 800) {
              size = 16;
            } else {
              size = 20;
            }
            return {
              size: size
            };
          }
        },
        title: {
          display: true,
          text: 'equilibrium amount (mol)',
          font: function (context) {
            var width = context.chart.width;
            var size;
            if (width < 400) {
              size = 10;
            } else if (width < 600) {
              size = 12;
            } else {
              size = 18;
            }
            return {
              size: size
            };
          }
        },
        grid: {
          display: false,
          drawOnChartArea: true,
          drawTicks: true,
        }
      },
      x: {
        grid: {
          display: false,
          drawOnChartArea: true,
          drawTicks: true,
        }
      }
    },

  },
};

// --------------------------------


updatePressure = (value) => {
  document.getElementById('pressureValue').innerText = value;
  P = value;
  updateChart();
}

updateTemperature = (value) => {
  document.getElementById('temperatureValue').innerText = value;
  T = value;
  updateChart();
}

updateN2Mole = (value) => {
  document.getElementById('N2MoleValue').innerText = value;
  nN2 = value;
  updateChart();
}

updateH2Mole = (value) => {
  document.getElementById('H2MoleValue').innerText = value;
  nH2 = value;
  updateChart();
}

updateNH3Mole = (value) => {
  document.getElementById('NH3MoleValue').innerText = value;
  nNH3 = value;
  updateChart();
}

updateChart = () => {
  result = calculateEquilibrium(P, T, nN2, nH2, nNH3);
  chartDataset[0] = result[0];
  chartDataset[1] = result[1];
  chartDataset[2] = result[2];
  myChart.update()
}


function initValues() {
  document.getElementById('pressureValue').innerText = 50;
  document.getElementById('temperatureValue').innerText = 300;
  document.getElementById('N2MoleValue').innerText = 0;
  document.getElementById('H2MoleValue').innerText = 0;
  document.getElementById('NH3MoleValue').innerText = 1;
}


//  ----------------------------------------------------------------

function calculateEquilibrium(P, T, nN2, nH2, nNH3) {
  const R = 8.314;
  const deltaH = -92200;
  const deltaS = -198.75;
  const keq = Math.exp(-((deltaH - T * deltaS) / (R * T)));

  const gamma = [0, 1, 3, -2];
  const nadd = [0, nN2, nH2, nNH3];

  function nEQ(i, x) {
    return nadd[i] - gamma[i] * x;
  }

  function total(x) {
    return nEQ(1, x) + nEQ(2, x) + nEQ(3, x);
  }

  function z(i, x) {
    return nEQ(i, x) / total(x);
  }

  function k(x) {
    return Math.pow((z(1, x) * P), -gamma[1]) *
      Math.pow((z(2, x) * P), -gamma[2]) *
      Math.pow((z(3, x) * P), -gamma[3]);
  }

  let x = 0;
  let minDiff = Infinity;
  let zeta = 0;
  for (let i = 0; i < 10; i += 0.01) {
    let diff = Math.abs(keq - k(i));
    if (diff < minDiff) {
      minDiff = diff;
      zeta = i;
    }
  }

  let nN2Final = nEQ(1, zeta).toFixed(3);
  let nH2Final = nEQ(2, zeta).toFixed(3);
  let nNH3Final = nEQ(3, zeta).toFixed(3);

  if (nN2Final < 0)
    nN2Final = 0
  if (nH2Final < 0)
    nH2Final = 0
  if (nNH3Final < 0)
    nNH3 = 0

  return [nN2Final, nH2Final, nNH3Final];
}

// ----------------------------------------------------------------


window.addEventListener('resize', function () {
  myChart.resize();
});

initValues();
var canvas = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(canvas, config);


