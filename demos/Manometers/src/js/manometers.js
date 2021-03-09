const dp = 200; // "Drawing precision". Increase this to draw with more polygons

function drawText(p, str, x, y, z, w, size, outline) {

  let camX = window.P5._renderer._curCamera.eyeX;
  let camY = window.P5._renderer._curCamera.eyeY;
  let camZ = window.P5._renderer._curCamera.eyeZ;
  
  let v0 = p.createVector(0, 1, 0);
  let camVec = p.createVector(camX, camY, camZ);

  let theta = p.atan2(camX, camZ);
  let phi = -p.atan2(camY, camVec.mag());
  
  p.textAlign(p.CENTER);

  p.push();
    p.fill(0);
    p.noStroke();
    p.textSize(size);
    p.translate(x, y, z);
    p.rotate(theta, v0);
    p.rotateX(phi);
    p.text(str, 0, 0, w);
    p.translate(w / 2 - 2, -8, -1);
    p.emissiveMaterial(255, 255, 255);
    if(outline) { p.stroke(0) } else { p.noStroke(); }
    p.beginShape();
      p.vertex(-w / 2, -5*size/8, 0);
      p.vertex(w / 2, -5*size/8, 0);
      p.vertex(w / 2, 5*size/8, 0);
      p.vertex(-w / 2, 5*size/8, 0);
    p.endShape(p.CLOSE);
    // p.plane(w, 25);
  p.pop();
}

const functions = {
  
  drawPiezometer: function(p) {
    const dy = 100; // how far down to translate the image
    const piezoHeight = 250;
    drawText(p, "P\u2090", -10, -170, 0, 30, 24, true);
    drawText(p, "P\u2092", -10, 110, 60, 30, 24, true);

    p.push();
      p.ambientMaterial(gvs.fluidColor);
      p.translate(0, 30 + dy, 0);
      p.rotateZ(1.57);
      p.cylinder(30, 350, dp, dp);
    p.pop();

    p.push();
      p.ambientMaterial(gvs.fluidColor);
      p.translate(0, dy - gvs.hInPixels / 2, 0);
      p.cylinder(10, gvs.hInPixels + 10, dp, dp);
    p.pop();

    p.push();
      p.translate(0, 30 + dy, 0);
      p.rotateZ(1.57);
      p.ambientMaterial(gvs.pipeColor);
      p.cylinder(35, 360, dp, dp);
    p.pop();

    p.push();
      p.translate(0, dy - piezoHeight / 2, 0);
      p.ambientMaterial(gvs.pipeColor);
      p.cylinder(15, piezoHeight, dp, dp);
    p.pop();

    p.push();
      const height = Math.round(Number(gvs.h * 100)).toString();
      const bottom = 100;
      drawText(p, `${height} cm`, 50, dy - gvs.hInPixels / 2, 0, 70, 20, false);
      p.fill(0);
      p.noStroke();
      p.translate(30, bottom - gvs.hInPixels / 2, 0);
      p.cylinder(1, gvs.hInPixels, 100, 100);
      p.translate(0, - gvs.hInPixels / 2, 0);
      p.rotateZ(1.57);
      p.cylinder(1, 10, 100, 100);
      p.translate(gvs.hInPixels - 5, 0, 0);
      p.cylinder(1, 10, 100, 100);
    p.pop();

    p.push();
      const arrowLength = 100;
      p.emissiveMaterial(0, 0, 0);
      p.rotateZ(1.57);
      p.translate(120, 100, 40);
      p.cylinder(1, arrowLength, 100, 100);
      p.translate(0, - arrowLength / 2, 0);
      p.rotateZ(-p.PI);
      p.cone(6, 20);
      p.translate(0, 140, 0);
      p.cylinder(1, arrowLength, 100, 100);
      p.translate(0, arrowLength / 2, 0);
      p.cone(6, 20);
    p.pop();

    p.push();
      const dp = Number((gvs.Pf - 101325) / 1000).toFixed(1);
      drawText(p, `\u0394P = P\u2092 \u2012 P\u2090 = ${dp} kPa`, -270, -150, -10, 240, 20, false);
    p.pop();
  },
  
  drawUTube: function(p) {
    const dx = 20;
    const dy = 100;
    const dz = -300;
    const height = 200; // some arbitrary value used as a reference
    const distanceApart = 100;

    p.push(); // left-side fluid (dynamic cylinder)
      p.ambientMaterial(gvs.fluidColor);
      p.translate(dx - distanceApart, dy + height / 2 + gvs.hInPixels / 4, dz);
      p.cylinder(30, height - gvs.hInPixels / 2, dp, dp);
    p.pop();

    p.push(); // right-side fluid (dynamic cylinder)
      p.ambientMaterial(gvs.fluidColor);
      p.translate(dx + distanceApart, dy + height / 2 - gvs.hInPixels / 4, dz);
      p.cylinder(30, height + gvs.hInPixels / 2, dp, dp);
    p.pop();

    p.push(); // left-side and right-side fluids (static cylinders, below dynamic cylinder)
      p.ambientMaterial(gvs.fluidColor);
      p.translate(dx, dy, dz);
      p.translate(distanceApart, height + 30, 0);
      p.cylinder(30, 60, dp, dp);
      p.translate(-2 * distanceApart, 0);
      p.cylinder(30, 60, dp, dp);
    p.pop();

    p.push(); // bottom fluid (static cylinder, below dynamic cylinder)
      p.translate(dx, dy, dz);
      p.translate(0, height + 50, 0);
      p.rotateZ(1.57);
      p.ambientMaterial(gvs.fluidColor);
      p.cylinder(30, 2 * distanceApart + 60, dp, dp);
    p.pop();

    p.push(); // left and right vertical pipes (static)
      p.ambientMaterial(gvs.pipeColor);
      p.translate(dx + distanceApart, dy, dz);
      p.cylinder(40, 2 * height + 80, dp, dp, false, false);
      p.translate(-2 * distanceApart, 30, 0);
      p.cylinder(40, 2 * height + 20, dp, dp, false, false);
    p.pop();

    p.push(); // bottom pipe (static)
      p.translate(dx, dy, dz);
      p.translate(0, height + 50, 0);
      p.rotateZ(1.57);

      p.ambientMaterial(gvs.pipeColor);
      p.cylinder(40, 2 * distanceApart + 80, dp, dp);
    p.pop();

    p.push(); // top-left pipe and sphere (static)
      p.ambientMaterial(gvs.pipeColor);
      p.translate(dx, dy, dz);
      p.translate(-distanceApart - 50, -height, 0);
      p.rotateZ(1.57);
      p.cylinder(30, 180, dp, dp);
      p.translate(0, 160, 0);
      p.sphere(80, dp, dp);
    p.pop();

    p.push();
      p.translate(dx, dy, dz);
      drawText(p, "P\u2090", distanceApart - 40, -height - 70, 0, 80, 38, false);
      drawText(p, "P\u2092", -distanceApart - 200, -height + 10, 120, 50, 38, false);
      const h = Math.round(Number(gvs.h * 100)).toString();
      drawText(p, `${h} cm`, distanceApart + 100, 30, 0, 150, 38, false);
    p.pop();

    p.push();
      p.emissiveMaterial(0, 0, 0);
      p.fill(0);
      p.noStroke();
      p.translate(dx, dy, dz);
      p.translate(distanceApart + 80, 0, 0);
      p.cylinder(1, gvs.hInPixels, 100, 100);
      p.translate(-distanceApart - 15, gvs.hInPixels / 2, 0);
      p.rotateZ(1.57);
      p.cylinder(1, 260, dp, dp);
      p.translate(-gvs.hInPixels, -distanceApart, 0);
      p.cylinder(1, 50, dp, dp);
    p.pop();

    p.push();
      p.translate(dx, dy, dz);
      const dP = Number((gvs.Pf - 101325) / 1000).toFixed(1);
      drawText(p, `\u0394P = P\u2092 \u2012 P\u2090 = ${dP} kPa`, -200, -350, 0, 400, 38, false);
    p.pop();
  },

  drawInclined: function(p) {
    const rectRadius = 10;
    const beginY = 60;
    const beginX = - beginY / Math.sin( p.TWO_PI*(gvs.theta / 360) );
    const dx = -150 - beginX;
    const dy = -20;
    const dz = 0;

    const L = gvs.hInPixels / Math.sin( p.TWO_PI*(gvs.theta / 360) ); // "length of liquid"
    
    // draw the inclined fluid
    p.push();
      p.translate(dx, dy, dz);
      p.noStroke();
      p.fill(gvs.fluidColor);
      p.beginShape();
        p.vertex(beginX, beginY - rectRadius, rectRadius);
        p.vertex(beginX, beginY - rectRadius, -rectRadius);
        p.vertex(L, -rectRadius - gvs.hInPixels, -rectRadius);
        p.vertex(L, -rectRadius - gvs.hInPixels, rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(L, -rectRadius - gvs.hInPixels, -rectRadius);
        p.vertex(L + rectRadius / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - gvs.hInPixels, -rectRadius);
        p.vertex(L + rectRadius / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - gvs.hInPixels, rectRadius);
        p.vertex(L, -rectRadius - gvs.hInPixels, rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(beginX, beginY, rectRadius);
        p.vertex(beginX, beginY, -rectRadius);
        p.vertex(L + rectRadius / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - gvs.hInPixels, -rectRadius);
        p.vertex(L + rectRadius / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - gvs.hInPixels, rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(beginX, beginY, rectRadius);
        p.vertex(beginX, beginY - rectRadius, rectRadius);
        p.vertex(L, -rectRadius - gvs.hInPixels, rectRadius);
        p.vertex(L + rectRadius / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - gvs.hInPixels, rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(beginX, beginY, -rectRadius);
        p.vertex(beginX, beginY - rectRadius, -rectRadius);
        p.vertex(L, -rectRadius - gvs.hInPixels, -rectRadius);
        p.vertex(L + rectRadius / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - gvs.hInPixels, -rectRadius);
      p.endShape(p.CLOSE);
    p.pop();

    // draw the inclined pipe
    p.push();
      const wt = 5; // "wall thickness"
      const Hp = 50; // "Height of pipe"
      const Lp = Hp / Math.sin( p.TWO_PI * (gvs.theta / 360) ); // "Length of pipe"
      p.ambientMaterial(gvs.pipeColor);
      p.translate(dx, dy, dz);
      p.noStroke();
      p.fill(gvs.pipeColor);
      p.beginShape();
        p.vertex(beginX, beginY - rectRadius - wt, rectRadius + wt);
        p.vertex(beginX, beginY - rectRadius - wt, -rectRadius - wt);
        p.vertex(Lp, -rectRadius - wt - Hp, -rectRadius - wt);
        p.vertex(Lp, -rectRadius - wt - Hp, rectRadius + wt);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(Lp, -rectRadius - wt - Hp, -rectRadius - wt);
        p.vertex(Lp + (rectRadius + 2 * wt) / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - wt - Hp, -rectRadius - wt);
        p.vertex(Lp + (rectRadius + 2 * wt) / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - wt - Hp, rectRadius + wt);
        p.vertex(Lp, -rectRadius - wt - Hp, rectRadius + wt);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(beginX, beginY + wt, rectRadius + wt);
        p.vertex(beginX, beginY + wt, - rectRadius - wt);
        p.vertex(Lp + (rectRadius + 2 * wt) / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - wt - Hp, -rectRadius - wt);
        p.vertex(Lp + (rectRadius + 2 * wt) / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - wt - Hp, rectRadius + wt);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(beginX, beginY + wt, rectRadius + wt);
        p.vertex(beginX, beginY - rectRadius - wt, rectRadius + wt);
        p.vertex(Lp, -rectRadius - wt - Hp, rectRadius + wt);
        p.vertex(Lp + (rectRadius + 2 * wt) / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - wt - Hp, rectRadius + wt);
      p.endShape(p.CLOSE);
      p.beginShape();
        p.vertex(beginX, beginY + wt, -rectRadius - wt);
        p.vertex(beginX, beginY - rectRadius - wt, -rectRadius - wt);
        p.vertex(Lp, -rectRadius - wt - Hp, -rectRadius - wt);
        p.vertex(Lp + (rectRadius + 2 * wt) / Math.sin( p.TWO_PI*(gvs.theta / 360) ), -rectRadius - wt - Hp, -rectRadius - wt);
      p.endShape(p.CLOSE);
    p.pop();

    const cylinderRadius = 40;
    const cylinderLiquidHeight = beginY + rectRadius - gvs.hInPixels;
    const zeroPoint = - rectRadius; // when delta P is zero, both liquid levels are here
    const bottomOfCylinder = zeroPoint + beginY + rectRadius;
    
    // draw the liquid in the container
    p.push();
      p.translate(dx, dy, dz);
      p.translate(-cylinderRadius + beginX, bottomOfCylinder - cylinderLiquidHeight / 2, 0);
      p.ambientMaterial(gvs.fluidColor);
      p.cylinder(cylinderRadius, cylinderLiquidHeight, dp, dp);
    p.pop();

    const heightOfContainer = 120;

    p.push();
      p.ambientMaterial(gvs.pipeColor);
      p.translate(dx, dy, dz);
      p.translate(-cylinderRadius + beginX, bottomOfCylinder - heightOfContainer / 2, 0);
      p.cylinder(cylinderRadius + wt, heightOfContainer, dp, dp);
    p.pop();
  }

};

window.gvs.zoom = function(event) {
  // zoom according to direction of mouseWheelDeltaY rather than value
  let sensitivityZoom = 0.05;
  let scaleFactor = window.P5.height;
  if (event.deltaY > 0) {
    window.P5._renderer._curCamera._orbit(0, 0, sensitivityZoom * scaleFactor);
  } else {
    window.P5._renderer._curCamera._orbit(0, 0, -sensitivityZoom * scaleFactor);
  }
}

module.exports = functions;