function definePlotFunctions() {
  window.ArrayPlot = class ArrayPlot {
    constructor(array) {
      this.min = array[0][1];
      this.max = array[array.length - 1][1];
      this.lineColor = 'rgb(0, 0, 0)';
      this.lineThickness = 2; //pixels
      this.tightness = 1;
      this.arr = array;
    }

    update(array) {
      this.arr = array;
    }
  };

  window.PlotCanvas = class PlotCanvas {
    constructor(parent, wrapper) {
      this.parent = parent;
      this.GPLOT = new GPlot(this.parent);
      this.rGPLOT = new GPlot(this.parent);
      this.pos = [10, 0];
      this.dims = [parseFloat(wrapper.getBoundingClientRect().width), parseFloat(wrapper.getBoundingClientRect().height)];
      this.xLims = [0, 1];
      this.yLims = [0, 1];
      this.rightLims = [0, 2];
      this.xAxisLabel = "x - label";
      this.yAxisLabel = "y - label";
      this.rightAxisLabel = "right - label"
      this.plotTitle = "Plot Title";
      this.yAxisColor = "rgb(0, 0, 0)";
      this.rightAxisColor = "rgb(0, 0, 0)";
      this.funcs = new Array(0);
      this.fontSize = 12;
      this.titleFontSize = 12;
      this.axisFontSize = 12;
      this.axisLabelSize = 12;
      this.GPLOT.yAxis.setRotateTickLabels(false);
      this.GPLOT.yAxis.setTickLabelOffset(10);
      this.GPLOT.yAxis.lab.setOffset(50);
      this.GPLOT.xAxis.lab.setOffset(40);
      this.GPLOT.setMar([42, 68, 20, 30]);

      this.rGPLOT.getRightAxis().setRotateTickLabels(false);
      this.rGPLOT.getRightAxis().lab.setOffset(50);
    }

    addFuncs() {
      for (let i = 0; i < arguments.length; i++) {
        this.funcs.push(arguments[i]);
      }
    }

    plotDraw() {
      this.parent.background("#FFFFFF");
      this.GPLOT.beginDraw();
      this.GPLOT.setYLim(this.yLims);
      this.GPLOT.drawBackground();
      this.GPLOT.drawBox();
      this.GPLOT.drawGridLines(2);

      for (let i = 0; i < this.funcs.length; i++) {
        this.parent.stroke(this.funcs[i].lineColor);
        this.parent.strokeWeight(this.funcs[i].lineThickness);
        arrayToPlot(this.funcs[i].arr, this.GPLOT, this.funcs[i].tightness);
      }

      this.GPLOT.drawLimits();
      this.GPLOT.drawXAxis();
      this.GPLOT.drawYAxis();
      this.GPLOT.drawTitle();
      this.GPLOT.endDraw();

      this.rGPLOT.beginDraw();
      this.rGPLOT.setYLim(this.rightLims);
      this.rGPLOT.drawRightAxis();
      this.rGPLOT.endDraw();
    }

    plotSetup() {
      this.dims[0] = this.dims[0] - this.GPLOT.getMar()[1] * 2 - 10;
      this.dims[1] = this.dims[1] - this.GPLOT.getMar()[0] * 2;
      this.GPLOT.setFontSize(this.fontSize);
      this.GPLOT.getXAxis().fontSize = this.axisFontSize;
      this.GPLOT.getYAxis().fontSize = this.axisFontSize;
      this.GPLOT.getXAxis().lab.fontSize = this.axisLabelSize;
      this.GPLOT.getYAxis().lab.fontSize = this.axisLabelSize;
      this.GPLOT.getTitle().fontSize = this.titleFontSize;
      this.GPLOT.setPos.apply(this.GPLOT, this.pos);
      this.GPLOT.setDim(this.dims[0], this.dims[1]);
      this.GPLOT.setXLim.apply(this.GPLOT, this.xLims);
      this.GPLOT.setYLim.apply(this.GPLOT, this.yLims);
      this.GPLOT.getXAxis().getAxisLabel().setText(this.xAxisLabel);
      this.GPLOT.getYAxis().getAxisLabel().setText(this.yAxisLabel);
      this.GPLOT.getTitle().setText(this.plotTitle);
      this.GPLOT.getYAxis().setLineColor(this.yAxisColor);
      this.GPLOT.getYAxis().setFontColor(this.yAxisColor);
      this.GPLOT.getYAxis().lab.setFontColor(this.yAxisColor);
      this.rGPLOT.getRightAxis().setLineColor(this.rightAxisColor);
      this.rGPLOT.getRightAxis().setFontColor(this.rightAxisColor);
      this.rGPLOT.getRightAxis().lab.setFontColor(this.rightAxisColor);
      this.rGPLOT.setFontSize(this.fontSize);
      this.rGPLOT.getRightAxis().lab.fontSize = this.axisLabelSize;
      this.rGPLOT.getRightAxis().fontSize = this.axisFontSize;
      this.rGPLOT.setMar(this.GPLOT.getMar());
      this.rGPLOT.setDim(this.GPLOT.getDim());
      this.rGPLOT.setPos(this.GPLOT.getPos());
      this.rGPLOT.getRightAxis().setAxisLabelText(this.rightAxisLabel);
      this.rGPLOT.getRightAxis().setDrawTickLabels(true);
    }

    labelDraw(text, x, y, col, align, subsuper, background) {
      let xAlign = CENTER;
      let yAlign = CENTER;
      if (align) {
        xAlign = align[0];
        yAlign = align[1];
      }
      let fontSize = this.fontSize;
      if (subsuper) {
        switch (subsuper) {
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

      if (background) {
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
      let offX;
      let offY;
      if (offsetX) {
        offX = offsetX;
      } else {
        offX = 0;
      }
      if (offsetY) {
        offY = offsetY;
      } else {
        offY = 0;
      }
      let aln;
      if (subsuper == "sub") {
        aln = this.GPLOT.mainLayer.parent.TOP;
      } else {
        aln = this.GPLOT.mainLayer.parent.BOTTOM;
      }

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
      this.GPLOT.mainLayer.parent.textSize(this.fontSize * 0.8);
      this.GPLOT.mainLayer.parent.fill(col);
      this.GPLOT.mainLayer.parent.text(text2, 0, 0);
      this.GPLOT.endDraw();
    }

    yaxisSubSuperDraw(text1, text2, offsetX, offsetY, col, subsuper, rot) {

      /*this.parent.textAlign(this.parent.RIGHT, this.parent.CENTER);
      this.parent.translate(this.plotPos, this.offset);
      this.parent.rotate(-0.5 * Math.PI);
      this.parent.text(this.text, 0, 0);*/

      let offX;
      let offY;

      if (offsetX) {
        offX = offsetX;
      } else {
        offX = 0;
      }
      if (offsetY) {
        offY = offsetY;
      } else {
        offY = 0;
      }
      let aln;
      if (subsuper == "sub") {
        aln = this.GPLOT.mainLayer.parent.TOP;
      } else {
        aln = this.GPLOT.mainLayer.parent.BOTTOM;
      }
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
      this.GPLOT.mainLayer.parent.textSize(this.fontSize * 0.8);
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
      if (col) {
        clr = col;
      } else {
        clr = color(0, 0, 0, 255);
      }
      if (thickness) {
        thk = thickness;
      } else {
        thk = 2;
      }
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
      if (typeof (background) == "number" && background <= 1 && background >= 0) {
        clr = [this.GPLOT.boxBgColor.levels[0], this.GPLOT.boxBgColor.levels[1], this.GPLOT.boxBgColor.levels[2], background * 255];
        this.GPLOT.mainLayer.parent.fill.apply(this, clr);
      } else if (background) {
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
}

/**
 * Auto-plots a pre-defined array. Optional boolean 4th argument] to manage curve tightness.
 * @example arrayToPlot([[0, 1], [1, 0.5], [0.5, 2.3], [2.3, 4.2]], "plotName", 1)
 * @param  {Number[][]} arr 2-dimensional array of coordinates
 * @param  {Object} plotID Name of GPlot ID
 * @param  {Number} [tightness = 0.7] Adjust tightness of curve
 */
function arrayToPlot(arr, plotID, tightness) {
  let gArray = new Array(0);

  if (tightness === undefined) {
    tightness = 0.7;
  }
  plotID.parent.curveTightness(tightness);

  plotID.parent.noFill();
  plotID.parent.beginShape();
  gArray.push(plotID.mainLayer.valueToPlot(arr[0][0], arr[0][1]));
  plotID.parent.curveVertex.apply(this, gArray[0]);

  for (i = 0; i < arr.length; i++) {
    gArray.push(plotID.mainLayer.valueToPlot(arr[i][0], arr[i][1]));
    plotID.parent.curveVertex.apply(this, gArray[i + 1]);
  }
  gArray.push(plotID.mainLayer.valueToPlot(arr[arr.length - 1][0], arr[arr.length - 1][1]));
  plotID.parent.curveVertex.apply(this, gArray[gArray.length - 1]);
  gArray.push(plotID.mainLayer.valueToPlot(arr[arr.length - 1][0], arr[arr.length - 1][1]));
  plotID.parent.curveVertex.apply(this, gArray[gArray.length - 1]);
  plotID.parent.endShape();
}

module.exports = definePlotFunctions();