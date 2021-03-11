const dp = 200; // "Drawing precision". Increase this to draw with more polygons

function drawText(p, str, x, y, z, w, size, outline) {

  // let camX = window.P5._renderer._curCamera.eyeX;
  // let camY = window.P5._renderer._curCamera.eyeY;
  // let camZ = window.P5._renderer._curCamera.eyeZ;
  
  // let v0 = p.createVector(0, 1, 0);
  // let camVec = p.createVector(camX, camY, camZ);

  // let theta = p.atan2(camX, camZ);
  // let phi = -p.atan2(camY, camVec.mag());
  
  p.textAlign(p.CENTER);

  p.push();
    p.textSize(size);
    p.translate(x, y, z);
    // p.rotate(theta, v0);
    // p.rotateX(phi);
    p.emissiveMaterial(255, 255, 255);
    p.fill(255, 255, 255);
    if(outline) { p.stroke(0) } else { p.noStroke(); }
    p.beginShape();
      p.vertex(-w / 2, -11*size/16, -0.1);
      p.vertex(w / 2, -11*size/16, -0.1);
      p.vertex(w / 2, 11*size/16, -0.1);
      p.vertex(-w / 2, 11*size/16, -0.1);
    p.endShape(p.CLOSE);
    p.translate( - w / 2 + 2, 7, 0.1);
    p.fill(0);
    p.noStroke();
    p.text(str, 0, 0, w);

    // p.plane(w, 25);
  p.pop();
}

const functions = {
  
  drawPiezometer: function(p) {
    const dy = 100; // how far down to translate the image
    const piezoHeight = 250;
    drawText(p, "P  ", 0, -177, 0, 45, 24, true);
    drawText(p, "P ", 3, 103, 60, 30, 24, true);

    p.emissiveMaterial(0, 0, 0);

    p.push();
      p.fill(gvs.fluidColor);
      p.translate(0, 30 + dy, 0);
      p.rotateZ(1.57);
      p.cylinder(30, 350, dp, dp);
    p.pop();

    p.push();
      p.fill(gvs.fluidColor);
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

    const height = Math.round(Number(gvs.h * 100)).toString();
    const bottom = 100;
    drawText(p, `${height} cm`, 70, Math.min(80, dy - gvs.hInPixels / 2 - 5), 0, 70, 20, false);

    p.push();
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

    const dP = Number((gvs.Pf - 101325) / 1000).toFixed(1);
    drawText(p, `P  = P  \u2012 P   = ${dP} kPa`, -151, -157, 0, 240, 20, false);

    p.push();
      p.textSize(12);
      p.textAlign(p.CENTER);
      p.fill(0, 0, 0);
      p.noStroke();
      p.translate(0, 0, 0.5);
      p.text("atm", -5, -179, 30, 40);
      p.translate(0, 0, 60);
      p.text("f", -8, 102, 30, 40);
      p.textSize(10);
      p.translate(1, 1, -60);
      p.text("g", -247, -158, 30, 40);
      p.text("f", -209, -156, 30, 40);
      p.text("atm", -166, -156, 30, 40);
    p.pop();
  },
  
  drawUTube: function(p) {
    const dx = 20;
    const dy = 100;
    const dz = -300;
    const height = 200; // some arbitrary value used as a reference
    const distanceApart = 100;

    p.translate(dx, dy, dz);

    p.push(); // left-side fluid (dynamic cylinder)
      p.ambientMaterial(gvs.fluidColor);
      p.translate(- distanceApart, height / 2 + gvs.hInPixels / 4, 0);
      p.cylinder(30, height - gvs.hInPixels / 2, dp, dp);
    p.pop();

    p.push(); // right-side fluid (dynamic cylinder)
      p.ambientMaterial(gvs.fluidColor);
      p.translate(distanceApart, height / 2 - gvs.hInPixels / 4, 0);
      p.cylinder(30, height + gvs.hInPixels / 2, dp, dp);
    p.pop();

    p.push(); // left-side and right-side fluids (static cylinders, below dynamic cylinder)
      p.ambientMaterial(gvs.fluidColor);
      p.translate(distanceApart, height + 30, 0);
      p.cylinder(30, 60, dp, dp);
      p.translate(-2 * distanceApart, 0);
      p.cylinder(30, 60, dp, dp);
    p.pop();

    p.push(); // bottom fluid (static cylinder, below dynamic cylinder)
      p.translate(0, height + 50, 0);
      p.rotateZ(1.57);
      p.ambientMaterial(gvs.fluidColor);
      p.cylinder(30, 2 * distanceApart + 60, dp, dp);
    p.pop();

    p.push(); // left and right vertical pipes (static)
      p.ambientMaterial(gvs.pipeColor);
      p.translate(distanceApart, 0, 0);
      p.cylinder(40, 2 * height + 80, dp, dp, false, false);
      p.translate(-2 * distanceApart, 30, 0);
      p.cylinder(40, 2 * height + 20, dp, dp, false, false);
    p.pop();

    p.push(); // bottom pipe (static)
      p.translate(0, height + 50, 0);
      p.rotateZ(1.57);

      p.ambientMaterial(gvs.pipeColor);
      p.cylinder(40, 2 * distanceApart + 80, dp, dp);
    p.pop();

    p.push(); // top-left pipe and sphere (static)
      p.ambientMaterial(gvs.pipeColor);
      p.translate(-distanceApart - 50, -height, 0);
      p.rotateZ(1.57);
      p.cylinder(30, 180, dp, dp);
      p.translate(0, 160, 0);
      p.sphere(80, dp, dp);
    p.pop();

    drawText(p, "P  ", distanceApart - 5, - height - 80, 0, 80, 38, false);
    drawText(p, "P ", - distanceApart - 180, -height + 10, 82, 50, 38, false);
    const h = Math.round(Number(gvs.h * 100)).toString();
    drawText(p, `${h} cm`, distanceApart + 165, 10, 0, 150, 38, false);

    p.push();
      p.emissiveMaterial(0, 0, 0);
      p.fill(0);
      p.noStroke();
      p.translate(distanceApart + 80, 0, 0);
      p.cylinder(1, gvs.hInPixels, 100, 100);
      p.translate(-distanceApart - 15, gvs.hInPixels / 2, 0);
      p.rotateZ(1.57);
      p.cylinder(1, 260, dp, dp);
      p.translate(-gvs.hInPixels, -distanceApart, 0);
      p.cylinder(1, 50, dp, dp);
    p.pop();

    const dP = Number((gvs.Pf - 101325) / 1000).toFixed(1);
    drawText(p, `P  = P  \u2012 P    = ${dP} kPa`, -200, -350, 0, 450, 38, false);

    p.push();
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.fill(0, 0, 0);
      p.noStroke();
      p.translate(5, 2, 0.2);
      p.text("atm", 85, -288, 50, 40);
      p.text("g", -378, -362, 30, 40);
      p.text("f", -307, -357, 30, 40);
      p.text("atm", -230, -357, 50, 40);
      p.translate(0, 0, 82);
      p.text("f", -291, -195, 30, 40);
    p.pop();
  },

  drawInclined: function(p) {

    const dx = -60;
    const dy = 60;
    const dz = 150;

    const wt = 2; // wall thickness
    const rectRadius = 2;
    const heightOfContainer = 120;
    const cylinderRadius = 40;
    const defaultLiquidHeight = heightOfContainer / 3;
    const containerLiquidHeight = defaultLiquidHeight - gvs.hInPixels / 10;

    const thetaRad = p.TWO_PI*(gvs.theta / 360);

    const L = gvs.hInPixels / Math.sin( thetaRad ); // "length of liquid"
    const liqY = defaultLiquidHeight + gvs.hInPixels;
    const liqX = liqY / Math.tan( thetaRad );
    const liqDefaultX = defaultLiquidHeight / Math.tan( thetaRad );
    const liquidXLength = 2 * rectRadius / Math.tan( thetaRad );

    const Pf = Number(gvs.Pf / 1000).toFixed(1);
    const dP = Number((gvs.Pf - 101325) / 1000).toFixed(1);
    const height = Math.round(Number(gvs.h * 100)).toString();
    
    p.translate(dx, dy, dz);
    p.emissiveMaterial(0, 0, 0);

    // draw the inclined fluid
    p.push();
      p.noStroke();
      p.fill(gvs.fluidColor);
      p.beginShape();// front
        p.vertex( 0, 0, -rectRadius);
        p.vertex( 0, -2 * rectRadius, -rectRadius);
        p.vertex( liqX - liquidXLength, -liqY, -rectRadius);
        p.vertex( liqX, -liqY, -rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();//back
        p.vertex( 0, 0, rectRadius);
        p.vertex( 0, -2 * rectRadius, rectRadius);
        p.vertex( liqX - liquidXLength, -liqY, rectRadius);
        p.vertex( liqX, -liqY, rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();//top
        p.vertex( 0, -2 * rectRadius, -rectRadius);
        p.vertex( 0, -2 * rectRadius, rectRadius);
        p.vertex( liqX - liquidXLength, -liqY, rectRadius);
        p.vertex( liqX - liquidXLength, -liqY, -rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();//bottom
        p.vertex( 0, 0, -rectRadius);
        p.vertex( 0, 0, rectRadius);
        p.vertex( liqX, -liqY, rectRadius);
        p.vertex( liqX, -liqY, -rectRadius);
      p.endShape(p.CLOSE);
      p.beginShape();//cap
        p.vertex( liqX - liquidXLength, -liqY, -rectRadius);
        p.vertex( liqX, -liqY, -rectRadius);
        p.vertex( liqX, -liqY, rectRadius);
        p.vertex( liqX - liquidXLength, -liqY, rectRadius);
      p.endShape(p.CLOSE);
    p.pop();

    // draw the liquid in the container
    p.push();
      p.fill(gvs.fluidColor);
      p.translate( -cylinderRadius, -containerLiquidHeight / 2, 0);
      p.cylinder(cylinderRadius, containerLiquidHeight, dp, dp);
    p.pop();

    // draw the inclined pipe
    p.push();
      const Hp = heightOfContainer; // "Height of pipe"
      const pipeX = Hp / Math.tan( thetaRad ); // "Length of pipe"
      const cutawayWidth = wt / Math.tan( thetaRad );
      p.ambientMaterial(gvs.pipeColor);
      p.beginShape();//front
        p.vertex( 0, - 2 * rectRadius - wt, -rectRadius - wt);
        p.vertex( pipeX - liquidXLength - cutawayWidth, -Hp, -rectRadius - wt);
        p.vertex( pipeX + cutawayWidth, -Hp, -rectRadius - wt);
        p.vertex( 0, wt, -rectRadius - wt);
      p.endShape(p.CLOSE);
      p.beginShape();//back
        p.vertex( 0, - 2 * rectRadius - wt, rectRadius + wt);
        p.vertex( pipeX - liquidXLength - cutawayWidth, -Hp, rectRadius + wt);
        p.vertex( pipeX + cutawayWidth, -Hp, rectRadius + wt);
        p.vertex( 0, wt, rectRadius + wt);
      p.endShape(p.CLOSE);
      p.beginShape();//top
        p.vertex( 0, -2 * rectRadius - wt, rectRadius + wt);
        p.vertex( 0, -2 * rectRadius - wt, -rectRadius - wt);
        p.vertex( pipeX - liquidXLength - cutawayWidth, -Hp, -rectRadius - wt);
        p.vertex( pipeX - liquidXLength - cutawayWidth, -Hp, rectRadius + wt);
      p.endShape(p.CLOSE);
      p.beginShape();//bottom
        p.vertex( 0, wt, rectRadius + wt);
        p.vertex( 0, wt, -rectRadius - wt);
        p.vertex( pipeX + cutawayWidth, -Hp, -rectRadius - wt);
        p.vertex( pipeX + cutawayWidth, -Hp, rectRadius + wt);
      p.endShape(p.CLOSE);

    p.pop();

    p.push(); // draw container with cone and top cylinder
      const coneHeight = 40;
      p.ambientMaterial(gvs.pipeColor);
      p.translate(-cylinderRadius, - heightOfContainer / 2 + wt, 0);
      p.cylinder(cylinderRadius + wt, heightOfContainer, dp, dp);
      p.translate(0, -heightOfContainer / 2 - coneHeight / 2 - 0.01, 0);
      p.rotateZ(p.PI);
      p.cone(cylinderRadius + wt, coneHeight);
      p.rotateZ(-p.PI);
      p.translate(0, -coneHeight / 2, 0);
      p.cylinder(cylinderRadius / 5, 20, dp, dp);
    p.pop();

    p.push(); // draw the "default liquid height" demarcation black lines on the inclined manometer
      const dc = 1; // a unit of of wiggle room
      const edgeRadius = 0.25; // radius of the line drawn around incline
      const lengthOfEdge = liquidXLength + 2 * cutawayWidth;
      let translateX = liqDefaultX - liquidXLength / 2;
      p.translate(translateX, -defaultLiquidHeight, rectRadius + wt + dc);
      p.rotateZ(p.PI / 2);
      p.cylinder(edgeRadius, lengthOfEdge + 3 * dc / 2, dp, dp);
      p.translate(0, 0, - rectRadius - 4 * wt - 2 * dc);
      p.cylinder(edgeRadius, lengthOfEdge + 3 * dc / 2, dp, dp);
      p.translate(0, 0, (rectRadius + 4 * wt + 2 * dc) / 2);
      p.rotateX(p.PI / 2);
      p.translate(0, 0, lengthOfEdge / 2 + dc / 2);
      p.cylinder(edgeRadius, rectRadius + 4 * wt + 2 * dc, dp, dp);
      p.translate(0, 0, - lengthOfEdge - 3 * dc / 2);
      p.cylinder(edgeRadius, rectRadius + 4 * wt + 2 * dc, dp, dp);
    p.pop();

    p.translate(10, -defaultLiquidHeight, 0);

    p.push();
      p.translate(0, - 9 * gvs.hInPixels / 20);
      p.cylinder(edgeRadius, 11 * gvs.hInPixels / 10, dp, dp);
    p.pop();
    p.push();
      p.translate(0, gvs.hInPixels / 10, 0);
      p.rotateZ( p.PI / 2 );
      p.cylinder(edgeRadius, 10, dp, dp);
    p.pop();
    p.push();
      p.translate(0, -gvs.hInPixels, 0);
      const spanLength = liqX - liquidXLength - cutawayWidth; // horizontal distance from edge of container to the end of the liquid
      p.rotateZ( p.PI / 2 );
      p.cylinder(edgeRadius, 10, dp, dp);
      const dashDistance = 5;
      const dashWidth = 2;
      p.translate(0, -dashDistance / 2, 0);
      for ( let i = 10; i < spanLength; i += dashDistance ) {
        p.translate(0, -dashDistance, 0);
        p.cylinder(edgeRadius, dashWidth, dp, dp);
      }
    p.pop();

    p.push(); // draw h = x cm
      p.translate(0, - gvs.hInPixels - 10, 0);
      p.textSize(12);
      p.fill(0);
      p.noStroke();
      p.textAlign(p.LEFT);
      p.text(`h = ${height} cm`, 0, 0);
    p.pop();

    p.translate(-10, defaultLiquidHeight, 0);

    const margin = 8;
    p.push(); // draw the angled, black measurement line
      p.translate(liqDefaultX, -defaultLiquidHeight, rectRadius + wt); // we are now edge of the black demarcation
      p.rotateZ( p.PI/2 - thetaRad);
      p.translate(margin, - L / 2 - 3, 0);
      p.cylinder(edgeRadius, L, dp, dp);
      p.translate(0, L / 2, 0);
      p.rotateZ(p.PI / 2);
      p.cylinder(edgeRadius, 3, dp, dp);
      p.translate(-L, 0, 0);
      p.cylinder(edgeRadius, 3, dp, dp);
    p.pop();

    p.push();
      p.translate(liqDefaultX, -defaultLiquidHeight, rectRadius + wt);
      p.rotateZ( p.PI/2 - thetaRad);
      p.translate(margin, - L / 2 - 3, 0);
      p.translate(20, 0, 0);
      p.rotateZ( -p.PI/2 + thetaRad );
      p.translate(15, 0, 0);
      const length = Number(100 * gvs.h / Math.sin( thetaRad ) ).toFixed(0);
      p.text(`L = ${length} cm`, 0, 0);
    p.pop();

    p.push();
      p.ambientMaterial(0, 0, 0);
      p.translate(100, -190, 0);
      p.noStroke();
      p.fill(0, 0, 0);
      p.textSize(14);
      p.text(`P  = P  \u2012 P    = ${dP} kPa`, 0, 0);
      p.textSize(8);
      p.translate(-58, 3, 0.1);
      p.text("g", 0, 0);
      p.translate(27, 1, 0);
      p.text("f", 0, 0);
      p.translate(31, 0, 0);
      p.text("atm", 0, 0);
    p.pop();

    p.push();
      p.ambientMaterial(0, 0, 0);
      p.noStroke();
      p.fill(0, 0, 0);
      p.textSize(12);
      p.translate(-cylinderRadius, -heightOfContainer - coneHeight - 15, 0);
      p.cone(2, 5);
      p.translate(0, -6, 0);
      p.cylinder(edgeRadius, 10, dp, dp);
      p.translate(-5, -14, 0);
      p.text("P", 0, 0);
      p.textSize(8);
      p.translate(4, 4, 0.1);
      p.text("f", 0, 0);
    p.pop();

    p.push();
      p.ambientMaterial(0, 0, 0);
      p.noStroke();
      p.fill(0, 0, 0);
      p.textSize(12);
      p.translate(pipeX - 10, -Hp - 10, 0);
      p.text("P", 0, 0);
      p.textSize(8);
      p.translate(10, 4, 0.1);
      p.text("atm", 0, 0);
    p.pop();
  }

};

module.exports = functions;