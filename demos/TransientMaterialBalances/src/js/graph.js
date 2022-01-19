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
  // title: "Volume versus time",       // text above the plot
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
      range: [400, 600],
      step: 50,
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

gvs.CA_graph = new SVG_Graph({
  id: "CA-graph",                     // id of the container element
  classList: ["svg-plot"],           // classes to add to the plot container element
  // title: "Concentration of A versus time",       // text above the plot
  titleFontSize: 20,                 // font size of title, pixels
  padding: [[55, 20], [40, 50]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
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
      labels: ["C<sub>A</sub> (mol/L)", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [0, 6],
      step: 1,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelFontSize: 14,
      tickWidth: 0.5,
      tickLabelPrecision: 0,
      showZeroLabel: true,
    }
  }
});


gvs.h_graph = new SVG_Graph({
  id: "h-graph",                     // id of the container element
  classList: ["svg-plot"],           // classes to add to the plot container element
  // title: "Tank liquid height versus time",       // text above the plot
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
      labels: ["Liquid height (m)", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [0, 1.6],
      step: 0.4,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelFontSize: 14,
      tickWidth: 0.5,
      tickLabelPrecision: 1,
      showZeroLabel: true,
    }
  }
});


gvs.v_graph = new SVG_Graph({
  id: "v-graph",                     // id of the container element
  classList: ["svg-plot"],           // classes to add to the plot container element
  // title: "Volumetric flow rate (𝜈<sub>out</sub>) versus time",       // text above the plot
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
      labels: ["𝜈<sub>out</sub> (L/s)", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [15, 40],
      step: 5,
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
  resolution: 50,
  fill: "none",
  id: `V-curve`,
  classList: ["curve"],
  range: [0, gvs.V_array[gvs.V_array.length - 1][0]]
});

const CA_curve = gvs.CA_graph.addCurve(return_CA, {
  stroke: "rgba(0, 0, 0, 1)",
  strokeWidth: 2,
  resolution: 50,
  fill: "none",
  id: `CA-curve`,
  classList: ["curve"],
  range: [0, gvs.CA_array[gvs.CA_array.length - 1][0]]
});

const h_curve = gvs.h_graph.addCurve(return_h, {
  stroke: "rgba(0, 0, 0, 1)",
  strokeWidth: 2,
  resolution: 50,
  fill: "none",
  id: `h-curve`,
  classList: ["curve"],
  range: [0, gvs.h_array[gvs.h_array.length - 1][0]]
});

const v_curve = gvs.v_graph.addCurve(return_v, {
  stroke: "rgba(0, 0, 0, 1)",
  strokeWidth: 2,
  resolution: 50,
  fill: "none",
  id: `v-curve`,
  classList: ["curve"],
  range: [0, gvs.v_array[gvs.v_array.length - 1][0]]
});

function drawGraphs() {

  switch(gvs.plot_selection) {
    case "V" :
      V_curve.range = [0, gvs.V_array[gvs.V_array.length - 1][0]];
      if(V_curve.range[1] > gvs.V_graph.options.axes.x.range[1]) {
        gvs.V_graph.options.axes.x.range[1] *= 2;
        gvs.V_graph.options.axes.x.step *= 2;
        gvs.V_graph.redrawAxes();
      }
      const y_vals = [];
      
      gvs.V_array.forEach(coord => {
        y_vals.push(coord[1]);
      });

      const y_range = [Math.min.apply(this, y_vals), Math.max.apply(this, y_vals)];
      let update = false;
      if(y_range[0] < gvs.V_graph.options.axes.y.range[0]) {
        gvs.V_graph.options.axes.y.range[0] -= 100;
        update = true;
      }
      if(y_range[1] > gvs.V_graph.options.axes.y.range[1]) {
        gvs.V_graph.options.axes.y.range[1] += 100;
        update = true;
      }
      if(update) {
        if( (gvs.V_graph.options.axes.y.range[1] - gvs.V_graph.options.axes.y.range[0]) / gvs.V_graph.options.axes.y.step > 5 ) {
          gvs.V_graph.options.axes.y.step *= 2;
        }
        gvs.V_graph.redrawAxes();
      }
      V_curve.updateCoords();
      V_curve.drawCurve();
    break;

    case "CA":
      CA_curve.range = [0, gvs.CA_array[gvs.CA_array.length - 1][0]];
      if(CA_curve.range[1] > gvs.CA_graph.options.axes.x.range[1]) {
        gvs.CA_graph.options.axes.x.range[1] *= 2;
        gvs.CA_graph.options.axes.x.step *= 2;
        gvs.CA_graph.redrawAxes();
      }
      CA_curve.updateCoords();
      CA_curve.drawCurve();
    break;

    case "h":
      h_curve.range = [0, gvs.h_array[gvs.h_array.length - 1][0]];
      if(h_curve.range[1] > gvs.h_graph.options.axes.x.range[1]) {
        gvs.h_graph.options.axes.x.range[1] *= 2;
        gvs.h_graph.options.axes.x.step *= 2;
        gvs.h_graph.redrawAxes();
      }
      h_curve.updateCoords();
      h_curve.drawCurve();
    break;

    case "v":
      v_curve.range = [0, gvs.v_array[gvs.v_array.length - 1][0]];
      if(v_curve.range[1] > gvs.v_graph.options.axes.x.range[1]) {
        gvs.v_graph.options.axes.x.range[1] *= 2;
        gvs.v_graph.options.axes.x.step *= 2;
        gvs.v_graph.redrawAxes();
      }
      v_curve.updateCoords();
      v_curve.drawCurve();
    break;
  }

};

module.exports = drawGraphs;