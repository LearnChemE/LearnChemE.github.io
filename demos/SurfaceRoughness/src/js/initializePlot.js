const axisFont = {
  size : 16,
  lineHeight : 13,
  family : "sans-serif"
}

const positionPlotOptions = {
  
  xaxes: [
    { 
      position: "bottom",
      autoScale : "none",
      axisLabel : "x-position (m)",
      min: 0,
      max: 200
    },
    { 
      position: "top",
      autoScale : "none",
      axisLabel : "",
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

}

window.positionPlotData = [
  [0, 0],
];

window.positionPlot = $.plot(
  $("#positionPlot"),
  [window.positionPlotData],
  positionPlotOptions
);

window.xab = 0;

const roughnessPlotOptions = {

  xaxis: {
    position: "bottom",
    autoScale : "none",
    axisLabel : "x-position (m)",
    showTickLabels : "all",
    min: 5e4,
    max: 5.2e6,
    tickFormatter: function(n) {
      return String( Number(n).toExponential(0) ).replace("e+", `<tspan dy="-1" dx="0.5" style="font-size:0.8rem">x</tspan><tspan dy="1">10</tspan><tspan dy="-5" style="font-size: 0.8rem">`).concat("</tspan>");
    },
    transform: function (v) { return Math.log(v); },
    inverseTransform: function (v) { return Math.exp(v); }
  },

  yaxis: {
    position: "left",
    axisLabel : "y-position (m)",
    autoScale : "none",
    min : 0,
    max : 0.55,
    font : axisFont,
  },

  series: {
    lines: { lineWidth: 2 }
  },

  grid: {clickable: true}

}

const roughnessData = Object.values(window.dragCoeffs);

window.roughnessPlot = $.plot(
  $("#roughnessPlot"),
  [[[0, 0]]],
  roughnessPlotOptions
)

window.dataPoints0 = [];

// $("#roughnessPlot").bind("plotclick", function ( event, pos, item ) {

//   window.dataPoints0.push([pos.x, pos.y]);

// })

window.roughnessPlot.setData([
  { data : roughnessData[0] },
  { data : roughnessData[1] },
  { data : roughnessData[2] },
  { data : roughnessData[3] },
  { data : roughnessData[4] },
]);

window.roughnessPlot.setupGrid(true);
window.roughnessPlot.draw();