const axisFont = {
  size : 14,
  lineHeight : 13,
  family : "sans-serif"
}

window.lineColors = [
  "rgb(0, 0, 0)",
  "rgb(255, 160, 122)",
  "rgb(255, 200, 255)",
  "rgb(128, 220, 0)",
  "rgb(0, 0, 0)",
  "rgb(0, 0, 255)",
  "rgb(0, 0, 0)",
]

const positionPlotOptions = {
  
  xaxes: [
    { 
      position: "bottom",
      autoScale : "none",
      axisLabel : "x-position (m)",
      font: axisFont,
      min: 0,
      max: 200
    },
    { 
      position: "top",
      autoScale : "none",
      axisLabel : "Trajectory",
      font : axisFont,
      show: true,
      showTicks: false,
      showTickLabels: false,
      gridLines: false
    }
  ],
  yaxes: [
    {
      position: "left",
      axisLabel : "y-position (m)",
      autoScale : "none",
      min : 0,
      max : 150,
      font : axisFont,
    },
  ],
  series: {
    lines: { lineWidth: 2 },
    points: { radius: 5, color: "rgb(0, 0, 0)" },
  }

}

window.positionLineData = [[0, 0]];
window.positionPointData = [[0, 0]];

window.positionPlot = $.plot(
  $("#positionPlot"),
  [window.positionLineData, window.positionPointData],
  positionPlotOptions
);

window.positionPlot.getData()[1].lines.show = false;
window.positionPlot.getData()[1].points.show = true;
window.positionPlot.getData()[1].color = "rgb(0, 0, 0)";

window.positionPlot.setupGrid(true);
window.positionPlot.draw();

const lc = document.getElementById("legend-container");
const rp = document.getElementById("roughnessPlot");
const rect = rp.getBoundingClientRect();
const left = rect.left;
const top = rect.top;
const wrp = rect.width;
const wlc = lc.getBoundingClientRect().width;

lc.style.left = `${left + wrp - wlc + 50}px`;
lc.style.top = `${top - 50}px`;

const roughnessPlotOptions = {

  xaxes: [{
    position: "bottom",
    autoScale : "none",
    axisLabel : "Reynold's Number",
    font: axisFont,
    showTickLabels : "all",
    min: 5e4,
    max: 1e6,
    tickFormatter: function(n) {
      n /= 10**5;
      n = Number(n).toFixed(1);
      return `${n}<tspan dy="-1" dx="0.5" style="font-size:0.8rem">x</tspan><tspan dy="1">10</tspan><tspan dy="-5" style="font-size: 0.8rem">5</tspan>`;
    },
    transform: function (v) { return Math.log(v); },
    inverseTransform: function (v) { return Math.exp(v); }
  },
  { 
    position: "top",
    autoScale : "none",
    axisLabel : "Drag",
    font : axisFont,
    show: true,
    showTicks: false,
    showTickLabels: false,
    gridLines: false
  }],

  yaxis: {
    position: "left",
    axisLabel : "Drag Coefficient",
    autoScale : "none",
    min : 0,
    max : 0.6,
    font : axisFont,
  },

  series: {
    lines: { lineWidth: 2 },
    points: { radius: 5 }
  },

  colors: window.lineColors,

  grid: {
    labelMargin: 0
  },

  legend: {
    show: true,
    backgroundColor: "white",
    labelFormatter: function(label, series) {
      if ( label === "none" ) {
        return null
      } else {
        return label
      }
    },
    container: document.getElementById("legend-container"),
    margin: 20,
  },

}

const dragCoefficientValues = Object.values(window.dragCoeffs);
window.CdPlotCoord = [0, 0.3];

window.roughnessPlot = $.plot(
  $("#roughnessPlot"),
  [[], [], [], [], [], []],
  roughnessPlotOptions
)

window.roughnessPlot.setData([
  { data : dragCoefficientValues[0], label: "golf ball" },
  { data : dragCoefficientValues[1], label: "ε/D = 0.0125" },
  { data : dragCoefficientValues[2], label: "ε/D = 0.005" },
  { data : dragCoefficientValues[3], label: "ε/D = 0.0015" },
  { data : dragCoefficientValues[4], label: "smooth" },
  { data: [window.CdPlotCoord], label: "none", color: "rgb(0, 0, 0)" }
]);

const pointData = window.roughnessPlot.getData()[5];
pointData.points.show = true;
pointData.lines.show = false;

window.roughnessPlot.setupGrid(true);
window.roughnessPlot.draw();

document.getElementById("reset-button").addEventListener("click", function() {
  window.isRunning = false;
  window.positionLineData = [[0, 0]];
  window.positionPointData = [[0, 0]];
  window.positionPlot.getOptions().xaxes[0].max = 200;
  window.positionPlot.getOptions().yaxes[0].max= 150;
  window.positionPlot.setData([ 
    { data : window.positionLineData },
    { data : window.positionPointData, points : { show: true, color : "rgb(0, 0, 0)" } }
  ]);

  window.ballObj.resetLaunch();
  window.positionPlot.draw();
})