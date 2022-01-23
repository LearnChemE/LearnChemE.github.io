gvs.Hcurve = function(x) {
  return x * gvs.hA + ( 1 - x ) * gvs.hB + gvs.alpha * x * ( 1 - x )
}

gvs.partialMolar = function(x) {
  return ( gvs.hA - gvs.hB + gvs.alpha * ( 1 - gvs.xA ) - gvs.alpha * gvs.xA ) * ( x - gvs.xA ) + gvs.Hcurve( gvs.xA )
}

gvs.graph = new gvs.SVG_Graph({
  id: "svg-plot",                  // id of the container element
  classList: ["svg-plot"],           // classes to add to the plot container element
  title: "",                         // text above the plot
  titleFontSize: 20,                 // font size of title, pixels
  padding: [[70, 20], [50, 50]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
  parent: document.getElementById("plot-container"),             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
  axes: {
    axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
    x : {
      labels: ["", "mole fraction A"],  // labels to add above the top x-axis and below the bottom x-axis
      labelFontSize: 17,             // font size of the label(s) (px)
      display: [true, true],         // choose whether to display the [top, bottom] x axes
      range: [0, 1],                 // the minimum and maximum values on the x-axis
      step: 0.2,                    // the numerical distance between major ticks on the x-axis
      minorTicks: 3,                 // number of minor ticks to put between each major tick
      majorTickSize: 2,              // the length (px) of the major ticks on the x-axis
      minorTickSize: 1,              // the length (px) of the minor ticks on the x-axis
      tickLabelFontSize: 14,         // font size of the tick labels (the numbers below the major ticks)
      tickWidth: 0.5,                // stroke width of the ticks (px)
      tickLabelPrecision: 1,         // digits of precision for the x-axis tick labels
      showZeroLabel: false,          // choose whether or not the "zero" value is displayed on the bottom-left part of the graph
    },
    y : {
      labels: ["molar enthalpy (kJ/mol)", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [0, 130],
      step: 20,
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

gvs.Hcurve_curve = gvs.graph.addCurve(gvs.Hcurve, {
  stroke: "rgba(0, 0, 255, 1)",
  strokeWidth: 2,
  resolution: 100,
  fill: "none",
  id: `H-curve`,
  classList: ["curve"],
  range: [0, 1],
});

gvs.partial_molar_curve = gvs.graph.addCurve(gvs.partialMolar, {
  stroke: "rgba(0, 0, 0, 1)",
  strokeWidth: 2,
  resolution: 3,
  fill: "none",
  id: `partial-molar-curve`,
  classList: ["curve", "dashed"],
  range: [0, 1],
});

gvs.molar_partialB = gvs.graph.createPoint({
  coord: [0, gvs.partialMolar(0)],
  radius: 0.5,
  classList: [],
  usePlotCoordinates: true,
  id: "molar-partial-B",
  parent: gvs.graph.SVG,
  stroke: "rgb(0, 0, 0)",
  strokeWidth: 1,
  fill: "rgb(255, 255, 255)",
});

gvs.molar_partialA = gvs.graph.createPoint({
  coord: [1, gvs.partialMolar(1)],
  radius: 0.5,
  classList: [],
  usePlotCoordinates: true,
  id: "molar-partial-A",
  parent: gvs.graph.SVG,
  stroke: "rgb(0, 0, 0)",
  strokeWidth: 1,
  fill: "rgb(255, 255, 255)",
});

gvs.molar_pureB = gvs.graph.createPoint({
  coord: [0, gvs.Hcurve(0)],
  radius: 0.15,
  classList: [],
  usePlotCoordinates: true,
  id: "molar-pure-B",
  parent: gvs.graph.SVG,
  stroke: "rgb(0, 0, 0)",
  strokeWidth: 1,
  fill: "rgb(255, 255, 255)",
});

gvs.molar_pureA = gvs.graph.createPoint({
  coord: [1, gvs.Hcurve(1)],
  radius: 0.15,
  classList: [],
  usePlotCoordinates: true,
  id: "molar-pure-A",
  parent: gvs.graph.SVG,
  stroke: "rgb(0, 0, 0)",
  strokeWidth: 1,
  fill: "rgb(255, 255, 255)",
});

gvs.tangentPoint = gvs.graph.createPoint({
  coord: [gvs.xA, gvs.partialMolar(gvs.xA)],
  radius: 1.1,
  classList: [],
  usePlotCoordinates: true,
  id: "tangent-point",
  parent: gvs.graph.SVG,
  stroke: "rgb(0, 0, 0)",
  strokeWidth: 1,
  fill: "rgb(0, 0, 0)",
});