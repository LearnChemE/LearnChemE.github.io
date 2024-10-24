gvs.red_color = "rgb(255, 0, 0)";
gvs.red_highlighted = "rgb(255, 150, 150)";
gvs.green_color = "rgb(20, 165, 20)";
gvs.green_highlighted = "rgb(150, 255, 150)";
gvs.blue_color = "rgb(0, 0, 255)";
gvs.blue_highlighted = "rgb(150, 150, 255)";
gvs.black_color = "rgb(0, 0, 0)";
gvs.black_highlighted = "rgb(150, 150, 150)";
gvs.heat_exchanger_color = "rgb(220, 228, 255)";
gvs.heat_exchanger_highlighted = "rgb(230, 238, 255)"
gvs.tank_color = "rgb(248, 248, 248)";
gvs.liquid_color = "rgb(200, 200, 255)";

function drawLabels(p) {
  p.push();
  const center_height = p.height / 2 + 20;

  // draw box outline
  p.stroke(gvs.green_color);
  p.noFill();
  p.rectMode(p.CORNER);
  p.rect(10, center_height - 200, 125, 145);

  // draw text
  p.noStroke();
  p.fill(gvs.green_color);
  p.text("feed", 25, center_height - 175);
  p.text(`${Number(gvs.f_inlet).toFixed(1)} kg/s`, 20, center_height - 145);
  p.text(`${Number(gvs.p_inlet).toFixed(1)} MPa`, 20, center_height - 120);
  p.text(`${gvs.t_inlet} K`, 20, center_height - 95);
  p.text(`${Number(gvs.conc_inlet * 100).toFixed(1)} wt% sugar`, 20, center_height - 70);
  p.pop();

  p.push();

  // draw box outline
  p.stroke(gvs.red_color);
  p.noFill();
  p.rectMode(p.CORNER);
  p.rect(10, center_height - 40, 125, 110);

  // draw text
  p.noStroke();
  p.fill(gvs.red_color);
  p.text("sat. steam", 25, center_height - 15);
  p.text(`${Number(gvs.s_inlet).toFixed(1)} kg/s`, 25, center_height + 10);
  p.text(`${gvs.t_steam} K`, 25, center_height + 35);
  p.text(`${Number(gvs.p_steam).toFixed(1)} MPa`, 25, center_height + 60);
  p.pop();

  // p.push();
  // p.noStroke();
  // p.fill(gvs.blue_color);
  // p.text(`${gvs.V1.toFixed(1)} kg/s`, 270, 118);
  // p.pop();

  // p.push();
  // p.noStroke();
  // p.fill(gvs.red_color);
  // p.text(`${gvs.V2.toFixed(1)} kg/s`, 495, 118);
  // p.pop();

  // p.push();
  // p.noStroke();
  // p.fill(gvs.blue_color);
  // p.text(`${gvs.V3.toFixed(1)} kg/s`, 675, 98);
  // p.pop();

  p.push();
  p.noStroke();
  p.fill(gvs.green_color);
  p.text(`${gvs.L3.toFixed(1)} kg/s`, 675, 528);
  p.text(`${(gvs.conc_outlet * 100).toFixed(1)} wt% sugar`, 675, 553);
  p.pop();

  // p.push();
  // p.noStroke();
  // p.fill(gvs.green_color);
  // p.text(`${gvs.L1.toFixed(1)} kg/s`, 280, 512);
  // p.pop();

  // p.push();
  // p.noStroke();
  // p.fill(gvs.green_color);
  // p.text(`${gvs.L2.toFixed(1)} kg/s`, 505, 512);
  // p.pop();

  p.push();
  p.noStroke();
  p.fill(0);
  p.text(`${gvs.T1.toFixed(0)} K`, 260, 225);
  p.text(`${gvs.P1.toFixed(2)} MPa`, 250, 250);
  p.text(`${gvs.T2.toFixed(0)} K`, 485, 225);
  p.text(`${gvs.P2.toFixed(2)} MPa`, 475, 250);
  p.text(`${gvs.T3.toFixed(0)} K`, 710, 225);
  p.text(`${gvs.P3.toFixed(3)} MPa`, 695, 250);
  p.pop();
}

function drawSteamEconomyLabel(p) {
  p.push();
  p.noStroke();
  p.fill(0);
  p.textWrap(p.WORD);
  p.textAlign(p.LEFT);
  p.text(`Hover your mouse over the heat exchangers, valves, or arrows to view more information about them.`, p.width / 2 - 200, 20, 450);
  p.text(`steam economy: ${Number(gvs.steam_economy).toFixed(2)} kg water/kg steam`, p.width / 2 - 170, 90);
  p.pop();
}

function drawTanks(p) {
  p.push();
  let center_width = p.width / 4 + 30;
  let center_height = p.height / 2 + 20;
  p.fill(gvs.tank_color);
  p.rectMode(p.CENTER);
  p.rect(center_width, center_height, 150, 250, 25); // Draw tank rounded rectangle
  p.noStroke();  
  p.rect(center_width, center_height, 20, 280); // Draw the top and bottom outlet stems
  p.rect(center_width - 75, center_height - 80, 30, 20); // Draw the liquid inlet

  // Draw the liquid in the tank
  p.fill(gvs.liquid_color);
  p.rect(center_width, center_height + 40, 149, 169, 0, 0, 25, 25);

  // Draw the liquid leaving the bottom outlet stem
  p.rect(center_width, center_height + 125, 20, 30);

  // Draw the liquid being poured into the tank
  p.rect(center_width - 82.5, center_height - 80, 15, 20);
  p.beginShape();
  p.curveVertex(center_width - 75, center_height - 90);
  p.curveVertex(center_width - 75, center_height - 90);
  p.curveVertex(center_width - 27.5, center_height - 70);
  p.curveVertex(center_width + 20, center_height);
  p.curveVertex(center_width - 40, center_height);
  p.curveVertex(center_width - 60, center_height - 58);
  p.curveVertex(center_width - 75, center_height - 70);

  p.endShape(p.CLOSE);

  p.stroke(0);
  
  // Draw lines on the side of the top and bottom outlet stems
  p.line(center_width - 10, center_height - 125, center_width - 10, center_height - 140);
  p.line(center_width + 10, center_height - 125, center_width + 10, center_height - 140);
  p.line(center_width - 10, center_height + 125, center_width - 10, center_height + 140);
  p.line(center_width + 10, center_height + 125, center_width + 10, center_height + 140);

  // Draw lines on the side of the liquid inlet
  p.line(center_width - 90, center_height - 90, center_width - 75, center_height - 90);
  p.line(center_width - 90, center_height - 70, center_width - 75, center_height - 70);

  p.pop();

  p.push();
  center_width = p.width / 2 + 30;
  p.fill(gvs.tank_color);
  p.rectMode(p.CENTER);
  p.rect(center_width, center_height, 150, 250, 25); // Draw tank rounded rectangle
  p.noStroke();  
  p.rect(center_width, center_height, 20, 280); // Draw the top and bottom outlet stems
  p.rect(center_width - 75, center_height - 80, 30, 20); // Draw the liquid inlet

  // Draw the liquid in the tank
  p.fill(gvs.liquid_color);
  p.rect(center_width, center_height + 40, 149, 169, 0, 0, 25, 25);

  // Draw the liquid leaving the bottom outlet stem
  p.rect(center_width, center_height + 125, 20, 30);

  // Draw the liquid being poured into the tank
  p.rect(center_width - 82.5, center_height - 80, 15, 20);
  p.beginShape();
  p.curveVertex(center_width - 75, center_height - 90);
  p.curveVertex(center_width - 75, center_height - 90);
  p.curveVertex(center_width - 27.5, center_height - 70);
  p.curveVertex(center_width + 20, center_height);
  p.curveVertex(center_width - 40, center_height);
  p.curveVertex(center_width - 60, center_height - 58);
  p.curveVertex(center_width - 75, center_height - 70);

  p.endShape(p.CLOSE);

  p.stroke(0);
  
  // Draw lines on the side of the top and bottom outlet stems
  p.line(center_width - 10, center_height - 125, center_width - 10, center_height - 140);
  p.line(center_width + 10, center_height - 125, center_width + 10, center_height - 140);
  p.line(center_width - 10, center_height + 125, center_width - 10, center_height + 140);
  p.line(center_width + 10, center_height + 125, center_width + 10, center_height + 140);

  // Draw lines on the side of the liquid inlet
  p.line(center_width - 90, center_height - 90, center_width - 75, center_height - 90);
  p.line(center_width - 90, center_height - 70, center_width - 75, center_height - 70);

  p.pop();

  p.push();
  center_width = 3 * p.width / 4 + 30;
  p.fill(gvs.tank_color);
  p.rectMode(p.CENTER);
  p.rect(center_width, center_height, 150, 250, 25); // Draw tank rounded rectangle
  p.noStroke();  
  p.rect(center_width, center_height, 20, 280); // Draw the top and bottom outlet stems
  p.rect(center_width - 75, center_height - 80, 30, 20); // Draw the liquid inlet

  // Draw the liquid in the tank
  p.fill(gvs.liquid_color);
  p.rect(center_width, center_height + 40, 149, 169, 0, 0, 25, 25);

  // Draw the liquid leaving the bottom outlet stem
  p.rect(center_width, center_height + 125, 20, 30);

  // Draw the liquid being poured into the tank
  p.rect(center_width - 82.5, center_height - 80, 15, 20);
  p.beginShape();
  p.curveVertex(center_width - 75, center_height - 90);
  p.curveVertex(center_width - 75, center_height - 90);
  p.curveVertex(center_width - 27.5, center_height - 70);
  p.curveVertex(center_width + 20, center_height);
  p.curveVertex(center_width - 40, center_height);
  p.curveVertex(center_width - 60, center_height - 58);
  p.curveVertex(center_width - 75, center_height - 70);

  p.endShape(p.CLOSE);

  p.stroke(0);
  
  // Draw lines on the side of the top and bottom outlet stems
  p.line(center_width - 10, center_height - 125, center_width - 10, center_height - 140);
  p.line(center_width + 10, center_height - 125, center_width + 10, center_height - 140);
  p.line(center_width - 10, center_height + 125, center_width - 10, center_height + 140);
  p.line(center_width + 10, center_height + 125, center_width + 10, center_height + 140);

  // Draw lines on the side of the liquid inlet
  p.line(center_width - 90, center_height - 90, center_width - 75, center_height - 90);
  p.line(center_width - 90, center_height - 70, center_width - 75, center_height - 70);

  p.pop();
}

function drawHeatExchangers(p) {
  p.push();
  let center_width = p.width / 4 + 30;
  const center_height = p.height / 2 + 60;
  const hx_height = 130;
  const hx_width = 120;
  if(!gvs.tooltips.HX1_is_over) {
    p.fill(gvs.heat_exchanger_color);
  } else {
    p.fill(gvs.heat_exchanger_highlighted);
  }
  p.noStroke();

  // Heat exchanger body
  p.beginShape();
  p.vertex(center_width - 90, center_height - hx_height / 2);
  p.vertex(center_width + hx_width / 2, center_height - hx_height / 2);
  p.vertex(center_width + hx_width / 2, center_height + hx_height / 2 - 20);
  p.vertex(center_width + 90, center_height + hx_height / 2 - 20);
  p.vertex(center_width + 90, center_height + hx_height / 2);
  p.vertex(center_width - hx_width / 2, center_height + hx_height / 2);
  p.vertex(center_width - hx_width / 2, center_height - hx_height / 2 + 20);
  p.vertex(center_width - 90, center_height - hx_height / 2 + 20);
  p.endShape();

  p.stroke(0);
  p.line(center_width - 90, center_height - hx_height / 2, center_width + hx_width / 2, center_height - hx_height / 2);
  p.line(center_width + hx_width / 2, center_height - hx_height / 2, center_width + hx_width / 2, center_height + hx_height / 2 - 20);
  p.line(center_width + hx_width / 2, center_height + hx_height / 2 - 20, center_width + 90, center_height + hx_height / 2 - 20);
  p.line(center_width + 90, center_height + hx_height / 2, center_width - hx_width / 2, center_height + hx_height / 2);
  p.line(center_width - hx_width / 2, center_height + hx_height / 2, center_width - hx_width / 2, center_height - hx_height / 2 + 20);
  p.line(center_width - hx_width / 2, center_height - hx_height / 2 + 20, center_width - 90, center_height - hx_height / 2 + 20);

  // Heat exchanger inner rectangles
  p.rectMode(p.CENTER);
  p.fill(gvs.liquid_color);
  p.stroke(0);
  p.rect(center_width - 50, center_height, 4, hx_height - 35);
  p.rect(center_width - 40, center_height, 4, hx_height - 35);
  p.rect(center_width - 30, center_height, 4, hx_height - 35);
  p.rect(center_width - 20, center_height, 4, hx_height - 35);
  p.rect(center_width - 10, center_height, 4, hx_height - 35);
  p.rect(center_width, center_height, 4, hx_height - 35);
  p.rect(center_width + 10, center_height, 4, hx_height - 35);
  p.rect(center_width + 20, center_height, 4, hx_height - 35);
  p.rect(center_width + 30, center_height, 4, hx_height - 35);
  p.rect(center_width + 40, center_height, 4, hx_height - 35);
  p.rect(center_width + 50, center_height, 4, hx_height - 35);

  // p.rect(center_width - 50, center_height, 6, hx_height - 35);
  // p.rect(center_width - 50, center_height, 6, hx_height - 35);
  p.pop();

  p.push();
  center_width = p.width / 2 + 30;
  p.fill(gvs.heat_exchanger_color);
  p.noStroke();
  if(!gvs.tooltips.HX2_is_over) {
    p.fill(gvs.heat_exchanger_color);
  } else {
    p.fill(gvs.heat_exchanger_highlighted);
  }
  // Heat exchanger body
  p.beginShape();
  p.vertex(center_width - 90, center_height - hx_height / 2);
  p.vertex(center_width + hx_width / 2, center_height - hx_height / 2);
  p.vertex(center_width + hx_width / 2, center_height + hx_height / 2 - 20);
  p.vertex(center_width + 90, center_height + hx_height / 2 - 20);
  p.vertex(center_width + 90, center_height + hx_height / 2);
  p.vertex(center_width - hx_width / 2, center_height + hx_height / 2);
  p.vertex(center_width - hx_width / 2, center_height - hx_height / 2 + 20);
  p.vertex(center_width - 90, center_height - hx_height / 2 + 20);
  p.endShape();

  p.stroke(0);
  p.line(center_width - 90, center_height - hx_height / 2, center_width + hx_width / 2, center_height - hx_height / 2);
  p.line(center_width + hx_width / 2, center_height - hx_height / 2, center_width + hx_width / 2, center_height + hx_height / 2 - 20);
  p.line(center_width + hx_width / 2, center_height + hx_height / 2 - 20, center_width + 90, center_height + hx_height / 2 - 20);
  p.line(center_width + 90, center_height + hx_height / 2, center_width - hx_width / 2, center_height + hx_height / 2);
  p.line(center_width - hx_width / 2, center_height + hx_height / 2, center_width - hx_width / 2, center_height - hx_height / 2 + 20);
  p.line(center_width - hx_width / 2, center_height - hx_height / 2 + 20, center_width - 90, center_height - hx_height / 2 + 20);

  // Heat exchanger inner rectangles
  p.rectMode(p.CENTER);
  p.fill(gvs.liquid_color);
  p.stroke(0);
  p.rect(center_width - 50, center_height, 4, hx_height - 35);
  p.rect(center_width - 40, center_height, 4, hx_height - 35);
  p.rect(center_width - 30, center_height, 4, hx_height - 35);
  p.rect(center_width - 20, center_height, 4, hx_height - 35);
  p.rect(center_width - 10, center_height, 4, hx_height - 35);
  p.rect(center_width, center_height, 4, hx_height - 35);
  p.rect(center_width + 10, center_height, 4, hx_height - 35);
  p.rect(center_width + 20, center_height, 4, hx_height - 35);
  p.rect(center_width + 30, center_height, 4, hx_height - 35);
  p.rect(center_width + 40, center_height, 4, hx_height - 35);
  p.rect(center_width + 50, center_height, 4, hx_height - 35);

  p.pop();

  p.push();
  center_width = 3 * p.width / 4 + 30;
  p.fill(gvs.heat_exchanger_color);
  p.noStroke();
  if(!gvs.tooltips.HX3_is_over) {
    p.fill(gvs.heat_exchanger_color);
  } else {
    p.fill(gvs.heat_exchanger_highlighted);
  }
  // Heat exchanger body
  p.beginShape();
  p.vertex(center_width - 90, center_height - hx_height / 2);
  p.vertex(center_width + hx_width / 2, center_height - hx_height / 2);
  p.vertex(center_width + hx_width / 2, center_height + hx_height / 2 - 20);
  p.vertex(center_width + 90, center_height + hx_height / 2 - 20);
  p.vertex(center_width + 90, center_height + hx_height / 2);
  p.vertex(center_width - hx_width / 2, center_height + hx_height / 2);
  p.vertex(center_width - hx_width / 2, center_height - hx_height / 2 + 20);
  p.vertex(center_width - 90, center_height - hx_height / 2 + 20);
  p.endShape();

  p.stroke(0);
  p.line(center_width - 90, center_height - hx_height / 2, center_width + hx_width / 2, center_height - hx_height / 2);
  p.line(center_width + hx_width / 2, center_height - hx_height / 2, center_width + hx_width / 2, center_height + hx_height / 2 - 20);
  p.line(center_width + hx_width / 2, center_height + hx_height / 2 - 20, center_width + 90, center_height + hx_height / 2 - 20);
  p.line(center_width + 90, center_height + hx_height / 2, center_width - hx_width / 2, center_height + hx_height / 2);
  p.line(center_width - hx_width / 2, center_height + hx_height / 2, center_width - hx_width / 2, center_height - hx_height / 2 + 20);
  p.line(center_width - hx_width / 2, center_height - hx_height / 2 + 20, center_width - 90, center_height - hx_height / 2 + 20);

  // Heat exchanger inner rectangles
  p.rectMode(p.CENTER);
  p.fill(gvs.liquid_color);
  p.stroke(0);
  p.rect(center_width - 50, center_height, 4, hx_height - 35);
  p.rect(center_width - 40, center_height, 4, hx_height - 35);
  p.rect(center_width - 30, center_height, 4, hx_height - 35);
  p.rect(center_width - 20, center_height, 4, hx_height - 35);
  p.rect(center_width - 10, center_height, 4, hx_height - 35);
  p.rect(center_width, center_height, 4, hx_height - 35);
  p.rect(center_width + 10, center_height, 4, hx_height - 35);
  p.rect(center_width + 20, center_height, 4, hx_height - 35);
  p.rect(center_width + 30, center_height, 4, hx_height - 35);
  p.rect(center_width + 40, center_height, 4, hx_height - 35);
  p.rect(center_width + 50, center_height, 4, hx_height - 35);

  // p.rect(center_width - 50, center_height, 6, hx_height - 35);
  // p.rect(center_width - 50, center_height, 6, hx_height - 35);
  p.pop();
}

function valve(p, x, y) {

}

function drawValves(p) {
  p.push();
    p.fill(235);
    if(gvs.tooltips.valve1_is_over) {
      p.stroke(gvs.black_highlighted);
    } else {
      p.stroke(gvs.black_color);
    }
    p.strokeWeight(1.5);
    p.triangle(310, 480, 290, 488, 290, 472);
    p.triangle(310, 480, 330, 488, 330, 472);
  p.pop();

  p.push();
    p.fill(235);
    if(gvs.tooltips.valve2_is_over) {
      p.stroke(gvs.black_highlighted);
    } else {
      p.stroke(gvs.black_color);
    }
    p.strokeWeight(1.5);
    p.triangle(535, 480, 515, 488, 515, 472);
    p.triangle(535, 480, 555, 488, 555, 472);
  p.pop();
}

function drawArrows(p) {
  p.push();
  let center_width = p.width / 4 + 30;
  const center_height = p.height / 2 + 20;
  p.strokeWeight(2);
  // Draw feed arrow
  p.stroke(gvs.green_color);
  p.line(135, center_height - 80, 160, center_height - 80);
  p.noStroke();
  p.fill(gvs.green_color);
  p.triangle(165, center_height - 80, 150, center_height - 85, 150, center_height - 75);
  
  // Draw steam inlet arrow
  p.stroke(gvs.red_color);
  p.line(135, center_height - 15, 160, center_height - 15);
  p.noStroke();
  p.fill(gvs.red_color);
  p.triangle(165, center_height - 15, 150, center_height - 20, 150, center_height - 10);
  
  // Draw first steam outlet arrow
  if(gvs.tooltips.cond1_is_over) {
    p.stroke(gvs.red_highlighted);
    p.fill(gvs.red_highlighted);
  } else {
    p.stroke(gvs.red_color);
    p.fill(gvs.red_color);
  }
  p.line(center_width + 90, center_height + 95, center_width + 125, center_height + 95);
  p.line(center_width + 125, center_height + 95, center_width + 125, center_height + 170);
  p.noStroke();
  p.triangle(center_width + 125, center_height + 180, center_width + 120, center_height + 165, center_width + 130, center_height + 165);

  // Draw first vapor outlet arrow
  if(gvs.tooltips.V1_is_over) {
    p.stroke(gvs.blue_highlighted);
    p.fill(gvs.blue_highlighted);
  } else {
    p.stroke(gvs.blue_color);
    p.fill(gvs.blue_color);
  }
  p.line(center_width, center_height - 140, center_width, center_height - 170);
  p.line(center_width, center_height - 170, center_width + 85, center_height - 170);
  p.line(center_width + 85, center_height - 170, center_width + 85, center_height - 15);
  p.line(center_width + 85, center_height - 15, center_width + 125, center_height - 15);
  p.triangle(center_width + 130, center_height - 15, center_width + 115, center_height - 20, center_width + 115, center_height - 10);
  p.noStroke();

  // Draw first liquid outlet arrow
  if(gvs.tooltips.L1_is_over_pre_valve) {
    p.stroke(gvs.green_highlighted);
    p.fill(gvs.green_highlighted);
  } else {
    p.stroke(gvs.green_color);
    p.fill(gvs.green_color);
  }
  p.line(center_width, center_height + 140, center_width, center_height + 170);
  p.line(center_width, center_height + 170, center_width + 50, center_height + 170);

  if(gvs.tooltips.L1_is_over_post_valve) {
    p.stroke(gvs.green_highlighted);
    p.fill(gvs.green_highlighted);
  } else {
    p.stroke(gvs.green_color);
    p.fill(gvs.green_color);
  }
  p.line(center_width + 50, center_height + 170, center_width + 100, center_height + 170);
  p.line(center_width + 100, center_height + 170, center_width + 100, center_height - 80);
  p.line(center_width + 100, center_height - 80, center_width + 125, center_height - 80);
  p.noStroke();
  p.triangle(center_width + 130, center_height - 80, center_width + 115, center_height - 85, center_width + 115, center_height - 75);

  // Draw second liquid outlet arrow
  center_width = p.width / 2 + 30;
  if(gvs.tooltips.L2_is_over_pre_valve) {
    p.stroke(gvs.green_highlighted);
    p.fill(gvs.green_highlighted);
  } else {
    p.stroke(gvs.green_color);
    p.fill(gvs.green_color);
  }
  p.line(center_width, center_height + 140, center_width, center_height + 170);
  p.line(center_width, center_height + 170, center_width + 50, center_height + 170);

  if(gvs.tooltips.L2_is_over_post_valve) {
    p.stroke(gvs.green_highlighted);
    p.fill(gvs.green_highlighted);
  } else {
    p.stroke(gvs.green_color);
    p.fill(gvs.green_color);
  }
  p.line(center_width + 50, center_height + 170, center_width + 100, center_height + 170);
  p.line(center_width + 100, center_height + 170, center_width + 100, center_height - 80);
  p.line(center_width + 100, center_height - 80, center_width + 125, center_height - 80);

  p.noStroke();
  p.triangle(center_width + 130, center_height - 80, center_width + 115, center_height - 85, center_width + 115, center_height - 75);

  // Draw second vapor outlet arrow
  if(gvs.tooltips.V2_is_over) {
    p.stroke(gvs.red_highlighted);
    p.fill(gvs.red_highlighted);
  } else {
    p.stroke(gvs.red_color);
    p.fill(gvs.red_color);
  }
  p.line(center_width, center_height - 140, center_width, center_height - 170);
  p.line(center_width, center_height - 170, center_width + 85, center_height - 170);
  p.line(center_width + 85, center_height - 170, center_width + 85, center_height - 15);
  p.line(center_width + 85, center_height - 15, center_width + 125, center_height - 15);
  p.triangle(center_width + 130, center_height - 15, center_width + 115, center_height - 20, center_width + 115, center_height - 10);
  p.noStroke();

  // Draw second steam outlet arrow
  if(gvs.tooltips.cond2_is_over) {
    p.stroke(gvs.blue_highlighted);
    p.fill(gvs.blue_highlighted);
  } else {
    p.stroke(gvs.blue_color);
    p.fill(gvs.blue_color);
  }
  p.line(center_width + 90, center_height + 95, center_width + 130, center_height + 95);
  p.line(center_width + 130, center_height + 95, center_width + 130, center_height + 170);
  p.noStroke();
  p.triangle(center_width + 130, center_height + 180, center_width + 125, center_height + 165, center_width + 135, center_height + 165);

  center_width = 3 * p.width / 4 + 30;

  // Draw third steam outlet arrow
  if(gvs.tooltips.cond3_is_over) {
    p.stroke(gvs.red_highlighted);
    p.fill(gvs.red_highlighted);
  } else {
    p.stroke(gvs.red_color);
    p.fill(gvs.red_color);
  }
  p.line(center_width + 90, center_height + 95, center_width + 115, center_height + 95);
  p.line(center_width + 115, center_height + 95, center_width + 115, center_height + 170);
  p.noStroke();
  p.triangle(center_width + 115, center_height + 180, center_width + 110, center_height + 165, center_width + 120, center_height + 165);

  // Draw third concentrate outlet arrow
  if(gvs.tooltips.L3_is_over) {
    p.stroke(gvs.green_highlighted);
    p.fill(gvs.green_highlighted);
  } else {
    p.stroke(gvs.green_color);
    p.fill(gvs.green_color);
  }
  p.line(center_width, center_height + 140, center_width, center_height + 180);
  p.triangle(center_width, center_height + 195, center_width - 5, center_height + 180, center_width + 5, center_height + 180);

  // Draw third evaporate outlet arrow
  if(gvs.tooltips.V3_is_over) {
    p.stroke(gvs.blue_highlighted);
    p.fill(gvs.blue_highlighted);
  } else {
    p.stroke(gvs.blue_color);
    p.fill(gvs.blue_color);
  }
  p.line(center_width, center_height - 140, center_width, center_height - 180);
  p.triangle(center_width, center_height - 195, center_width - 5, center_height - 180, center_width + 5, center_height - 180);

  p.pop();
}

function drawAll(p) {
  drawTanks(p);
  drawHeatExchangers(p);
  drawArrows(p);
  drawLabels(p);
  drawValves(p);
  drawSteamEconomyLabel(p);
}

module.exports = drawAll;