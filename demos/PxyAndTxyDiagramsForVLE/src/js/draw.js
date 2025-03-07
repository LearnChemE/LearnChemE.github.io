function barGraph(p) {
  const bgw = p.width / 3 - 40; // bar graph width (pixels)
  const bgh = p.height - 160;
  const left_padding = 30;
  p.push();
  p.translate(5 * p.width / 6, p.height / 2 + 10);
  p.line(-bgw / 2 + left_padding, -bgh / 2, -bgw / 2 + left_padding, bgh / 2);
  p.line(-bgw / 2 + left_padding, bgh / 2, bgw / 2, bgh / 2);
  p.textAlign(p.RIGHT);
  p.textSize(14);
  for(let i = 0; i <= 20; i++) {
    const y = bgh / 2 - (i / 20) * bgh;
    const x1 = -bgw / 2 + left_padding;
    const x2 = i % 4 === 0 ? -bgw / 2 + left_padding + 6 : -bgw / 2 + left_padding + 2.5;
    const frac = Number(i / 20).toFixed(2);
    if(i !== 0) { p.line(x1, y, x2, y) }
    if(i % 4 === 0) {
      p.text(`${frac}`, x1 - 10, y + 5);
    }
  }
  p.textAlign(p.CENTER);
  p.text("liquid", -25, bgh / 2 + 20);
  p.text("vapor", 60, bgh / 2 + 20);
  // we average a list of the previous 6 q values to prevent the bar graph from "jittering". It smooths the animation out a bit.
  let q_avg = 0;
  for(let i = 0; i < gvs.q_list.length; i++) {
    q_avg += gvs.q_list[i];
  }
  q_avg /= gvs.q_list.length;
  const liquid_height = q_avg * bgh;
  const vapor_height = (1 - q_avg) * bgh;
  p.rectMode(p.CORNER);
  p.stroke(0);
  p.fill(0, 0, 255);
  p.rect(-bgw / 4, bgh / 2, 60, -liquid_height);
  p.fill(0, 150, 0);
  p.rect(30, bgh / 2, 60, -vapor_height);
  p.noStroke();
  p.fill(0);
  let xA, yA;
  if(gvs.plot_selection === "P-x-y") {
    if(gvs.pxy_x_bubble_point() >= gvs.z || gvs.pxy_x_dew_point() <= gvs.z) {
      xA = gvs.z;
      yA = gvs.z;
      if(gvs.pxy_x_bubble_point() >= gvs.z && gvs.P > gvs.Px(0)) {
        p.text(`x  = ${xA.toFixed(2)}`, -bgw / 4 + 30, bgh / 2 - liquid_height - 10);
        p.textSize(9);
        p.text("H", -bgw / 4 + 14, bgh / 2 - liquid_height - 5);
      } else {
        p.text(`y  = ${yA.toFixed(2)}`, 60, bgh / 2 - vapor_height - 10);
        p.textSize(9);
        p.text("H", 44, bgh / 2 - vapor_height - 5);
      }
    } else {
      xA = Math.max(0, Math.min(1, gvs.pxy_x_bubble_point()));
      yA = Math.max(0, Math.min(1, gvs.pxy_x_dew_point()));
      xA = xA.toFixed(2);
      yA = yA.toFixed(2);
      p.text(`x  = ${xA}`, -bgw / 4 + 30, bgh / 2 - liquid_height - 10);
      p.textSize(9);
      p.text("H", -bgw / 4 + 14, bgh / 2 - liquid_height - 5);
      p.textSize(14);
      p.text(`y  = ${yA}`, 60, bgh / 2 - vapor_height - 10);
      p.textSize(9);
      p.text("H", 44, bgh / 2 - vapor_height - 5);
    }
  } else {
    if(gvs.txy_x_bubble_point() >= gvs.z || gvs.txy_x_dew_point() <= gvs.z) {
      xA = gvs.z;
      yA = gvs.z;
      if(gvs.txy_x_bubble_point() >= gvs.z && gvs.T < gvs.Tx(0)) {
        p.text(`x  = ${xA.toFixed(2)}`, -bgw / 4 + 30, bgh / 2 - liquid_height - 10);
        p.textSize(9);
        p.text("H", -bgw / 4 + 14, bgh / 2 - liquid_height - 5);
      } else {
        p.text(`y  = ${yA.toFixed(2)}`, 60, bgh / 2 - vapor_height - 10);
        p.textSize(9);
        p.text("H", 44, bgh / 2 - vapor_height - 5);
      }
    } else {
      xA = Math.max(0, Math.min(1, gvs.txy_x_bubble_point()));
      yA = Math.max(0, Math.min(1, gvs.txy_x_dew_point()));
      xA = xA.toFixed(2);
      yA = yA.toFixed(2);
      p.text(`x  = ${xA}`, -bgw / 4 + 30, bgh / 2 - liquid_height - 10);
      p.textSize(9);
      p.text("H", -bgw / 4 + 14, bgh / 2 - liquid_height - 5);
      p.textSize(14);
      p.text(`y  = ${yA}`, 60, bgh / 2 - vapor_height - 10);
      p.textSize(9);
      p.text("H", 44, bgh / 2 - vapor_height - 5);
    }
  }
  p.pop();

  p.push();
  p.translate(5 * p.width / 6 + 5, p.height / 2);
  p.translate(-bgw / 2 - 30, 80);
  p.rotate(-Math.PI / 2);
  p.fill(0);
  p.noStroke();
  p.textSize(14);
  p.text("liquid and vapor amounts (mol)", 0, 0);
  p.pop();

  p.push();
  p.translate(5 * p.width / 6 + 5, p.height / 2);
  p.translate(0, -bgh / 2);
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  if(gvs.plot_selection === "P-x-y") {
    p.text(`mixture is at ${gvs.P.toFixed(2)} bar`, 0, -20);
  } else {
    p.text(`mixture is at ${Math.round(gvs.T).toFixed(0)}° C`, 0, -20);
  }
  p.pop();
}

function drawAll(p) {
  barGraph(p);
}

module.exports = drawAll;