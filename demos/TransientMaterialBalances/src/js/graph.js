const { SVG_Graph } = require("./svg-graph-library.js");
gvs.SVG_Graph = SVG_Graph;

gvs.arrayInterpolation = function(arr, x) {
  let n = 0;
  let dif = 100000000;
  for(let i = 0; i < arr.length; i++) {
    const arr_x = arr[i][0];
    const new_dif = Math.abs(x - arr_x);
    if( new_dif < dif ) {
      dif = new_dif;
      n = i;
    }
  }

  let y = arr[n][1];

  if(x > arr[n][0]) {
    if(n < arr.length - 1 && n > 0) {
      if(arr[n + 1][0] > arr[n][0]) {
        const frac = ( x - arr[n][0] ) / ( arr[n + 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n + 1][1] - arr[n][1] );
      } else if( arr[n - 1][0] > arr[n][0] ) {
        const frac = ( x - arr[n][0] ) / ( arr[n - 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n - 1][1] - arr[n][1] );
      }
    }
  } else if( x < arr[n][0] ) {
    if(n < arr.length - 1 && n > 0) {
      if(arr[n + 1][0] < arr[n][0]) {
        const frac = ( x - arr[n][0] ) / ( arr[n + 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n + 1][1] - arr[n][1] );
      } else if( arr[n - 1][0] < arr[n][0] ) {
        const frac = ( x - arr[n][0] ) / ( arr[n - 1][0] - arr[n][0] );
        y = arr[n][1] + frac * ( arr[n - 1][1] - arr[n][1] );
      }
    }
  }

  return y
}

function return_V(x) {
  return gvs.arrayInterpolation(gvs.V_array, x)
}

function return_CA(x) {
  return gvs.arrayInterpolation(gvs.CA_array, x)
}

function return_h(x) {
  return gvs.arrayInterpolation(gvs.h_array, x)
}

function return_v(x) {
  return gvs.arrayInterpolation(gvs.v_array, x)
}

gvs.V_graph = new SVG_Graph({
  id: "V-graph",                     // id of the container element
  classList: ["svg-plot"],           // classes to add to the plot container element
  title: "Volume versus time",       // text above the plot
  titleFontSize: 20,                 // font size of title, pixels
  padding: [[65, 20], [40, 50]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
  parent: document.getElementById("plot-container"),             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
  axes: {
    axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
    x : {
      labels: ["", "Time (s)"],  // labels to add above the top x-axis and below the bottom x-axis
      labelFontSize: 17,             // font size of the label(s) (px)
      display: [true, true],         // choose whether to display the [top, bottom] x axes
      range: [0, 30],                 // the minimum and maximum values on the x-axis
      step: 5,                    // the numerical distance between major ticks on the x-axis
      minorTicks: 4,                 // number of minor ticks to put between each major tick
      majorTickSize: 2,              // the length (px) of the major ticks on the x-axis
      minorTickSize: 1,              // the length (px) of the minor ticks on the x-axis
      tickLabelFontSize: 14,         // font size of the tick labels (the numbers below the major ticks)
      tickWidth: 0.5,                // stroke width of the ticks (px)
      tickLabelPrecision: 0,         // digits of precision for the x-axis tick labels
      showZeroLabel: true,          // choose whether or not the "zero" value is displayed on the bottom-left part of the graph
    },
    y : {
      labels: ["Tank volume (L)", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [200, 800],
      step: 100,
      minorTicks: 4,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelFontSize: 14,
      tickWidth: 0.5,
      tickLabelPrecision: 0,
      showZeroLabel: true,
    }
  }
});

const V_curve = gvs.V_graph.addCurve(return_V, {
  stroke: "rgba(0, 0, 0, 1)",
  strokeWidth: 2,
  resolution: 100,
  fill: "none",
  id: `V-curve`,
  classList: ["curve"],
  range: [0, gvs.V_array[gvs.V_array.length - 1][0]]
});

function drawGraphs() {

  switch(gvs.plot_selection) {
    case "V" :
      V_curve.range = [0, gvs.V_array[gvs.V_array.length - 1][0]];
      V_curve.updateCoords();
      V_curve.drawCurve();
    break;

    case "CA":

    break;

    case "h":

    break;

    case "v":

    break;
  }

};

module.exports = drawGraphs;