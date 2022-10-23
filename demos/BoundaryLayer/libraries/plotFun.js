/* jshint esversion: 6 */
/*
 * Supplemental plotting functions for use with p5.js and grafica.js
 * (c)2019 Neil Hendren
 * Requires: Math.js, p5.js, and grafica.js
 */

var graphFontSize;

/**
 * Turns a function into a 2-dimensional array of coordinates.
 * @example functionToArray("2*x + 1", ["x", 0, 5, 2]) // Returns [[0, 1], [2, 5], [4, 9]]
 * @param  {String} expr the function in string form (e.g. "2*x + 1")
 * @param  {(String\|Number)[]} lims [independent variable (e.g. "x"), min, max, [increment]]
 * @return {Number[][]} returns 2-dimensional array of coordinates
 */
function functionToArray(expr, lims) {
  let indepVar, outArray, plotRangeMin, plotRangeMax;

  indepVar = lims[0];
  plotRangeMin = lims[1];
  plotRangeMax = lims[2];
  outArray = new Array(0);

  if (lims.length==4) {plotRangeInc = lims[3];} else {plotRangeInc = (plotRangeMax - plotRangeMin)/200;}

  try { 
    if(arguments.length != 2 ||
      typeof arguments[1] != "object" ||
      arguments[1].length < 3 ||
      arguments[1].length > 4)
      throw "two input arguments: 1.) a single-variate function and 2.) a 3-dimensional array for the independent variable and its respective plot range.";
  }
  catch(err) {
    console.log("function toPlot() requires " + err + " e.g. functionToArray('x + 2x + 6', [x, 0, 100])");
  }

  var i;
  for (i = plotRangeMin; i <= plotRangeMax; i += plotRangeInc) {
    outArray.push([i,
      math.eval(
        expr.replace(new RegExp(indepVar, 'g'), String(i.toPrecision(16)))
        )
      ]);
  }
return outArray;
}
var x;
/**
 * Auto-plots a pre-defined array. Optional boolean 4th argument] to manage curve tightness.
 * @example arrayToPlot([[0, 1], [1, 0.5], [0.5, 2.3], [2.3, 4.2]], "plotName", 1)
 * @param  {Number[][]} arr 2-dimensional array of coordinates
 * @param  {Object} plotID Name of GPlot ID
 * @param  {Number} [tightness = 0.7] Adjust tightness of curve
 */
function arrayToPlot(arr, plotID, tightness) {
  let gArray = new Array(0);
  
  if (tightness === undefined) {tightness = 0.7;}
    curveTightness(tightness);

    noFill();
    beginShape();
    gArray.push(plotID.mainLayer.valueToPlot(arr[0][0], arr[0][1]));
    curveVertex.apply(this, gArray[0]);

    for (i=0; i<arr.length; i++) {
      gArray.push(plotID.mainLayer.valueToPlot(arr[i][0], arr[i][1]));
      curveVertex.apply(this, gArray[i + 1]);
    }
    gArray.push(plotID.mainLayer.valueToPlot(arr[arr.length-1][0], arr[arr.length-1][1]));
    curveVertex.apply(this, gArray[gArray.length-1]);
    gArray.push(plotID.mainLayer.valueToPlot(arr[arr.length-1][0], arr[arr.length-1][1]));
    curveVertex.apply(this, gArray[gArray.length-1]);
    endShape();

    /*for (i=0; i<arr.length; i++) {
      strokeWeight(5);
      stroke(0,50,255);
      point.apply(this, gArray[i]);
    }*/

  /*
    DEPRECATED

    for (i=0; i<arr.length; i++) {
      gArray.push(new GPoint(arr[i][0], arr[i][1]));
      plotID.addPoint(gArray[i]);
      if (i>=1) {plotID.drawLine(gArray[i-1], gArray[i]);}
  }*/
}

/**
 * Auto-plots a function.
 * @example: plotFunction("6.5 * x", ["x", 1, 100, 0.1], "plotName", 1); //Returns a plot of f(x)=6.5x from 1 to 100, drawing in increments of 0.1. 
 * @param  {String} expr The function to be plotted
 * @param  {(String\|Number)[]} lims Independent variable and limits. Optional increment for resolution ["indep", 0, 100, (0.1)]
 * @param  {Object} plotID Name of GPlot ID
 * @param  {Number} [tightness = 0.7] Adjust tightness of curve
 */
function plotFunction(expr, lims, plotID, tightness) {
  let indepVar, plotRangeMin, plotRangeMax, plotRangeInc, arr;
  let gArray = [];

  indepVar = lims[0];
  plotRangeMin = lims[1];
  plotRangeMax = lims[2];
  if (lims[3] === undefined) {
    plotRangeInc = (plotRangeMax - plotRangeMin) / 200;
  } else {plotRangeInc = lims[3];}
  plotID = arguments[2];
  if (tightness === undefined) {
    tightness = 0.7;
  }
  
  arr = functionToArray(expr, [indepVar, plotRangeMin, plotRangeMax, plotRangeInc]);
  var i;

  curveTightness(tightness);
  noFill();
  beginShape();
  for (i=0; i<arr.length; i++) {
    gArray.push(plotID.mainLayer.valueToPlot(arr[i][0], arr[i][1]));
    curveVertex.apply(this, gArray[i]);
  }
  endShape();

    /* DEPRECATED
    for (i=0; i<arr.length; i++) {
      gArray.push(new GPoint(arr[i][0], arr[i][1]));
      plotID.addPoint(gArray[i]);
      if (i>=1) {plotID.drawLine(gArray[i-1], gArray[i]);}
    */
}

class PlotCanvas {
  constructor(parent) {
    this.parent = parent;   
    this.GPLOT = new GPlot(this.parent);
    this.pos = [10, 0];
    this.dims = [this.GPLOT.parent.width, this.GPLOT.parent.height];
    this.xLims = [0, 1];
    this.yLims = [0, 1];
    this.xAxisLabel = "x - label";
    this.yAxisLabel = "y - label";
    this.plotTitle = "Plot Title";
    this.funcs = new Array(0);
    this.fontSize = 18;
    this.titleFontSize = 18;
    this.axisFontSize = 18;
    this.axisLabelSize = 18;
    this.GPLOT.yAxis.setRotateTickLabels(false);
    this.GPLOT.yAxis.setTickLabelOffset(10);
    this.GPLOT.yAxis.lab.setOffset(50);
    this.GPLOT.xAxis.lab.setOffset(40);
  }

  addFuncs() {
    let i=0;
    for(i=0; i<arguments.length; i++) {
      this.funcs.push(arguments[i]);
    }
  }

  plotDraw() {
    let i=0;
    this.GPLOT.beginDraw();
    this.GPLOT.drawBackground();
    this.GPLOT.drawBox();
    this.GPLOT.drawGridLines(2);

    for (i=0; i<this.funcs.length; i++) {
      stroke(this.funcs[i].lineColor);
      strokeWeight(this.funcs[i].lineThickness);
      arrayToPlot(this.funcs[i].arr, this.GPLOT, this.funcs[i].tightness);
    }

    this.GPLOT.drawLimits();
    this.GPLOT.drawXAxis();
    this.GPLOT.drawYAxis();
    this.GPLOT.drawTitle();
    this.GPLOT.endDraw();
  }

  plotSetup() {
    this.GPLOT.setFontSize(this.fontSize);
    this.GPLOT.getXAxis().fontSize = this.axisFontSize;
    this.GPLOT.getYAxis().fontSize = this.axisFontSize;
    this.GPLOT.getXAxis().lab.fontSize = this.axisLabelSize;
    this.GPLOT.getYAxis().lab.fontSize = this.axisLabelSize;
    this.GPLOT.getTitle().fontSize = this.titleFontSize;
    this.GPLOT.setPos.apply(this.GPLOT, this.pos);
    this.GPLOT.setOuterDim.apply(this.GPLOT, this.dims);
    this.GPLOT.setXLim.apply(this.GPLOT, this.xLims);
    this.GPLOT.setYLim.apply(this.GPLOT, this.yLims);
    this.GPLOT.getXAxis().getAxisLabel().setText(this.xAxisLabel);
    this.GPLOT.getYAxis().getAxisLabel().setText(this.yAxisLabel);
    this.GPLOT.getTitle().setText(this.plotTitle);
  }

  labelDraw(text, x, y, col, align, subsuper, background) {
    let xAlign = CENTER;
    let yAlign = CENTER;
    if(align) {
      xAlign = align[0];
      yAlign = align[1];
    }
    let fontSize = this.fontSize;
    if(subsuper) {
      switch(subsuper) {
        case "sub":
          fontSize = this.fontSize * 0.8;
          break;
        case "super":
          fontSize = this.fontSize * 0.8;
          break;
        default:
          break;
      }
    }

    if(background) {
      let coords = this.GPLOT.getScreenPosAtValue(x, y);
      push();
      fill(this.GPLOT.boxBgColor.levels[0], this.GPLOT.boxBgColor.levels[1], this.GPLOT.boxBgColor.levels[2], col.levels[3]);
      noStroke();
      rectMode(CENTER);
      rect(coords[0], coords[1], fontSize * background[0], fontSize * background[1]);
      pop();
    }

    this.GPLOT.getMainLayer().fontColor = col;
    this.GPLOT.getMainLayer().fontSize = fontSize;
    this.GPLOT.beginDraw();
    this.GPLOT.drawAnnotation(text, x, y, xAlign, yAlign);
    this.GPLOT.endDraw();
  }

  subSuperDraw(text1, text2, x, y, col, subsuper, rot, offsetX, offsetY) {
    let xPlot = this.GPLOT.mainLayer.valueToXPlot(x);
    let yPlot = this.GPLOT.mainLayer.valueToYPlot(y);
    let offX; let offY;
    if (offsetX) {offX = offsetX;} else {offX = 0;}
    if (offsetY) {offY = offsetY;} else {offY = 0;}
    let aln;
    if (subsuper == "sub") {aln = this.GPLOT.mainLayer.parent.TOP;} else {aln = this.GPLOT.mainLayer.parent.BOTTOM;}

    this.GPLOT.beginDraw();
    this.GPLOT.mainLayer.parent.textAlign(this.GPLOT.mainLayer.parent.RIGHT, this.GPLOT.mainLayer.parent.CENTER);
    this.GPLOT.mainLayer.parent.translate(xPlot + offX, yPlot + offY);
    this.GPLOT.mainLayer.parent.rotate(rot);
    this.GPLOT.mainLayer.parent.textFont(this.GPLOT.mainLayer.fontName);
    this.GPLOT.mainLayer.parent.textSize(this.fontSize);
    this.GPLOT.mainLayer.parent.fill(col);
    this.GPLOT.mainLayer.parent.text(text1, 0, 0);
    this.GPLOT.endDraw();

    this.GPLOT.beginDraw();
    this.GPLOT.mainLayer.parent.textAlign(this.GPLOT.mainLayer.parent.LEFT, aln);
    this.GPLOT.mainLayer.parent.translate(xPlot + offX, yPlot + offY);
    this.GPLOT.mainLayer.parent.rotate(rot);
    this.GPLOT.mainLayer.parent.textFont(this.GPLOT.mainLayer.fontName);
    this.GPLOT.mainLayer.parent.textSize(this.fontSize*0.8);
    this.GPLOT.mainLayer.parent.fill(col);
    this.GPLOT.mainLayer.parent.text(text2, 0, 0);
    this.GPLOT.endDraw();
  }

  yaxisSubSuperDraw(text1, text2, offsetX, offsetY, col, subsuper, rot) {

    /*this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER);
		this.parent.translate(this.plotPos, this.offset);
		this.parent.rotate(-0.5 * Math.PI);
    this.parent.text(this.text, 0, 0);*/

    let offX; let offY;
    
    if (offsetX) {offX = offsetX;} else {offX = 0;}
    if (offsetY) {offY = offsetY;} else {offY = 0;}
    let aln;
    if (subsuper == "sub") {aln = this.GPLOT.mainLayer.parent.TOP;} else {aln = this.GPLOT.mainLayer.parent.BOTTOM;}
    this.GPLOT.beginDraw();
    this.GPLOT.mainLayer.parent.textAlign(this.GPLOT.mainLayer.parent.RIGHT, this.GPLOT.mainLayer.parent.BOTTOM);
    this.GPLOT.mainLayer.parent.translate(-this.GPLOT.yAxis.lab.offset, this.GPLOT.yAxis.lab.plotPos);
    this.GPLOT.mainLayer.parent.rotate(rot);
    this.GPLOT.mainLayer.parent.translate(this.fontSize * offY, 0);
    this.GPLOT.mainLayer.parent.textFont(this.GPLOT.mainLayer.fontName);
    this.GPLOT.mainLayer.parent.textSize(this.fontSize);
    this.GPLOT.mainLayer.parent.fill(col);
    this.GPLOT.mainLayer.parent.text(text1, 0, 0);
    this.GPLOT.endDraw();

    this.GPLOT.beginDraw();
    this.GPLOT.mainLayer.parent.textAlign(this.GPLOT.mainLayer.parent.LEFT, this.GPLOT.mainLayer.parent.CENTER);
    this.GPLOT.mainLayer.parent.translate(-this.GPLOT.yAxis.lab.offset, this.GPLOT.yAxis.lab.plotPos);
    this.GPLOT.mainLayer.parent.rotate(rot);
    this.GPLOT.mainLayer.parent.translate(this.fontSize * offY, 0);
    this.GPLOT.mainLayer.parent.textFont(this.GPLOT.mainLayer.fontName);
    this.GPLOT.mainLayer.parent.textSize(this.fontSize*0.8);
    this.GPLOT.mainLayer.parent.fill(col);
    this.GPLOT.mainLayer.parent.text(text2, 0, 0);
    this.GPLOT.endDraw();
  }

  drawLine(xCenter, yCenter, xLength, yLength, col, thickness, offsetX, offsetY) {
    let xPlot1 = this.GPLOT.mainLayer.valueToXPlot(xCenter) - xLength / 2 + offsetX;
    let yPlot1 = this.GPLOT.mainLayer.valueToYPlot(yCenter) - yLength / 2 + offsetY;
    let xPlot2 = xPlot1 + xLength / 2;
    let yPlot2 = yPlot1 + yLength / 2;
    let clr;
    let thk;
    if (col) {clr = col;} else {clr = color(0, 0, 0, 255);}
    if (thickness) {thk = thickness;} else {thk = 2;}
    this.GPLOT.beginDraw();
    this.GPLOT.mainLayer.parent.stroke(clr);
    this.GPLOT.mainLayer.parent.strokeWeight(thk);
    this.GPLOT.mainLayer.parent.line(xPlot1, yPlot1, xPlot2, yPlot2);
    this.GPLOT.endDraw();
  }

  drawRect(xCenter, yCenter, width, height, background) {
    let xPlot = this.GPLOT.mainLayer.valueToXPlot(xCenter);
    let yPlot = this.GPLOT.mainLayer.valueToYPlot(yCenter);
    let clr;
    
    this.GPLOT.beginDraw();
    this.GPLOT.mainLayer.parent.noStroke();
    if (typeof(background) == "number" && background <= 1 && background >= 0) {
      clr = [this.GPLOT.boxBgColor.levels[0], this.GPLOT.boxBgColor.levels[1], this.GPLOT.boxBgColor.levels[2], background * 255];
      this.GPLOT.mainLayer.parent.fill.apply(this, clr);
    } else if(background) {
      clr = background;
      this.GPLOT.mainLayer.parent.fill(clr);
    } else {
      clr = [100, 100, 100, 255];
      this.GPLOT.mainLayer.parent.fill.apply(this, clr);
    }
    this.GPLOT.mainLayer.parent.rectMode(this.GPLOT.mainLayer.parent.CENTER);
    this.GPLOT.mainLayer.parent.rect(xPlot, yPlot, width, height);
    this.GPLOT.endDraw();
  }
}

/**
 * A plot to be drawn within the p5.js draw() loop.
 * @example new Plot("9(x^2) + 3", "x", 0, 10, GPlotName, 0.1) //Returns a plot of f(x)=9x²+3 to the GPlot named "GPlotName". Range 0 to 10, calculating coordinates every dx=0.1.
 * @param  {String} func
 * @param  {String} indep
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Number} [resolution = (max - min)/200] How often to calculate a new coordinate
 */
class Plot {
  constructor(func, indep, min, max, resolution) {
    this.func = func;
    this.indep = indep;
    this.min = min;
    this.max = max;
    if (resolution === undefined) {this.resolution = (this.max - this.min)/200;} else {this.resolution = resolution;}
    this.lineColor = color(0, 0, 0);
    this.lineThickness = 2; //pixels
    this.arr = functionToArray(this.func, [this.indep, this.min, this.max, this.resolution]);
    this.tightness = 0.7;
  }

  update(newFunc) {
    this.func = newFunc;
    this.arr = functionToArray(this.func, [this.indep, this.min, this.max, this.resolution]);
  }
}

/**
 * A plot to be drawn within the p5.js draw() loop.
 * @example new ArrayPlot([[0,0], [0.1, 0.5], [0.3, 0.6]]) //Returns a plot of a 2D array to the GPlot named "GPlotName".
 * @param  {Array} array
 */
class ArrayPlot {
  constructor(array) {
    this.min = array[0][1];
    this.max = array[array.length-1][1];
    this.lineColor = color(0, 0, 0);
    this.lineThickness = 2; //pixels
    this.tightness = 0.7;
    this.arr = array;
  }

  update(array) {
    this.arr = array;
  }
}