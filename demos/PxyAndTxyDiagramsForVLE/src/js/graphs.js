const p5_container = document.getElementById("p5-container");
const p5_rect = p5_container.getBoundingClientRect();
const plot_container = document.getElementById("plot-container");
const p5_plot_margin_top = 20;
const p5_plot_margin_bottom = 20;
const p5_plot_margin_left = 15;
const p5_plot_margin_right = 50;
plot_container.style.top = `${p5_rect.top + p5_plot_margin_top}px`;
plot_container.style.left = `${p5_rect.left + p5_plot_margin_left}px`;
plot_container.style.height = `${gvs.p.height - p5_plot_margin_bottom - p5_plot_margin_top}px`;
plot_container.style.width = `${2 * gvs.p.width / 3 - p5_plot_margin_right}px`;

gvs.pxy_plot = new gvs.SVG_Graph({
  id: "pxy-plot",                     // id of the container element
  classList: ["svg-plot"],           // classes to add to the plot container element
  title: "mixture is at 1.50 bar",       // text above the plot
  titleFontSize: 18,                 // font size of title, pixels
  padding: [[65, 20], [40, 60]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
  parent: document.getElementById("plot-container"),             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
  axes: {
    axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
    x : {
      labels: ["", "<i>n</i>-hexane mole fraction"],  // labels to add above the top x-axis and below the bottom x-axis
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
      showZeroLabel: true,          // choose whether or not the "zero" value is displayed on the bottom-left part of the graph
    },
    y : {
      labels: ["pressure (bar)", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [0, 5],
      step: 1,
      minorTicks: 3,
      majorTickSize: 2,
      minorTickSize: 1,
      tickLabelFontSize: 14,
      tickWidth: 0.5,
      tickLabelPrecision: 1,
      showZeroLabel: false,
    }
  }
});

gvs.txy_plot = new gvs.SVG_Graph({
  id: "txy-plot",                     // id of the container element
  classList: ["svg-plot", "hidden"],           // classes to add to the plot container element
  title: "mixture is at 115° C",       // text above the plot
  titleFontSize: 18,                 // font size of title, pixels
  padding: [[65, 20], [40, 60]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
  parent: document.getElementById("plot-container"),             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
  axes: {
    axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
    x : {
      labels: ["", "<i>n</i>-hexane mole fraction"],  // labels to add above the top x-axis and below the bottom x-axis
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
      showZeroLabel: true,          // choose whether or not the "zero" value is displayed on the bottom-left part of the graph
    },
    y : {
      labels: ["Temperature (°C)", ""],
      labelFontSize: 17,
      display: [true, true],
      range: [40, 160],
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

gvs.txy_plot.tickLabels.classList.add("hidden");
// gvs.pxy_plot.tickLabels.classList.add("hidden");

gvs.pxy_bubble_point = gvs.pxy_plot.addCurve(gvs.Px, {
  stroke: "rgba(0, 0, 255, 1)",
  strokeWidth: 2,
  resolution: 100,
  fill: "none",
  id: `pxy-bubble-point-curve`,
  classList: ["curve"],
  range: [0, 1]
});

gvs.pxy_dew_point = gvs.pxy_plot.addCurve(gvs.Py, {
  stroke: "rgba(0, 150, 0, 1)",
  strokeWidth: 2,
  resolution: 100,
  fill: "none",
  id: `pxy-dew-point-curve`,
  classList: ["curve"],
  range: [0, 1]
});

gvs.txy_bubble_point = gvs.txy_plot.addCurve(gvs.Tx, {
  stroke: "rgba(0, 0, 255, 1)",
  strokeWidth: 2,
  resolution: 100,
  fill: "none",
  id: `txy-bubble-point-curve`,
  classList: ["curve"],
  range: [0, 1]
});

gvs.txy_dew_point = gvs.txy_plot.addCurve(gvs.Ty, {
  stroke: "rgba(0, 150, 0, 1)",
  strokeWidth: 2,
  resolution: 100,
  fill: "none",
  id: `txy-dew-point-curve`,
  classList: ["curve"],
  range: [0, 1]
});