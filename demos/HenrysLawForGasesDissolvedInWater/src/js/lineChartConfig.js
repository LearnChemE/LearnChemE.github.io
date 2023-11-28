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
      tooltip: {
        enabled: true,
        callbacks: {
          title: function (tooltipItems) {
            let tooltipItem = tooltipItems[0];
            // This will set the title of the tooltip to 'T = x °C'
            return tooltipItem.dataset.label + ' T = ' + tooltipItem.parsed.x + ' °C';
          },
          label: function (tooltipItem) {
            // This will set the label of the tooltip to 'Custom Label'
            return tooltipItem.parsed.y + ' mol fraction of gas in water';
          }
        }
      }
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
          }, stepSize: 0.001,
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
  const keys = Object.keys(legendsSelected);
  for (let i = 0; i < 10; i++) {
    if (legendsSelected[keys[i]]) { // Check if the legend is selected      
      data.datasets.push({
        data: elementValues[i],
        borderColor: colourList[i],
        backgroundColor: colourList[i],
        label: legends[i],
        borderWidth: 0.1,
        pointRadius: 1.1,
      });
    }
  }

  if (!isPChanged) {
    let flatData = data.datasets.flatMap(dataset => dataset.data);
    let maxVal = Math.max(...flatData);
    lineChartConfig.options.scales.y.max = maxVal + 0.0001;
    let stepSize = maxVal / 7;
    lineChartConfig.options.scales.y.ticks.stepSize = stepSize;
  }
}

export { lineChartConfig, updateLineChart };
