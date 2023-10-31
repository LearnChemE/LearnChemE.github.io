// import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const labels = ['liquid', 'solid', 'gas'];
let chartDataset = [10.00, 0.00, 0.00]

const data = {
  labels: labels,
  datasets: [{
    data: chartDataset,
    backgroundColor: [
      'blue',
      'cyan',
      'orange'
    ],
    borderColor: [
      'blue',
      'cyan',
      'orange'
    ],
    borderWidth: 1,
    datalabels: {
      color: 'black',
      anchor: 'end',
      align: 'top',
      offset: 0,

    }
  }]
};

const config = {
  type: 'bar',
  data: data,
  plugins: [ChartDataLabels],
  responsive: true,
  options: {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      },
      datalabels: {
        formatter: function (value, context) {
          return value + '\n kg';
        },
        align: 'center',
        anchor: 'center',
        font: function (context) {
          var width = context.chart.width;
          var size;
          if (width < 400) {
            size = 18;
          } else if (width < 800) {
            size = 20;
          } else {
            size = 22;
          }
          return {
            size: size,
          };
        }
      }
    },
    scales: {
      y: {
        display: false,
        max: 12,
      },
      x: {
        ticks: {
          color: 'black',  // add this if the labels are not visible
          font: {
            size: 18
          },
        },
        grid: {
          display: false,
          drawOnChartArea: true,
          drawTicks: true,
        },
      },
    },

  },
};

export default config;