let p;

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
  const cnvHeight = p.height;
  const cnvWidth = p.width;
  const yPix = p.height - plotOptions.marginBottom - p.map(y, plotOptions.yRange[0], plotOptions.yRange[1], 0, plotOptions.height);
  const xPix = plotOptions.marginLeft + p.map(x, plotOptions.xRange[0], plotOptions.xRange[1], 0, plotOptions.width);
  return [xPix, yPix];
}

function drawBorder() {
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

function drawAll() {
  if ( typeof(p) === "undefined" ) { p = window.gvs.p }
  drawBorder();
};

module.exports = { drawAll };