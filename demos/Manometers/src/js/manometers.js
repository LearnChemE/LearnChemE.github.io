const dp = 200; // "Drawing precision". Increase this to draw with more polygons

const functions = {
  
  drawPiezometer: function(p) {
    const dy = 100; // how far down to translate the image
    const piezoHeight = 250;
    p.push();
      p.ambientMaterial(gvs.fluidColor);
      p.translate(0, 30 + dy, 0);
      p.rotateZ(1.57);
      p.cylinder(30, 350, dp, dp);

      p.ambientMaterial(gvs.pipeColor);
      p.cylinder(35, 360, dp, dp);
    p.pop();

    p.push();
      p.ambientMaterial(gvs.fluidColor);
      p.translate(0, dy - gvs.hInPixels / 2, 0);
      p.cylinder(20, gvs.hInPixels, dp, dp);
    p.pop();

    p.push();
      p.translate(0, dy - piezoHeight / 2, 0);
      p.ambientMaterial(gvs.pipeColor);
      p.cylinder(25, piezoHeight, dp, dp);
    p.pop();
  },
  
  drawUTube: function(p) {
    const dx = 20;
    const dy = 40;
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
  },

  drawInclined: function(p) {
    const rectRadius = 10;
    const beginY = 60;
    const beginX = - beginY / Math.sin( p.TWO_PI*(gvs.theta / 360) );
    const dx = -150 - beginX;
    const dy = 10;
    const dz = -120;

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

}

module.exports = functions;