import ChartDataLabels from 'chartjs-plugin-datalabels';
const legends = ['acetylene', 'carbon dioxide', 'carbon monoxide', 'ethane', 'ethylene', 'helium', 'hydrogen', 'methane', 'nitrogen', 'oxygen'];
const labels = [];
for (let i = 0; i < 260; ++i) {
  labels.push(i.toString());
}
var selectedLegends;
var chartDataset = [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.005, 0.004, 0.003, 0.002];
var colourList = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'pink',
  'grey'
];



const data = {
  labels: labels,
  datasets: []
};

const lineChartConfig = {
  type: 'line',
  data: data,
  plugins: [ChartDataLabels],
  options: {
    animation: {
      duration: 0 // No animation
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },
      datalabels: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      y: {
        max: 0.0072,
        title: {
          display: true,
          text: 'mol fraction gas in water',
          font: function (context) {
            var width = context.chart.width;
            var size;
            if (width < 400) {
              size = 18;
            } else if (width < 800) {
              size = 20;
            } else {
              size = 26;
            }
            return {
              size: size,
            };
          }
        },
        ticks: {
          font: function (context) {
            var width = context.chart.width;
            var size;
            if (width < 400) {
              size = 14;
            } else if (width < 800) {
              size = 16;
            } else {
              size = 20;
            }
            return {
              size: size,
            };
          }
        },
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        max: 251,
        beginAtZero: true,
        title: {
          display: true,
          text: "Temperate (°C)",
          font: {
            size: 20,
            weight: 'bold',
          },
        },
        ticks: {
          font: function (context) {
            var width = context.chart.width;
            var size;
            if (width < 400) {
              size = 12;
            } else if (width < 800) {
              size = 14;
            } else {
              size = 16;
            }
            return {
              size: size,
            };
          },
          callback: function (value, index, values) {
            return index % 50 === 0 ? value : undefined;
          }
        },
        grid: {
          display: true,
          drawOnChartArea: false,
          drawTicks: true,
          tickMarkLength: 10,
          zeroLineWidth: 10,
          zeroLineColor: '#000',
          zeroLineBorderDash: [],
          zeroLineBorderDashOffset: 0,
          offsetGridLines: false,
          borderDash: [],
          borderDashOffset: 0,
          lineWidth: function (context) {
            // Draw a line for every 10th tick
            return context.tick.value % 10 === 0 ? 1 : 0;
          }
        }
      }
    }
  }
};


function updateLineChart(legendsSelected, elementValues, isPChanged) {
  data.datasets = [];
  for (let i = 0; i < 10; i++) {
    data.datasets.push({
      data: elementValues[i],
      borderColor: colourList[i],
      backgroundColor: colourList[i],
      label: legends[i],
      borderWidth: 0,
    });
  }

  const values = Object.values(legendsSelected);
  let count = 0;
  for (let i = 0; i < data.datasets.length; i++) {
    if (!values[i]) {
      data.datasets.splice(i - count, 1);
      count++;
    }
  }

  if (!isPChanged) {
    let flatData = data.datasets.flatMap(dataset => dataset.data);
    let maxVal = Math.max(...flatData);
    lineChartConfig.options.scales.y.max = maxVal + 0.00001;
  }
}

export { lineChartConfig, updateLineChart };
