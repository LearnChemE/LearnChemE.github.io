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
        max: 250,
        beginAtZero: true,
      }

    }
  }
};


function updateLineChart(legendsSelected, elementValues) {
  data.datasets = [];
  for (let i = 0; i < 10; i++) {
    data.datasets.push({
      data: elementValues[i],
      borderColor: colourList[i],
      backgroundColor: colourList[i],
      label: legends[i],
      borderWidth: 2,
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

}


export { lineChartConfig, updateLineChart };
