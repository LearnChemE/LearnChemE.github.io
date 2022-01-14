require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
  F : 1, // initial amount of liquid (constant)
  B : 1, // moles of liquid in the bottom kettle
  D : 0, // total moles of distillate collected
  z : 0.50, // initial mole fraction in the still (adjusted with slider)
  xB : 0.50, // concentration of more volatile component in the liquid in still
  xD : 0.74, // concentration of more volatile component in the vapor
  T : 86.4, // Temperature of the liquid/vapor
  display : "flasks", // which graphic to display on the right-side of the screen
  eq_plot_shape : "no azeotrope", // which equilibrium plot to use
  flasks : [], // array of flask objects
  is_collecting : false, // whether or not liquid is currently being collected
  amount_to_collect : 0.10, // amount to be collected when user presses "collect"
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.preload = function() {
    gvs.coil_img = p.loadImage("./assets/coil.png");
  }

  p.setup = function () {
    p.createCanvas(800, 530);
    p.noLoop();
    gvs.p = p;
    gvs.drawAll = require("./js/draw.js");
    gvs.Flask = require("./js/flasks.js");
    const { SVG_Graph } = require("./js/svg-graph-library.js");
    gvs.SVG_Graph = SVG_Graph;
    require("./js/inputs.js");
    require("./js/collect.js");
    gvs.flasks.push(new gvs.Flask({ x_loc : 316, y_loc : 370 }));
    document.getElementById("loading").style.opacity = "0";

    gvs.eq_plot = new SVG_Graph({
      id: "eq-plot",                  // id of the container element
      classList: ["svg-plot"],           // classes to add to the plot container element
      title: "Equilibrium plot",                         // text above the plot
      titleFontSize: 20,                 // font size of title, pixels
      padding: [[70, 20], [40, 50]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
      parent: document.getElementById("plot-container"),             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
      axes: {
        axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
        x : {
          labels: ["", "x<sub>B</sub>"],  // labels to add above the top x-axis and below the bottom x-axis
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
          labels: ["y<sub>B</sub>", ""],
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
          showZeroLabel: true,
        }
      }
     });

     gvs.txy_plot = new SVG_Graph({
      id: "txy-plot",                  // id of the container element
      classList: ["svg-plot"],           // classes to add to the plot container element
      title: "T-x-y diagram",                         // text above the plot
      titleFontSize: 20,                 // font size of title, pixels
      padding: [[70, 20], [40, 50]],     // amount of padding (pixels) around the [[left, right], [top, bottom]] axes.
      parent: document.getElementById("plot-container"),             // the element to place the plot within.  If a parent is specified (besides document.body), the plot size will be 100% of parent's width and height.
      axes: {
        axesStrokeWidth: 0.5,            // stroke width of the axes lines: the vertical and horizontal x and y-axes (px)
        x : {
          labels: ["", "x<sub>B</sub>"],  // labels to add above the top x-axis and below the bottom x-axis
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
          labels: ["y<sub>B</sub>", ""],
          labelFontSize: 17,
          display: [true, true],
          range: [75, 110],
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
     
     [
       document.getElementById("eq-plot"),
       document.getElementById("eq-plot-tick-labels"),
       document.getElementById("txy-plot"),
       document.getElementById("txy-plot-tick-labels")
    ].forEach(elt => { elt.style.opacity = "0" });

    gvs.no_azeotrope_curve = gvs.eq_plot.addCurve(gvs.no_azeotrope, {
      stroke: "rgba(100, 100, 255, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "eq-no-azeotrope-curve",
      classList: ["curve"],
    });

    gvs.minimum_temperature_azeotrope_curve = gvs.eq_plot.addCurve(gvs.minimum_temperature_azeotrope, {
      stroke: "rgba(100, 100, 255, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "eq-minimum-temperature-azeotrope-curve",
      classList: ["curve"],
    });

    gvs.maximum_temperature_azeotrope_curve = gvs.eq_plot.addCurve(gvs.maximum_temperature_azeotrope, {
      stroke: "rgba(100, 100, 255, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "eq-maximum-temperature-azeotrope-curve",
      classList: ["curve"],
    });

    const xyLine = gvs.eq_plot.createLine({
      coord1: [0, 0],
      coord2: [1, 1],
      classList: [],
      usePlotCoordinates: true,
      id: "x-y-line",
    });

    xyLine.style.strokeWidth = "1px";

    [
      document.getElementById("eq-minimum-temperature-azeotrope-curve"),
      document.getElementById("eq-maximum-temperature-azeotrope-curve")
    ].forEach(curve => { curve.style.opacity = "0" });

    gvs.no_azeotrope_temperature_curve = gvs.txy_plot.addCurve(gvs.no_azeotrope_temperature, {
      stroke: "rgba(100, 100, 255, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "txy-no-azeotrope-temperature-curve",
      classList: ["curve"],
    });

    gvs.minimum_temperature_azeotrope_temperature_curve = gvs.txy_plot.addCurve(gvs.minimum_temperature_azeotrope_temperature, {
      stroke: "rgba(100, 100, 255, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "txy-minimum-temperature-azeotrope-temperature-curve",
      classList: ["curve"],
    });

    gvs.maximum_temperature_azeotrope_temperature_curve = gvs.txy_plot.addCurve(gvs.maximum_temperature_azeotrope_temperature, {
      stroke: "rgba(100, 100, 255, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "txy-maximum-temperature-azeotrope-temperature-curve",
      classList: ["curve"],
    });

    gvs.no_azeotrope_dew_point_curve = gvs.txy_plot.addCurve(gvs.no_azeotrope_dew_point, {
      stroke: "rgba(180, 180, 180, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "txy-no-azeotrope-dew-point-curve",
      classList: ["dashed-curve"],
    });

    gvs.minimum_temperature_azeotrope_dew_point_curve = gvs.txy_plot.addCurve(gvs.minimum_temperature_azeotrope_dew_point, {
      stroke: "rgba(180, 180, 180, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "txy-minimum-temperature-azeotrope-dew-point-curve",
      classList: ["dashed-curve"],
    });

    gvs.maximum_temperature_azeotrope_dew_point_curve = gvs.txy_plot.addCurve(gvs.maximum_temperature_azeotrope_dew_point, {
      stroke: "rgba(180, 180, 180, 1)",
      strokeWidth: 2,
      resolution: 100,
      fill: "none",
      id: "txy-maximum-temperature-azeotrope-dew-point-curve",
      classList: ["dashed-curve"],
    });

    [
      gvs.minimum_temperature_azeotrope_temperature_curve,
      gvs.minimum_temperature_azeotrope_dew_point_curve,
      gvs.maximum_temperature_azeotrope_temperature_curve,
      gvs.maximum_temperature_azeotrope_dew_point_curve
    ].forEach(curve => {
      curve.elt.style.opacity = "0";
    });

    gvs.eq_plot_point = gvs.eq_plot.createPoint({
      coord: [gvs.z, gvs.no_azeotrope(gvs.z)],
      radius: 1.5,
      classList: ["plot-point"],
      usePlotCoordinates: true,
      id: "eq-plot-point",
      parent: gvs.eq_plot.SVG,
      stroke: "rgb(0, 0, 0)",
      strokeWidth: 1,
      fill: "rgb(255, 255, 255)",
    });

    gvs.txy_plot_point_x = gvs.txy_plot.createPoint({
      coord: [gvs.z, gvs.no_azeotrope_temperature(gvs.z)],
      radius: 1.5,
      classList: ["plot-point"],
      usePlotCoordinates: true,
      id: "eq-plot-point",
      parent: gvs.txy_plot.SVG,
      stroke: "rgb(0, 0, 0)",
      strokeWidth: 1,
      fill: "rgb(255, 255, 255)",
    });

    gvs.txy_plot_point_y = gvs.txy_plot.createPoint({
      coord: [gvs.no_azeotrope( gvs.z ), gvs.no_azeotrope_temperature(gvs.z)],
      radius: 1.5,
      classList: ["plot-point"],
      usePlotCoordinates: true,
      id: "eq-plot-point",
      parent: gvs.txy_plot.SVG,
      stroke: "rgb(0, 0, 0)",
      strokeWidth: 1,
      fill: "rgb(50, 50, 50)",
    });

    gvs.txy_plot_xB_label = gvs.txy_plot.createText({
      coord: [gvs.xB - 0.05, gvs.no_azeotrope_temperature( gvs.xB ) - 0.2],
      content: "x",
      classList: ["svg-text"],
      usePlotCoordinates: true,
      id: null,
      parent: gvs.txy_plot.SVG,
      color: "rgb(0, 0, 0)",
      fontSize: 4,
      alignment: ["left", "top"],
    });

    gvs.txy_plot_xB_label_subscript = gvs.txy_plot.createText({
      coord: [gvs.xB - 0.025, gvs.no_azeotrope_temperature( gvs.xB ) - 1.05],
      content: "B",
      classList: ["svg-text"],
      usePlotCoordinates: true,
      id: null,
      parent: gvs.txy_plot.SVG,
      color: "rgb(0, 0, 0)",
      fontSize: 2.5,
      alignment: ["left", "top"],
    });

    gvs.txy_plot_xD_label = gvs.txy_plot.createText({
      coord: [gvs.no_azeotrope( gvs.xB ) + 0.03, gvs.no_azeotrope_temperature( gvs.xB ) + 2],
      content: "y",
      classList: ["svg-text"],
      usePlotCoordinates: true,
      id: null,
      parent: gvs.txy_plot.SVG,
      color: "rgb(0, 0, 0)",
      fontSize: 4,
      alignment: ["left", "top"],
    });

    gvs.txy_plot_xD_label_subscript = gvs.txy_plot.createText({
      coord: [gvs.no_azeotrope( gvs.xB ) + 0.055, gvs.no_azeotrope_temperature( gvs.xB ) + 1],
      content: "B",
      classList: ["svg-text"],
      usePlotCoordinates: true,
      id: null,
      parent: gvs.txy_plot.SVG,
      color: "rgb(0, 0, 0)",
      fontSize: 2.5,
      alignment: ["left", "top"],
    });
  };

  p.draw = function () {
    p.background(253);
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);