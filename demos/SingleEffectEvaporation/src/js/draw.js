(function declareColors() {
  const p = gvs.p;
  gvs.steam_label_color = p.color(255, 0, 0);
  gvs.solution_label_color = p.color(20, 165, 20);
  gvs.heat_exchanger_color = p.color(220, 228, 255);
  gvs.tank_color = p.color(248, 248, 248);
  gvs.liquid_color = p.color(200, 200, 255);
})();

function drawFeedLabel(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2;

  // draw box outline
  p.stroke(gvs.solution_label_color);
  p.noFill();
  p.rectMode(p.CENTER);
  p.rect(center_width / 2 - 50, center_height - 110, 200, 100);

  // draw text
  p.noStroke();
  p.fill(gvs.solution_label_color);
  p.text("feed", center_width / 2 - 130, center_height - 135);
  p.text(`${gvs.f_inlet} kg/s`, center_width / 2 - 130, center_height - 105);
  p.text(`${Number(gvs.p_inlet).toFixed(1)} MPa`, center_width / 2 - 130, center_height - 75);
  p.text(`${gvs.t_inlet} K`, center_width / 2 - 45, center_height - 105);
  p.text(`${Number(gvs.conc_inlet * 100).toFixed(1)}% sugar`, center_width / 2 - 45, center_height - 75);
  p.pop();
}

function drawSteamLabel(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2;

  // draw box outline
  p.stroke(gvs.steam_label_color);
  p.noFill();
  p.rectMode(p.CENTER);
  p.rect(center_width / 2 - 50, center_height, 200, 80);

  // draw text
  p.noStroke();
  p.fill(gvs.steam_label_color);
  p.text("saturated steam", center_width / 2 - 130, center_height - 10);
  p.text(`${Number(gvs.s_inlet).toFixed(1)} kg/s`, center_width / 2 - 130, center_height + 20);
  p.text(`${gvs.t_steam} K`, center_width / 2 - 45, center_height + 20);
  p.pop();
}

function drawEvaporateLabel(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2;

  // draw box outline
  p.stroke(gvs.solution_label_color);
  p.noFill();
  p.rectMode(p.CENTER);
  p.rect(center_width + 150, center_height - 180, 200, 80);

  // draw text
  p.noStroke();
  p.fill(gvs.solution_label_color);
  p.text("evaporated water", center_width + 70, center_height - 195);
  p.text(`${Number(gvs.evap_flowrate).toFixed(1)} kg/s`, center_width + 70, center_height - 165);
  p.text(`${gvs.evaporator_t} K`, center_width + 155, center_height - 165);
  p.pop();
}

function drawSteamCondensateLabel(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2;

  // draw box outline
  p.stroke(gvs.steam_label_color);
  p.noFill();
  p.rectMode(p.CENTER);
  p.rect(3 * center_width / 2 + 50, center_height + 85, 200, 80);

  // draw text
  p.noStroke();
  p.fill(gvs.steam_label_color);
  p.text("saturated liquid water", 3 * center_width / 2 - 30, center_height + 75);
  p.text(`${Number(gvs.s_inlet).toFixed(1)} kg/s`, 3 * center_width / 2 - 30, center_height + 105);
  p.text(`${gvs.t_steam} K`, 3 * center_width / 2 + 60, center_height + 105);
  p.pop();
}

function drawConcentrateLabel(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2;

  // draw box outline
  p.stroke(gvs.solution_label_color);
  p.noFill();
  p.rectMode(p.CENTER);
  p.rect(center_width + 150, center_height + 190, 200, 100);

  // draw text
  p.noStroke();
  p.fill(gvs.solution_label_color);
  p.text("concentrate", center_width + 70, center_height + 165);
  p.text(`${Number(gvs.evap_flowrate).toFixed(1)} kg/s`, center_width + 70, center_height + 195);
  p.text(`${gvs.evaporator_t} K`, center_width + 155, center_height + 195);
  p.text(`${Number(gvs.conc_concentrate * 100).toFixed(1)}% sugar`, center_width + 70, center_height + 225);
  p.pop();
}

function drawEvaporatorConditionsLabel(p) {
  p.push();

  p.pop();
}

function drawSteamEconomyLabel(p) {
  p.push();
  p.noStroke();
  p.fill(0);
  p.text(`steam economy: ${Number(gvs.steam_economy).toFixed(2)} kg water/kg steam`, p.width / 4 - 140, 50);
  p.pop();
}

function drawTank(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2;
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

function drawHeatExchanger(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2 + 40;
  const hx_height = 130;
  const hx_width = 120;
  p.fill(gvs.heat_exchanger_color);
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
}

function drawArrows(p) {
  p.push();
  const center_width = p.width / 2;
  const center_height = p.height / 2;
  
  // Draw feed arrow
  p.stroke(gvs.solution_label_color);
  p.line(center_width - 150, center_height - 80, center_width - 100, center_height - 80);
  p.noStroke();
  p.fill(gvs.solution_label_color);
  p.triangle(center_width - 100, center_height - 80, center_width - 115, center_height - 85, center_width - 115, center_height - 75);
  
  // Draw steam inlet arrow
  p.stroke(gvs.steam_label_color);
  p.line(center_width - 150, center_height - 15, center_width - 100, center_height - 15);
  p.noStroke();
  p.fill(gvs.steam_label_color);
  p.triangle(center_width - 100, center_height - 15, center_width - 115, center_height - 20, center_width - 115, center_height - 10);
  
  // Draw steam outlet arrow
  p.stroke(gvs.steam_label_color);
  p.line(center_width + 100, center_height + 95, center_width + 150, center_height + 95);
  p.noStroke();
  p.fill(gvs.steam_label_color);
  p.triangle(center_width + 150, center_height + 95, center_width + 135, center_height + 90, center_width + 135, center_height + 100);

  // Draw vapor outlet arrow
  p.stroke(gvs.solution_label_color);
  p.line(center_width, center_height - 150, center_width, center_height - 180);
  p.line(center_width, center_height - 180, center_width + 50, center_height - 180);
  p.fill(gvs.solution_label_color);
  p.noStroke();
  p.triangle(center_width + 50, center_height - 180, center_width + 35, center_height - 185, center_width + 35, center_height - 175);

  // Draw liquid outlet arrow
  p.stroke(gvs.solution_label_color);
  p.line(center_width, center_height + 150, center_width, center_height + 180);
  p.line(center_width, center_height + 180, center_width + 50, center_height + 180);
  p.fill(gvs.solution_label_color);
  p.noStroke();
  p.triangle(center_width + 50, center_height + 180, center_width + 35, center_height + 185, center_width + 35, center_height + 175);

  p.pop();
}

function drawAll(p) {
  drawTank(p);
  drawHeatExchanger(p);
  drawArrows(p);
  drawFeedLabel(p);
  drawSteamLabel(p);
  drawEvaporateLabel(p);
  drawSteamCondensateLabel(p);
  drawConcentrateLabel(p);
  drawEvaporatorConditionsLabel(p);
  drawSteamEconomyLabel(p);
}

module.exports = drawAll;