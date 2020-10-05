// This code is only run once when the page loads to initialize the plot.
// More information for formatting the chart at https://github.com/flot/flot/blob/master/API.md
// Also see http://www.flotcharts.org/

// This is the font for the tick labels ("0.0", "0.5", etc.). To modify the styling for the axis labels e.g. "time (s)" or "position (pixels)", you will need to do that in the style.css file.
let axisFont = {
  size : 16,
  lineHeight : 13,
  family : "sans-serif"
}

// More information on possible options at https://github.com/flot/flot/blob/master/API.md
// Unfortunately their documentation isn't as helpful as one would like, but it's worth looking at
let plotOptions = {
  
  xaxes: [
    { 
      position: "bottom",
      autoScale : "none",
      axisLabel : "time (s)",
      min: 0,
      max: 5
    },
    { 
      position: "top",
      autoScale : "none",
      axisLabel : "Plot Title",
      show: true,
      showTicks: false,
      showTickLabels: false,
      gridLines: false
    }
  ],
  yaxes: [
    {
      position: "left",
      axisLabel : "Velocity (m/s)",
      autoScale : "none",
      min : 0,
      max : 60,
      font : axisFont,
    },
  ],

}

// The initial data set is just a single point at [0, 0]
let data = [[
  [0, 0],
]];

// Finally, we create a global variable called "Plot" with the specified data and options.
let Plot = $.plot( //$for Jquery variable0
  $("#plot"),
  data,
  plotOptions
);
