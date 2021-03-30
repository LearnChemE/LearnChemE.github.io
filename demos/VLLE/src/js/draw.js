let p;
const { f2, f3, f4, f5, f6, f7, data, section } = require("./calcs.js");

const plotOptions = {
  marginLeft: 60,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 70,
  width: 400,
  height: 350,
  xRange: [0, 1],
  yRange: [60, 100],
  largePointSize: 9,
  smallPointSize: 8,
};

const barGraphOptions = {
  marginLeft : 60,
  marginBottom: 80,
  width : 220,
  height : 320,
  yRange : [0, 1],
  xRange: [0, 1],
};

const colors = {
  alpha: "rgba(255, 80, 80, 0.7)",
  beta: "rgba(120, 120, 200, 0.7)",
  vapor: "rgba(180, 200, 80, 0.7)",
  point: "rgba(0, 255, 255, 1)",
};

const lines = {
  strokeWeight: 1.75,
}

function coordToPixel(x, y) {
  const yPix = p.height - plotOptions.marginBottom - p.map(y, plotOptions.yRange[0], plotOptions.yRange[1], 0, plotOptions.height);
  const xPix = plotOptions.marginLeft + p.map(x, plotOptions.xRange[0], plotOptions.xRange[1], 0, plotOptions.width);
  return [xPix, yPix];
}

function drawAxes() {
  const bottomLeft = coordToPixel(0, 60);
  const bottomRight = coordToPixel(1, 60);
  const topLeft = coordToPixel(0, 100);
  const topRight = coordToPixel(1, 100);
  p.push();
    p.strokeWeight(0.5);
    p.line(bottomLeft[0], bottomLeft[1], bottomRight[0], bottomRight[1]);
    p.line(bottomLeft[0], bottomLeft[1], topLeft[0], topLeft[1]);
    p.line(topLeft[0], topLeft[1], topRight[0], topRight[1]);
    p.line(topRight[0], topRight[1], bottomRight[0], bottomRight[1]);
    
    p.textSize(14);
    p.textAlign(p.CENTER, p.TOP);

    for(let i = 0; i <= 20; i++ ) {
      const coordBottom = coordToPixel(i * 0.05, plotOptions.yRange[0]);
      const coordTop = coordToPixel(i * 0.05, plotOptions.yRange[1]);
      
      let tickLength;
      if(i % 4 === 0) {
        tickLength = 5;
        const z = plotOptions.xRange[0] + i * (plotOptions.xRange[1] - plotOptions.xRange[0]) / 20;
        p.text(`${Number(z).toFixed(1)}`, coordBottom[0], coordBottom[1] + 10);
      } else {
        tickLength = 3
      }
      p.line(coordBottom[0], coordBottom[1], coordBottom[0], coordBottom[1] - tickLength);
      p.line(coordTop[0], coordTop[1], coordTop[0], coordTop[1] + tickLength);

    };

    p.textAlign(p.RIGHT, p.CENTER);

    for(let i = 0; i <= 16; i++) {
      const coordLeft = coordToPixel(plotOptions.xRange[0], plotOptions.yRange[0] + i * (plotOptions.yRange[1] - plotOptions.yRange[0]) / 16);
      const coordRight = coordToPixel(plotOptions.xRange[1], plotOptions.yRange[0] + i * (plotOptions.yRange[1] - plotOptions.yRange[0]) / 16);
      if( i % 4 === 0) {
        tickLength = 5;
        const temp = plotOptions.yRange[0] + i * (plotOptions.yRange[1] - plotOptions.yRange[0]) / 16;
        p.text(`${Math.round(temp)}`, coordLeft[0] - 10, coordLeft[1])
      } else {
        tickLength = 3
      }
      p.line(coordLeft[0], coordLeft[1], coordLeft[0] + tickLength, coordLeft[1]);
      p.line(coordRight[0], coordRight[1], coordRight[0] - tickLength, coordRight[1]);
    }
  p.pop();

  p.push();
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(15);
    const xLabelLoc = coordToPixel(0.5, 60);
    p.text("mole fraction B", xLabelLoc[0], xLabelLoc[1] + 45);
    const yLabelLoc = coordToPixel(0, 80);
    p.translate(yLabelLoc[0] - 48, yLabelLoc[1]);
    p.rotate( -Math.PI / 2 );
    p.text("temperature (°C)", 0, 0);
  p.pop();
}

function drawAlpha() {
  p.push();
    p.fill(colors.alpha);
    p.noStroke();
    p.beginShape();
      const bottomLeft = coordToPixel(0, 60);
      const topLeft = coordToPixel(0, f4(0));
      p.vertex(bottomLeft[0], bottomLeft[1]);
      p.vertex(topLeft[0], topLeft[1]);

      for( let i = 0; i < 0.2752; i += (0.2752 / 20) ) {
        const vertex = coordToPixel(i, f4(i));
        p.vertex(vertex[0], vertex[1]);
      };
      
      for ( let i = 0.2752; i > 0; i -= (0.2752/20) ) {
        const vertex = coordToPixel(i, f2(i));
        p.vertex(vertex[0], vertex[1]);
      };

    p.endShape(p.CLOSE);
  p.pop();
};

function drawBeta() {
  p.push();
    p.fill(colors.beta);
    p.noStroke();
    p.beginShape();
      const bottomRight = coordToPixel(1, 60);
      const topRight = coordToPixel(1, f7(1));
      p.vertex(bottomRight[0], bottomRight[1]);
      p.vertex(topRight[0], topRight[1]);

      for( let i = 1; i > 0.8109; i -= ((1 - 0.8109) / 20) ) {
        const vertex = coordToPixel(i, f7(i));
        p.vertex(vertex[0], vertex[1]);
      };
      
      for ( let i = 0.8109; i < 1; i += ((1 - 0.8109)/20) ) {
        const vertex = coordToPixel(i, p.constrain(f3(i), 60, 100));
        p.vertex(vertex[0], vertex[1]);
      };

    p.endShape(p.CLOSE);
  p.pop();
};

function drawVapor() {
  p.push();
    p.fill(colors.vapor);
    p.noStroke();
    p.beginShape();
      const leftBound = coordToPixel(0, f4(0));
      const rightBound = coordToPixel(1, f7(1));

      p.vertex(leftBound[0], leftBound[1]);
      
      for ( let i = 0; i < 0.6; i += (0.6 / 20) ) {
        const vertex = coordToPixel(i, f5(i));
        p.vertex(vertex[0], vertex[1]);
      };

      for( let i = 0.6; i < 1; i += ( (1 - 0.6) / 20 ) ) {
        const vertex = coordToPixel(i, f6(i));
        p.vertex(vertex[0], vertex[1]);
      };
      
      p.vertex(rightBound[0], rightBound[1]);
      p.vertex(coordToPixel(1, 100)[0], coordToPixel(1, 100)[1]);
      p.vertex(coordToPixel(0, 100)[0], coordToPixel(0, 100)[1]);

    p.endShape(p.CLOSE);
  p.pop();
};

function drawPlotCurves() {
  p.push();
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1.5);

    p.beginShape();
    for( let i = 0; i < 0.2752; i += (0.2752 / 20) ) {
      const vertex = coordToPixel(i, f2(i));
      p.vertex(vertex[0], vertex[1]);
    };
    p.endShape();
    
    p.beginShape();
    for( let i = 0; i < 0.2752; i += (0.2752 / 20) ) {
      const vertex = coordToPixel(i, f4(i));
      p.vertex(vertex[0], vertex[1]);
    };
    p.endShape();

    p.beginShape();
    for( let i = 0; i <= 0.6; i += 0.0299 ) {
      const vertex = coordToPixel(i, f5(i));
      p.vertex(vertex[0], vertex[1]);
    };
    p.endShape();

    p.beginShape();
    for( let i = 0.6; i < 1; i += (0.0199) ) {
      const vertex = coordToPixel(i, f6(i));
      p.vertex(vertex[0], vertex[1]);
    };
    p.endShape();

    p.beginShape();
    for( let i = 0.8109; i < 1; i += (1 - 0.8109) / 20 ) {
      const vertex = coordToPixel(i, p.constrain(f3(i), 60, 100));
      p.vertex(vertex[0], vertex[1]);
    };
    p.endShape();

    p.beginShape();
    for( let i = 0.815; i < 1.003; i += (1 - 0.8109) / 30 ) {
      const vertex = coordToPixel(i, f7(i));
      p.vertex(vertex[0], vertex[1]);
    };
    p.endShape();

    const midlineLeft = coordToPixel(0.2752, 77.3);
    const midlineRight = coordToPixel(0.8109, 77.3);

    p.line(midlineLeft[0], midlineLeft[1], midlineRight[0], midlineRight[1]);

  p.pop();
};

function drawAreaLabels() {
  p.push();
    p.noStroke();
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(15);
    const vaporCoord = coordToPixel(0.58, 92);
    const alphaCoord = coordToPixel(0.1, 78);
    const betaCoord = coordToPixel(0.92, 78);
    const alphaVaporCoord = coordToPixel(0.37, 80);
    const betaVaporCoord = coordToPixel(0.76, 80);
    const alphaBetaCoord = coordToPixel(0.5, 62.5);
    p.text("vapor", vaporCoord[0], vaporCoord[1]);
    p.text("α liquid", alphaCoord[0], alphaCoord[1]);
    p.text("β liquid", betaCoord[0], betaCoord[1]);

    p.text("α liquid\n+ vapor", alphaVaporCoord[0], alphaVaporCoord[1]);
    p.text("β liquid\n+ vapor", betaVaporCoord[0], betaVaporCoord[1]);
    p.text("α liquid + β liquid", alphaBetaCoord[0], alphaBetaCoord[1]);

  p.pop();
}

function vlineZ() {
  p.push();
    p.strokeWeight(lines.strokeWeight);
    const coord1 = coordToPixel( gvs.z, gvs.data[0] );
    const coord2 = coordToPixel( gvs.z, 60 );
    p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.pop();
};

function vlineAlpha() {
  p.push();
    p.stroke(colors.alpha);
    p.strokeWeight(lines.strokeWeight);
    const coord1 = coordToPixel( gvs.data[4], gvs.data[0] );
    const coord2 = coordToPixel( gvs.data[4], 60 );
    p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.pop();
};

function vlineBeta() {
  p.push();
    p.stroke(colors.beta);
    p.strokeWeight(lines.strokeWeight);
    const coord1 = coordToPixel( gvs.data[5], gvs.data[0] );
    const coord2 = coordToPixel( gvs.data[5], 60 );
    p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.pop();
};

function vlineV() {
  p.push();
    p.stroke(colors.vapor);
    p.strokeWeight(lines.strokeWeight);
    const coord1 = coordToPixel( gvs.data[6], gvs.data[0] );
    const coord2 = coordToPixel( gvs.data[6], 60 );
    p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.pop();
};

function hlineAlpha() {
  p.push();
    if ( window.gvs.T >= 77.6 ) {
      p.stroke(colors.vapor);
    } else {
      p.stroke(colors.beta);
    }
    p.strokeWeight(lines.strokeWeight);
    const coord1 = coordToPixel( gvs.z, gvs.data[0] );
    const coord2 = coordToPixel( gvs.data[4], gvs.data[0] );
    p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.pop();
};

function hlineBeta() {
  p.push();
    if ( window.gvs.T >= 77.6 ) {
      p.stroke(colors.vapor);
    } else {
      p.stroke(colors.alpha);
    }
    p.strokeWeight(lines.strokeWeight);
    const coord1 = coordToPixel( gvs.z, gvs.data[0] );
    const coord2 = coordToPixel( gvs.data[5], gvs.data[0] );
    p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.pop();
};

function hlineV() {
  p.push();
    if ( window.gvs.z <= 0.6 ) {
      p.stroke(colors.alpha);
    } else {
      p.stroke(colors.beta);
    }
    p.strokeWeight(lines.strokeWeight);
    const coord1 = coordToPixel( gvs.z, gvs.data[0] );
    const coord2 = coordToPixel( gvs.data[6], gvs.data[0] );
    p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.pop();
};

function pointZ() {
  p.push();
    const coord = coordToPixel( gvs.z, gvs.data[0] );
    p.strokeWeight(1);
    p.stroke(0);
    p.fill(colors.point);
    p.circle(coord[0], coord[1], plotOptions.largePointSize);
  p.pop();
};

function pointAlpha() {
  p.push();
    const coord = coordToPixel( gvs.data[4], gvs.data[0] );
    p.strokeWeight(plotOptions.smallPointSize);
    p.point(coord[0], coord[1]);
  p.pop();
};

function pointBeta() {
  p.push();
    const coord = coordToPixel( gvs.data[5], gvs.data[0] );
    p.strokeWeight(plotOptions.smallPointSize);
    p.point(coord[0], coord[1]);
  p.pop();
};

function pointV() {
  p.push();
    const coord = coordToPixel( gvs.data[6], gvs.data[0] );
    p.strokeWeight(plotOptions.smallPointSize);
    p.point(coord[0], coord[1]);
  p.pop();
};

function drawLinesAndPoints() {


  switch( section() ) {
    case 1:
      vlineZ();
      pointZ();
    break;

    case 2:
      vlineAlpha();
      vlineBeta();
      hlineAlpha();
      hlineBeta();
      pointAlpha();
      pointBeta();
      pointZ();
    break;

    case 3:
      vlineAlpha();
      vlineBeta();
      hlineAlpha();
      hlineBeta();
      pointAlpha();
      pointBeta();
      pointZ();
    break;

    case 4:
      vlineZ();
      pointZ();
    break;

    case 5:
      vlineAlpha();
      vlineBeta();
      vlineV();
      pointAlpha();
      pointBeta();
      pointV();
      pointZ();
    break;

    case 6:
      vlineAlpha();
      vlineBeta();
      vlineV();
      pointAlpha();
      pointBeta();
      pointV();
      pointZ();
    break;

    case 7:
      vlineAlpha();
      vlineV();
      hlineAlpha();
      hlineV();
      pointAlpha();
      pointV();
      pointZ();
    break;

    case 8:
      vlineAlpha();
      vlineV();
      hlineAlpha();
      hlineV();
      pointAlpha();
      pointV();
      pointZ();
    break;

    case 9:
      vlineBeta();
      vlineV();
      hlineBeta();
      hlineV();
      pointBeta();
      pointV();
      pointZ();
    break;

    case 10:
      vlineBeta();
      vlineV();
      hlineBeta();
      hlineV();
      pointBeta();
      pointV();
      pointZ();
    break;

    case 11:
      vlineZ();
      pointZ();
    break;

    case 12:
      vlineZ();
      pointZ();
    break;

    case 13:
      vlineZ();
      pointZ();
    break;

    case 14:
      vlineZ();
      pointZ();
    break;

    case 15:
      vlineAlpha();
      pointZ();
    break;

    case 16:
      vlineBeta();
      pointZ();
    break;

    default:
      throw "unidentified section specified"
    break;
  }
}


function barGraphCoordToPixel(x, y) {
  const yPix = p.height - barGraphOptions.marginBottom - p.map(y, barGraphOptions.yRange[0], barGraphOptions.yRange[1], 0, barGraphOptions.height);
  const xPix = plotOptions.marginLeft + plotOptions.width + plotOptions.marginRight + barGraphOptions.marginLeft + p.map(x, barGraphOptions.xRange[0], barGraphOptions.xRange[1], 0, barGraphOptions.width);
  return [xPix, yPix];
}

function drawBarGraphAxes() {
  p.push();
    const coord0 = barGraphCoordToPixel(0, 0);
    const coordTopLeft = barGraphCoordToPixel(0, 1);
    const coordBottomRight = barGraphCoordToPixel(1, 0);
    p.strokeWeight(1);
    p.stroke(0);
    p.line( coord0[0], coord0[1], coordTopLeft[0], coordTopLeft[1] );
    p.line( coord0[0], coord0[1], coordBottomRight[0], coordBottomRight[1] );
    p.textAlign(p.RIGHT, p.CENTER);
    
    p.noStroke();
    p.fill(0);
    p.textSize(14);
    
    for( let i = 0; i <= 5; i++ ) {
      const tickCoord = barGraphCoordToPixel(0, i / 5);
      p.text( `${Number( i / 5 ).toFixed(1)}`, tickCoord[0] - 5, tickCoord[1] - 3);
    }
    
    p.noFill();
    p.stroke(0);
    p.strokeWeight(0.5);

    for( let i = 0; i <= 20; i++ ) {
      const tickLength = i % 4 === 0 ? 5 : 3;
      const tickCoord = barGraphCoordToPixel(0, i / 20);
      p.line(tickCoord[0], tickCoord[1], tickCoord[0] + tickLength, tickCoord[1] );
    }
  p.pop();

  p.push();
    p.rectMode(p.CORNER);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(14);
    p.fill(colors.alpha);
    p.strokeWeight(0.5);
    p.stroke(0);
    const rectRadius = 20;
    let bottomCenter = barGraphCoordToPixel(0.167, 0);
    let topCenter = barGraphCoordToPixel(0.167, gvs.data[1]);

    p.rect(bottomCenter[0] - rectRadius, bottomCenter[1], 2 * rectRadius, - ( bottomCenter[1] - topCenter[1]) );

    p.fill(0);
    p.noStroke();
    p.text(`${gvs.data[4] == -1 ? "" : "x   = " + Number(gvs.data[4]).toFixed(2)}`, topCenter[0], topCenter[1] - 6);
    p.textSize(11);
    p.text(`${gvs.data[4] == -1 ? "" : "α"}`, topCenter[0] - 17.5, topCenter[1] - 14);
    p.text(`${gvs.data[4] == -1 ? "" : "B"}`, topCenter[0] - 17, topCenter[1] - 2);

    bottomCenter = barGraphCoordToPixel(0.167 + 0.33, 0);
    topCenter = barGraphCoordToPixel(0.167 + 0.33, gvs.data[2]);

    p.textSize(14);    
    p.fill(colors.beta);
    p.strokeWeight(0.5);
    p.stroke(0);
    p.rect(bottomCenter[0] - rectRadius, bottomCenter[1], 2 * rectRadius, - ( bottomCenter[1] - topCenter[1]) );

    p.fill(0);
    p.noStroke();
    p.text(`${gvs.data[5] == -1 ? "" : "x   = " + Number(gvs.data[5]).toFixed(2)}`, topCenter[0], topCenter[1] - 6);
    p.textSize(11);
    p.text(`${gvs.data[5] == -1 ? "" : "β"}`, topCenter[0] - 16.5, topCenter[1] - 14);
    p.text(`${gvs.data[5] == -1 ? "" : "B"}`, topCenter[0] - 16.5, topCenter[1]);

    p.fill(colors.vapor);

    p.textSize(14);    
    bottomCenter = barGraphCoordToPixel(0.167 + 0.67, 0);
    topCenter = barGraphCoordToPixel(0.167 + 0.67, gvs.data[3]);
    p.strokeWeight(0.5);
    p.stroke(0);
    p.rect(bottomCenter[0] - rectRadius, bottomCenter[1], 2 * rectRadius, - ( bottomCenter[1] - topCenter[1]) );

    p.fill(0);
    p.noStroke();
    p.text(`${gvs.data[6] == -1 ? "" : "y   = " + Number(gvs.data[6]).toFixed(2)}`, topCenter[0], topCenter[1] - 6);
    p.textSize(11);
    p.text(`${gvs.data[6] == -1 ? "" : "V"}`, topCenter[0] - 16.5, topCenter[1] - 14);
    p.text(`${gvs.data[6] == -1 ? "" : "B"}`, topCenter[0] - 16.5, topCenter[1]);

  p.pop();

  p.textAlign(p.RIGHT, p.TOP);
  p.textSize( 16 );

  p.push();
    let labelCoord = barGraphCoordToPixel(0.2, 0);
    p.translate(labelCoord[0], labelCoord[1]);
    p.rotate( - Math.PI / 5 );
    p.text("α liquid", -5, 0);
  p.pop();

  p.push();
    labelCoord = barGraphCoordToPixel(0.33 + 0.2, 0);
    p.translate(labelCoord[0], labelCoord[1]);
    p.rotate( - Math.PI / 5 );
    p.text("β liquid", -5, 0);
  p.pop();

  p.push();
    labelCoord = barGraphCoordToPixel(0.67 + 0.2, 0);
    p.translate(labelCoord[0], labelCoord[1]);
    p.rotate( - Math.PI / 5 );
    p.text("vapor", -5, 0);
  p.pop();

  p.push();
    p.textAlign(p.CENTER, p.CENTER);
    labelCoord = barGraphCoordToPixel(-0.08, 1.08);
    p.translate(labelCoord[0], labelCoord[1]);
    p.text("moles", 0, 0);
  p.pop();

}

function drawAll() {
  if ( typeof(p) === "undefined" ) { p = window.gvs.p }
  drawAlpha();
  drawBeta();
  drawVapor();
  drawPlotCurves();
  drawAreaLabels();
  drawAxes();
  drawLinesAndPoints();
  drawBarGraphAxes();
};

module.exports = { drawAll };