let p;
const { cplA, cplB, cpvA, cpvB, HvA, HvB, f1, f2, f3, f4, f5, f6, f7 } = require("./calcs.js");

const plotOptions = {
  marginLeft: 60,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 60,
  width: 400,
  height: 400,
  xRange: [0, 1],
  yRange: [60, 100],
};

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
}

function drawAlpha() {
  p.push();
    p.fill(255, 100, 100, 120);
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
    p.fill(100, 100, 225, 120);
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
    p.fill(50, 150, 80, 120);
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

function drawLines() {
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

function drawAll() {
  if ( typeof(p) === "undefined" ) { p = window.gvs.p }
  drawAlpha();
  drawBeta();
  drawVapor();
  drawLines();
  drawAxes();
};

module.exports = { drawAll };