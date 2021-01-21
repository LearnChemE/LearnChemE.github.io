const axisFont = {
  size : 13,
  lineHeight : 13,
  family : "sans-serif"
}

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
    points: { radius: 5, color: "rgb(0, 0, 0)", fillColor: "rgb(155, 205, 0)" },
  }

}

window.positionPlotData = [[0, 0]];

window.positionPlot = $.plot(
  $("#positionPlot"),
  [window.positionPlotData, [[0, 0]]],
  positionPlotOptions
);

window.positionPlot.getData()[1].lines.show = false;
window.positionPlot.getData()[1].points.show = true;
window.positionPlot.getData()[1].color = "rgb(0, 0, 0)";
window.positionPlot.getData()[1].points.fillColor = "rgb(155, 205, 0)";
window.positionPlot.setupGrid(true);
window.positionPlot.draw();

window.xab = 0;

const roughnessPlotOptions = {

  xaxes: [{
    position: "bottom",
    autoScale : "none",
    axisLabel : "Reynold's Number",
    font: axisFont,
    showTickLabels : "all",
    min: 5e4,
    max: 5e5,
    tickFormatter: function(n) {
      return String( Number(n).toExponential(0) ).replace("e+", `<tspan dy="-1" dx="0.5" style="font-size:0.8rem">x</tspan><tspan dy="1">10</tspan><tspan dy="-5" style="font-size: 0.8rem">`).concat("</tspan>");
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

  grid: {clickable: true}

}

const roughnessData = Object.values(window.dragCoeffs);
window.CdPlotCoord = [0, 0.3];

window.roughnessPlot = $.plot(
  $("#roughnessPlot"),
  [[[0, 0]]],
  roughnessPlotOptions
)

window.roughnessPlot.setData([
  { data : roughnessData[0] },
  { data : roughnessData[1] },
  { data : roughnessData[2] },
  { data : roughnessData[3] },
  { data : roughnessData[4] },
  { data: [window.CdPlotCoord] }
]);

const pointData = window.roughnessPlot.getData()[5];
pointData.points.show = true;
pointData.color = "rgb(0, 0, 0)";
pointData.points.fillColor = "rgb(155, 205, 0)";

window.roughnessPlot.setupGrid(true);
window.roughnessPlot.draw();

document.getElementById("reset-button").addEventListener("click", function() {
  window.isRunning = false;
  window.positionPlotData = [[0, 0]];
  window.positionPlot.setData([ { data : window.positionPlotData, lines: { show: true } }, { data : [[0, 0]], points : { show: true, color : "rgb(0, 0, 0)", fillColor: "rgb(155, 205, 0)" } }]);
  window.ballObj.resetLaunch();
  window.positionPlot.getData()[1].points.color = "rgb(0, 0, 0)";
  window.positionPlot.draw();
})