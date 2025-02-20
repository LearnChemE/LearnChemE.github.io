var P = 50;
var T = 300;
var nN2 = 0.1;
var nH2 = 0.1;
var nNH3 = 1;


// ----------------------------------------------------------------


const barLabels = ['N₂', 'H₂', 'NH₃'];
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

const imageSrc = 'equations.jpg';
const image = new Image();
image.src = imageSrc;

const customImagePlugin = {
  id: 'customImagePlugin',
  afterDraw: function (chart) {
    const ctx = chart.ctx;
    ctx.save();


    if (image.complete) {
      const x = 290;
      const y = 24;
      const width = 380;
      const height = 80;

      ctx.drawImage(image, x, y, width, height);
    }

    ctx.restore();
  }
};

const config = {
  type: 'bar',
  data: data,
  plugins: [ChartDataLabels, customImagePlugin],
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
            size = 18;
          } else {
            size = 26;
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
        max: 21,
        ticks: {
          callback: function (value, index, values) {
            return value === 21 ? '' : value;
          },
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


image.onload = function () {
  var canvas = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(canvas, config);
};
// --------------------------------

window.addEventListener('resize', function () {
  myChart.resize();
});

initValues();
var canvas = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(canvas, config);

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
  document.getElementById('N2MoleValue').innerText = 0.1;
  document.getElementById('H2MoleValue').innerText = 0.1;
  document.getElementById('NH3MoleValue').innerText = 1;
}



//  ----------------------------------------------------------------
// function calculateEquilibrium(P, T, nN2, nH2, nNH3) {
//   P = Number(P);
//   T = Number(T);
//   nN2 = Number(nN2);
//   nH2 = Number(nH2);
//   nNH3 = Number(nNH3);

//   const K_T_value = -23.84 + (11051 / T);
//   const K_T = parseFloat(Math.exp(K_T_value).toFixed(3));
//   const RHS = Math.pow(P, 2) * K_T;

//   let xi_lower = 0;
//   xi_upper = Math.min(xi_upper, nN2, nH2 / 3);

//   let xi = (xi_lower + xi_upper) / 2;
//   const tolerance = 0.001;
//   const maxIterations = 10000;

//   for (let i = 0; i < maxIterations; i++) {
//     let value = (25 * Math.pow((2 * xi + nNH3), 2)) / ((nN2 - xi) * (nH2 - 3 * xi));

//     if (Math.abs(value - RHS) < tolerance) {
//       break;
//     }

//     if (value < RHS) {
//       xi_lower = xi;
//     } else {
//       xi_upper = xi;
//     }
//     xi = (xi_lower + xi_upper) / 2;        
//   }

//   if (xi_upper - xi_lower > tolerance) {
//     console.log("Equilibrium not found within tolerance.");
//     return null;
//   }

//   let nN2Final = nN2 - xi;
//   let nH2Final = nH2 - (3 * xi);
//   let nNH3Final = Number(nNH3) + (2 * xi);
//   return [
//     parseFloat(nN2Final.toFixed(3)),
//     parseFloat(nH2Final.toFixed(3)),
//     parseFloat(nNH3Final.toFixed(3))
//   ];
// }

function calculateEquilibrium(P, T, nN2, nH2, nNH3) {
  P = Number(P);
  T = Number(T);
  nN2 = Number(nN2);
  nH2 = Number(nH2);
  nNH3 = Number(nNH3);

  const R = 8.314;
  const deltaH = -92200;
  const deltaS = -198.75;


  const K_T_value = -((deltaH - T * deltaS) / (R * T));
  const K_T = Math.exp(K_T_value);

  let xi_lower = 0;
  let xi_upper = Math.min(nN2, nH2 / 3, (nNH3 + nN2) / 2);

  let xi = (xi_lower + xi_upper) / 2;
  const tolerance = 0.000001;
  const maxIterations = 10000;

  for (let i = 0; i < maxIterations; i++) {

    const total = nN2 + nH2 + nNH3 - xi;
    const z1 = (nN2 - xi) / total;
    const z2 = (nH2 - 3 * xi) / total;
    const z3 = (nNH3 + 2 * xi) / total;


    const k = Math.pow(z1 * P, 1) * Math.pow(z2 * P, 3) / Math.pow(z3 * P, 2);

    if (Math.abs(k - K_T) < tolerance) {
      break;
    }

    if (k < K_T) {
      xi_lower = xi;
    } else {
      xi_upper = xi;
    }
    xi = (xi_lower + xi_upper) / 2;
  }

  if (xi_upper - xi_lower > tolerance) {
    console.log("Equilibrium not found within tolerance.");
    return null;
  }


  let nN2Final = nN2 - xi;
  let nH2Final = nH2 - 3 * xi;
  let nNH3Final = nNH3 + 2 * xi;

  return [
    parseFloat(nN2Final.toFixed(3)),
    parseFloat(nH2Final.toFixed(3)),
    parseFloat(nNH3Final.toFixed(3))
  ];
}


// ----------------------------------------------------------------


window.addEventListener('resize', function () {
  myChart.resize();
});

initValues();
var canvas = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(canvas, config);


