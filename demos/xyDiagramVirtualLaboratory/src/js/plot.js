gvs.plot = new gvs.SVG_Graph({
  id: "svg-plot",                  // id of the container element
  classList: ["svg-plot"],           // classes to add to the plot container element
  title: "",                         // text above the plot
  titleFontSize: 20,                 // font size of title, pixels
  padding: [[70, 20], [40, 50]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
  parent: document.getElementById("plot-container"),             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
  axes: {
    axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
    x : {
      labels: ["", "liquid mole fraction x"],  // labels to add above the top x-axis and below the bottom x-axis
      labelFontSize: 17,             // font size of the label(s) (px)
      display: [true, true],         // choose whether to display the [top, bottom] x axes
      range: [0, 1],                 // the minimum and maximum values on the x-axis
      step: 0.2,                    // the numerical distance between major ticks on the x-axis
      minorTicks: 3,                 // number of minor ticks to put between each major tick
      majorTickSize: 2,              // the length (px) of the major ticks on the x-axis
      minorTickSize: 1,              // the length (px) of the minor ticks on the x-axis
      tickLabelFontSize: 14,         // font size of the tick labels (the numbers below the major ticks)
      tickWidth: 0.5,                // stroke width of the ticks (px)
      tickLabelPrecision: 2,         // digits of precision for the x-axis tick labels
      showZeroLabel: false,          // choose whether or not the "zero" value is displayed on the bottom-left part of the graph
    },
    y : {
      labels: ["vapor mole fraction y", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [0, 1],
      step: 0.2,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelFontSize: 14,
      tickWidth: 0.5,
      tickLabelPrecision: 2,
      showZeroLabel: false,
    }
  }
});

const eq_curveOptions = {
  stroke: "rgba(0, 0, 255, 1)",         // color of the curve
  strokeWidth: 2,                     // stroke width of the curve (px)
  resolution: 100,                    // number of points to plot
  fill: "none",                       // whether to add fill. This option is incomplete. Example: "rgb(255, 0, 0)"
  id: `curve-(number)`,               // HTML id of the curve
  classList: ["curve"],               // classes to add to the curve
}
const eq_curve = gvs.plot.addCurve(gvs.yA, eq_curveOptions);

const xy_curveOptions = {
  stroke: "rgba(0, 0, 0, 1)",         // color of the curve
  strokeWidth: 1,                     // stroke width of the curve (px)
  resolution: 100,                    // number of points to plot
  fill: "none",                       // whether to add fill. This option is incomplete. Example: "rgb(255, 0, 0)"
  id: `curve-(number)`,               // HTML id of the curve
  classList: ["curve"],               // classes to add to the curve
}
const xy_curve = gvs.plot.addCurve(function(x) {return x}, xy_curveOptions);