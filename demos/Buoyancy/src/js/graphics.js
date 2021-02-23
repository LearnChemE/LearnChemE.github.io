let arrowTop, arrowBottom, arrowMiddle;

const graphics = {
  
  rectangularPrism: function(p) {
    p.push();
      const h = gvs.objectHeightInPixels;
      let pixelY;
      if ( gvs.heightAboveWater != -1 ) {
        pixelY = p.height / 2 + h / 2 - gvs.heightAboveWater * h;
      } else {
        pixelY = p.height - h / 2 - 5;
      }
      p.rectMode(p.CENTER);
      p.fill(255, 100, 100);
      p.rect(p.width / 2, pixelY, gvs.objectHeightInPixels, gvs.objectHeightInPixels);
    p.pop();
  },

  water: function(p) {
    p.push();
      p.fill("rgba(0, 0, 255, 0.3)");
      p.noStroke();
      p.rect(0, p.height / 2, p.width, p.height);
    p.pop();
  },
  
  arrow: function(p) {
    p.push();
      if ( gvs.heightAboveWater != -1 ) {
        arrowTop = p.height / 2 - gvs.heightAboveWater * gvs.objectHeightInPixels;
        arrowBottom = p.height / 2;
        arrowMiddle = (arrowTop + arrowBottom) / 2;
        p.strokeWeight(1.5);
        p.line(p.width / 2, arrowTop, p.width / 2, arrowBottom);
        p.line(p.width / 2, arrowTop, p.width / 2 - 10, arrowTop + 10);
        p.line(p.width / 2, arrowTop, p.width / 2 + 10, arrowTop + 10);
        p.line(p.width / 2, arrowBottom, p.width / 2 - 10, arrowBottom - 10);
        p.line(p.width / 2, arrowBottom, p.width / 2 + 10, arrowBottom - 10);
      } else {

      }
    p.pop();
  },

  text: function(p) {
    p.push();
      const volume = Number(gvs.objectVolume).toFixed(2);
      const displacedVolume = Number(gvs.liquidVolumeDisplaced).toFixed(2);
      const objectWeight = Number(gvs.objectWeight).toFixed(2);
      const buoyantForce = Number(gvs.buoyantForce).toFixed(2);
      const height = Number(gvs.heightAboveWater).toFixed(2);
      p.textSize(20);
      p.text(`liquid surface`, 20, p.height / 2 - 10);
      p.text(`cube volume: ${volume} m`, 20, 30);
      p.text(`displaced liquid volume: ${displacedVolume} m`, 20, 60);
      p.text(`weight of cube: ${objectWeight} kN`, p.width / 2 + 30, 30);
      p.text(`buoyant force: ${buoyantForce} kN`, p.width / 2 + 30, 60);
      p.rectMode(p.CENTER);
      if ( gvs.heightAboveWater != -1 ) {
        p.rect(p.width / 2 + 80, arrowMiddle, 120, 30);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`h = ${height} m`, p.width / 2 + 80, arrowMiddle + 1);
      }
      p.textSize(12);
      p.text("3", 302, 48);
      p.text("3", 209, 18);
    p.pop();
  },

}

module.exports = graphics;