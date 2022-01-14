const coolant_color = gvs.p.color(240, 240, 255);
const liquid_color = gvs.p.color(200, 200, 255);
const top_of_liquid_color = gvs.p.color(170, 170, 255);

function translate_to_column(p) {
  p.translate(p.width / 4 - 40, p.height / 2);
}

function drawColumn(p) {
  p.push();
    translate_to_column(p);
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rectMode(p.CENTER);
    // Draw the tank at the bottom of the column
    p.rect(0, 100, 100, 100, 25, 25, 20, 20);
    // Draw the rounded rectangle at the top of the column
    p.rect(0, -135, 40, 40, 5);
    // Draw the outline of the "column" part of the rig
    p.line(16, 50, 16, -115);
    p.line(-16, 50, -16, -115);
    p.noStroke();
    // Draw the "column" part of the rig
    p.fill(255, 255, 255);
    p.rect(0, -35, 30, 180);
    // Draw the stem on the condenser and the condenser itself
    p.translate(83, -68);
    p.rotate(-Math.PI / 4);
    p.fill(coolant_color);
    // The condenser itself (blue)
    p.rect(0, 0, 35, 140);
    p.rect(25, -60, 15, 10);
    p.rect(-25, 60, 15, 10);
    p.fill(255, 255, 255);
    // The stem coming out the top of the rig
    p.rect(0, 0, 15, 200);
    p.stroke(0);
    p.strokeWeight(1);
    // Draw the lines around the condenser
    p.line(-32.5, 65, -17.5, 65);
    p.line(-17.5, 65, -17.5, 70);
    p.line(-17.5, 70, -10, 70);
    p.line(17.5, 70, 10, 70);
    p.line(17.5, 70, 17.5, -55);
    p.line(17.5, -55, 32.5, -55);
    p.line(17.5, -65, 32.5, -65);
    p.line(17.5, -65, 17.5, -70);
    p.line(17.5, -70, 10, -70);
    p.line(-10, -70, -17.5, -70);
    p.line(-17.5, -70, -17.5, 55);
    p.line(-17.5, 55, -32.5, 55);
    p.line(7.5, -96, 7.5, 100);
    p.line(-7.5, -80, -7.5, 102);
    p.translate(7.5, 100);
    p.rotate(Math.PI / 4);
    p.line(0, 0, 0, 12);
    p.noStroke();
    p.noFill();
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0, 15);
    p.vertex(-10, 10);
    p.endShape();
  p.pop();
}

function drawStillLiquid(p, lvl) {
  p.push();
  p.fill(liquid_color);
  p.noStroke();
  translate_to_column(p);
  p.rectMode(p.CORNER);
  p.rect(-49, 149, 98, Math.min(-40, -80 + 80 * (1 - lvl)), 18, 18, 0, 0);
  p.fill(255, 255, 255);
  p.rect(-49, 50, 98, (1 - lvl) * 80 + 20);
  if(lvl > 0.2) {
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(top_of_liquid_color);
    p.ellipse(0, 70 + 80 * (1 - lvl), 98, 5);
  } else {
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(top_of_liquid_color);
    p.ellipse(0, 70 + 80 * (1 - lvl), 98 - 23 * (0.2 - lvl) / 0.2, 5 - 4 * (0.2 - lvl) / 0.2);
  }
  p.pop();
}

function drawStillLiquidLabel(p) {
  p.push();
    p.textSize(18);
    p.fill(0);
    p.noStroke();
    translate_to_column(p);
    p.textAlign(p.LEFT);
    const xB = gvs.xB < 0.01 || gvs.xB > 0.99 ? gvs.xB.toFixed(3) : gvs.xB.toFixed(2);
    p.text(`x  = ${xB}`, -145, 95);
    p.text(`${gvs.B.toFixed(2)} mol`, -145, 125);
    p.textSize(12);
    p.text(`B`, -135, 100);
    p.stroke(0);
    p.noFill();
    p.line(-65, 105, -30, 105);
    p.fill(0);
    p.triangle(-30, 105, -40, 108, -40, 102);
  p.pop();
}

function drawTemperatureLabel(p) {
  p.push();
    translate_to_column(p);
    p.textSize(18);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER);
    p.text(`${(gvs.T).toFixed(1)}° C`, 0, -170);

    // Draw thermometer
    p.strokeWeight(2);
    p.stroke(0);
    p.fill(255, 100, 100);
    p.circle(-50, -150, 20);
    // p.noStroke();
    p.fill(255);
    p.rectMode(p.CENTER);
    p.rect(-50, -183, 10, 50, 4, 4, 0, 0);
    p.rectMode(p.CORNER);
    p.noStroke();
    p.fill(255, 100, 100);
    p.rect(-54, -157, 8, -5 - 45 * (gvs.T - 77.5) / ( 118.85 - 77.5 ));
  p.pop();
}

function otherLabels(p) {
  p.push();
  translate_to_column(p);
  p.textSize(18);
  p.textAlign(p.LEFT);
  const y = gvs.xD < 0.01 || gvs.xD > 0.99 ? gvs.xD.toFixed(3) : gvs.xD.toFixed(2);
  p.text(`y  = ${y}`, -115, -50);
  p.stroke(0);
  p.strokeWeight(1);
  p.line(-30, -60, 0, -70);
  p.translate(0, -70);
  p.rotate(-0.3398);
  p.fill(0);
  p.triangle(0, 0, -10, -4, -10, 4);
  p.rotate(0.3398);
  p.translate(0, 70);
  p.noStroke();
  p.textSize(11);
  p.text(`B`, -106, -46);
  p.textSize(15);
  p.text("coolant", 80, -150);
  p.translate(70, -140);
  p.rotate(-Math.PI / 4);
  p.stroke(0);
  p.line(10, 0, -10, 0);
  p.triangle(-10, 0, 0, -3.5, 0, 3.5);
  p.translate(-90, 120);
  p.line(15, 0, -10, 0);
  p.triangle(-10, 0, 0, -3.5, 0, 3.5);
  p.pop();
}

function pouringLiquid(p) {
  p.push();
  translate_to_column(p);
  p.fill(liquid_color);
  p.noStroke();
  p.rectMode(p.CORNER);
  p.rect(151, 10, 8, 100);
  p.pop();
}

function drawHeater(p) {
  p.push();
  translate_to_column(p);
  p.rectMode(p.CENTER);
  p.fill(255, 180, 180);
  p.rect(0, 159, 100, 15);
  p.image(gvs.coil_img, -44, 152.5, 88, 13);
  p.pop();
}

gvs.plot_points = function() {
  switch(gvs.display) {
    case "flasks":
      return;
    break;

    case "eq":
      gvs.eq_plot_point.coord = [gvs.xB, gvs.xD];
      const pix = gvs.eq_plot.coordToPix(gvs.xB, gvs.xD);
      gvs.eq_plot_point.setAttribute("cx", pix[0]);
      gvs.eq_plot_point.setAttribute("cy", pix[1]);
    break;

    case "txy":
      gvs.txy_plot_point_x.coord = [gvs.xB, gvs.T];
      gvs.txy_plot_point_y.coord = [gvs.xD, gvs.T];
      const x_pix = gvs.txy_plot.coordToPix(gvs.xB, gvs.T);
      const y_pix = gvs.txy_plot.coordToPix(gvs.xD, gvs.T);
      gvs.txy_plot_point_x.setAttribute("cx", x_pix[0]);
      gvs.txy_plot_point_x.setAttribute("cy", x_pix[1]);
      gvs.txy_plot_point_y.setAttribute("cx", y_pix[0]);
      gvs.txy_plot_point_y.setAttribute("cy", y_pix[1]);

      let label_x_pix, label_x_pix_sub, label_y_pix, label_y_pix_sub;

      switch(gvs.eq_plot_shape) {
        case "no azeotrope":
          label_x_pix = gvs.txy_plot.coordToPix(gvs.xB - 0.05, gvs.no_azeotrope_temperature( gvs.xB ) - 0.2);
          label_x_pix_sub = gvs.txy_plot.coordToPix(gvs.xB - 0.025, gvs.no_azeotrope_temperature( gvs.xB ) - 1.05);
          label_y_pix = gvs.txy_plot.coordToPix(gvs.no_azeotrope( gvs.xB ) + 0.03, gvs.no_azeotrope_temperature( gvs.xB ) + 2);
          label_y_pix_sub = gvs.txy_plot.coordToPix(gvs.no_azeotrope( gvs.xB ) + 0.055, gvs.no_azeotrope_temperature( gvs.xB ) + 1);
        break;

        case "minimum-temperature azeotrope":
          if(gvs.xB <= 0.61) {
            label_x_pix = gvs.txy_plot.coordToPix(gvs.xB - 0.05, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) - 0.2);
            label_x_pix_sub = gvs.txy_plot.coordToPix(gvs.xB - 0.025, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) - 1.05);
            label_y_pix = gvs.txy_plot.coordToPix(gvs.minimum_temperature_azeotrope( gvs.xB ) + 0.03, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) + 2);
            label_y_pix_sub = gvs.txy_plot.coordToPix(gvs.minimum_temperature_azeotrope( gvs.xB ) + 0.055, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) + 1);
          } else {
            label_x_pix = gvs.txy_plot.coordToPix(gvs.xB + 0.025, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) - 0.2);
            label_x_pix_sub = gvs.txy_plot.coordToPix(gvs.xB + 0.05, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) - 1.05);
            label_y_pix = gvs.txy_plot.coordToPix(gvs.minimum_temperature_azeotrope( gvs.xB ) - 0.028, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) + 2.5);
            label_y_pix_sub = gvs.txy_plot.coordToPix(gvs.minimum_temperature_azeotrope( gvs.xB ) - 0.005, gvs.minimum_temperature_azeotrope_temperature( gvs.xB ) + 1.5);
          }
        break;

        case "maximum-temperature azeotrope":
          if(gvs.xB <= 0.46) {
            label_x_pix = gvs.txy_plot.coordToPix(gvs.xB + 0.02, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) - 0.2);
            label_x_pix_sub = gvs.txy_plot.coordToPix(gvs.xB + 0.045, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) - 1.05);
            label_y_pix = gvs.txy_plot.coordToPix(gvs.maximum_temperature_azeotrope( gvs.xB ) - 0.045, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) + 2.5);
            label_y_pix_sub = gvs.txy_plot.coordToPix(gvs.maximum_temperature_azeotrope( gvs.xB ) - 0.02, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) + 1.5);
          } else {
            label_x_pix = gvs.txy_plot.coordToPix(gvs.xB - 0.04, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) - 0.2);
            label_x_pix_sub = gvs.txy_plot.coordToPix(gvs.xB - 0.01, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) - 1.05);
            label_y_pix = gvs.txy_plot.coordToPix(gvs.maximum_temperature_azeotrope( gvs.xB ) + 0.01, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) + 2.5);
            label_y_pix_sub = gvs.txy_plot.coordToPix(gvs.maximum_temperature_azeotrope( gvs.xB ) + 0.035, gvs.maximum_temperature_azeotrope_temperature( gvs.xB ) + 1.5);
          }
        break;
      }
      
      gvs.txy_plot_xB_label.setAttribute("x", label_x_pix[0]);
      gvs.txy_plot_xB_label.setAttribute("y", label_x_pix[1]);
      gvs.txy_plot_xB_label_subscript.setAttribute("x", label_x_pix_sub[0]);
      gvs.txy_plot_xB_label_subscript.setAttribute("y", label_x_pix_sub[1]);

      gvs.txy_plot_xD_label.setAttribute("x", label_y_pix[0]);
      gvs.txy_plot_xD_label.setAttribute("y", label_y_pix[1]);
      gvs.txy_plot_xD_label_subscript.setAttribute("x", label_y_pix_sub[0]);
      gvs.txy_plot_xD_label_subscript.setAttribute("y", label_y_pix_sub[1]);

    break;
  }
}

function drawAll(p) {
  if(gvs.is_collecting) {
    gvs.differential_collection();
  }
  drawStillLiquid(p, gvs.B);
  drawColumn(p);
  drawTemperatureLabel(p);
  otherLabels(p);
  gvs.plot_points();
  drawStillLiquidLabel(p);
  drawHeater(p);
  if(gvs.is_collecting) {
    pouringLiquid(p);
  }
  // If "flasks" is selected, draw every flask, otherwise just draw the last one under the collection spout
  if(gvs.display === "flasks") {
    for(let i = 0; i < gvs.flasks.length; i++) {
      const flask = gvs.flasks[i];
      flask.draw();
      if(gvs.flasks.length === 1) {
        p.push();
        p.textSize(16);
        p.textWrap(p.WORD);
        p.text(`Choose an initial mole fraction, an amount to evaporate, and a mixture composition, then press "Collect". Your collected distillate will then appear here. You may also choose "display: Equilibrium plot" or "display: T-x-y diagram" from the drop-down menu to view the respective graphs. Up to 8 flasks may be collected, or 0.95 moles of total distillate, whichever comes first. Press "Reset" at any time to start over again.`, 355, 50, 435);
        p.pop();
      }
    }
  } else {
    gvs.flasks[gvs.flasks.length - 1].draw();
  }
}

module.exports = drawAll;