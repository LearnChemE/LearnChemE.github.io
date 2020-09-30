let axisFont = {
  size : 16,
  lineHeight : 13,
  family : "sans-serif"
}

let plotOptions = {
  
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

window.graphData = [
  [0, 0],
];

window.Plot = $.plot(
  $("#plot"),
  [window.graphData],
  plotOptions
);
