function drawShapes(p) {
  p.push();
  p.stroke(0);
  p.strokeWeight(1);
  p.fill(0);
  // feed line
  p.line(30, 200, 150, 200);
  p.triangle(150, 200, 140, 204, 140, 196);
  // m1 line
  p.line(150, 200, 270, 200);
  p.triangle(270, 200, 260, 204, 260, 196);
  // evaporator
  p.fill(255);
  p.rect(270, 170, 100, 60);
  // m2 line
  p.fill(0);
  p.line(320, 170, 320, 100);
  p.triangle(320, 100, 324, 110, 316, 110);
  // m3 line
  p.line(370, 200, 490, 200);
  p.triangle(490, 200, 480, 204, 480, 196);
  // crystallizer and filter
  p.fill(255);
  p.rect(490, 170, 100, 60);
  // m4 line
  p.fill(0);
  p.line(540, 170, 540, 100);
  p.triangle(540, 100, 544, 110, 536, 110);
  // m5 line
  p.line(590, 200, 710, 200);
  p.triangle(710, 200, 700, 204, 700, 196);
  // recycle line
  p.line(540, 230, 540, 320);
  p.triangle(540, 320, 544, 310, 536, 310);
  p.line(540, 320, 150, 320);
  p.line(150, 320, 150, 200);
  p.triangle(150, 200, 154, 210, 146, 210);
  p.pop();
}

function drawText(p) {
  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(15);
  if(!gvs.display_results) {
    p.text(`input the answers into the blue input boxes below, then press\nthe green "show answers" button above to check your answer`, p.width / 2 - 220, -10);
  } else {
    p.fill(255);
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, -33, 150, 88);
    p.fill(0, 0, 255);
    p.noStroke();
    p.text("your answers:", 30, -10);
    let answer_1 = Number(document.getElementById(`${gvs.unknown_1}-input`).value) + 0.001;
    let answer_2 = Number(document.getElementById(`${gvs.unknown_2}-input`).value) + 0.001;
    if(gvs.unknown_1 === "zfeed" || gvs.unknown_1 === "zwater") {
      answer_1 = (Math.round(answer_1 * 100) / 100).toFixed(2);
    } else {
      answer_1 = (Math.round(answer_1 * 10) / 10).toFixed(1);
    }
    if(gvs.unknown_2 === "x5" || gvs.unknown_2 === "xw5") {
      answer_2 = (Math.round(answer_2 * 100) / 100).toFixed(2);
    } else {
      answer_2 = (Math.round(answer_2 * 10) / 10).toFixed(1);
    }
    switch(gvs.unknown_1) {
      case "mfeed":
        p.text(`m      = ${answer_1} kg/h`, 30, 15);
        p.textSize(10);
        p.text("feed", 44, 20);
      break;

      case "m2":
        p.text(`m    = ${answer_1} kg/h`, 30, 15);
        p.textSize(10);
        p.text("2", 44, 20);
      break;

      case "m4":
        p.text(`m    = ${answer_1} kg/h`, 30, 15);
        p.textSize(10);
        p.text("4", 44, 20);
      break;

      case "m5":
        p.text(`m    = ${answer_1} kg/h`, 30, 15);
        p.textSize(10);
        p.text("5", 44, 20);
      break;

      case "zfeed":
        p.text(`z   = ${answer_1}`, 30, 15);
        p.textSize(10);
        p.text("k", 40, 20);
      break;

      case "zwater":
        p.text(`z   = ${answer_1}`, 30, 15);
        p.textSize(10);
        p.text("w", 40, 20);
      break;
    }

    p.textSize(15);

    switch(gvs.unknown_2) {
      case "mfeed":
        p.text(`m      = ${answer_2} kg/h`, 30, 40);
        p.textSize(10);
        p.text("feed", 44, 45);
      break;

      case "m2":
        p.text(`m    = ${answer_2} kg/h`, 30, 40);
        p.textSize(10);
        p.text("2", 44, 45);
      break;

      case "m4":
        p.text(`m    = ${answer_2} kg/h`, 30, 40);
        p.textSize(10);
        p.text("4", 44, 45);
      break;

      case "m5":
        p.text(`m    = ${answer_2} kg/h`, 30, 40);
        p.textSize(10);
        p.text("5", 44, 45);
      break;

      case "x5":
        p.text(`x     = ${answer_2}`, 30, 40);
        p.textSize(10);
        p.text("k,5", 40, 45);
      break;

      case "xw5":
        p.text(`x     = ${answer_2}`, 30, 40);
        p.textSize(10);
        p.text("w,5", 40, 45);
      break;
    }
    p.textSize(15);
    p.fill(0);
  }
  p.textAlign(p.CENTER, p.CENTER);
  p.text("fresh feed", 90, 160);
  p.text("water vapor", 320, 50);
  p.text("evaporator", 320, 200);
  p.text("crystallizer\nand filter", 540, 200);
  p.text("KCl crystals", 540, 50);
  p.text("KCl solution", 650, 160);
  p.text("recycle", 510, 335);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(14);
  // feed
  const space1 = (gvs.unknown_1 === "mfeed" || gvs.unknown_2 === "mfeed") && gvs.display_results === false ? "  " : "";
  p.text(`m      = ${gvs.mfeed.toFixed(1)} ${space1}kg/h`, 30, 185);
  if(gvs.unknown_1 !== "zwater" || gvs.display_results === true) {
    p.text(`z   = ${(Math.round(gvs.zfeed * 100) / 100).toFixed(2)}`, 40, 215);
  }
  if(gvs.unknown_1 !== "zfeed" || gvs.display_results === true) {
    p.text(`z   = ${(Math.round((1 - gvs.zfeed) * 100) / 100).toFixed(2)}`, 40, 238);
  }
  // m1
  p.text(`m   = ${gvs.m1.toFixed(1)} kg/h`, 160, 185);
  p.text(`x     = ${(Math.round(gvs.x1 * 100) / 100).toFixed(2)}`, 180, 215);
  p.text(`x     = ${(Math.round((1 - gvs.x1) * 100) / 100).toFixed(2)}`, 180, 238);
  // m2
  const space2 = (gvs.unknown_1 === "m2" || gvs.unknown_2 === "m2") && gvs.display_results === false ? "  " : "";
  p.text(`m   = ${(Math.round(gvs.m2 * 10) / 10).toFixed(1)} ${space2}kg/h`, 275, 75);
  // m3
  p.text(`m   = ${(Math.round(gvs.m3 * 10) / 10).toFixed(1)} kg/h`, 380, 185);
  p.text(`x     = ${(Math.round(gvs.x3 * 100) / 100).toFixed(2)}`, 400, 215);
  p.text(`x     = ${(Math.round((1 - gvs.x3) * 100) / 100).toFixed(2)}`, 400, 238);
  // m4
  const space3 = (gvs.unknown_1 === "m4" || gvs.unknown_2 === "m4") && gvs.display_results === false ? "  " : "";
  p.text(`m   = ${(Math.round(gvs.m4 * 10) / 10).toFixed(1)} ${space3}kg/h`, 495, 75);
  // m5
  const space4 = (gvs.unknown_1 === "m5" || gvs.unknown_2 === "m5") && gvs.display_results === false ? "    " : "";
  p.text(`m   = ${(Math.round(gvs.m5 * 10) / 10).toFixed(1)} ${space4}kg/h`, 600, 185);
  if(gvs.unknown_2 !== "xw5" || gvs.display_results === true) {
    p.text(`x     = ${(Math.round(gvs.x5 * 100) / 100).toFixed(2)}`, 620, 215);
  }
  if(gvs.unknown_2 !== "x5" || gvs.display_results === true) {
    p.text(`x     = ${(Math.round((1 - gvs.x5) * 100) / 100).toFixed(2)}`, 620, 238);
  }
  // recycle
  p.text(`m   = ${(Math.round(gvs.mR * 10) / 10).toFixed(1)} kg/h`, 278, 305);
  p.text(`x      = ${(Math.round(gvs.xR * 100) / 100).toFixed(2)}`, 290, 335);
  p.text(`x      = ${(Math.round((1 - gvs.xR) * 100) / 100).toFixed(2)}`, 290, 358);
  // subscript
  p.textSize(10);
  // feed
  p.text("feed", 43, 192);
  if(gvs.unknown_1 !== "zwater" || gvs.display_results === true) {
    p.text("k", 49, 221);
  }
  if(gvs.unknown_1 !== "zfeed" || gvs.display_results === true) {
    p.text("w", 49, 244);
  }
  // m1
  p.text("1", 173, 192);
  p.text("k,1", 189, 221);
  p.text("w,1", 189, 244);
  // m2
  p.text("2", 288, 82);
  // m3
  p.text("3", 393, 192);
  p.text("k,3", 409, 221);
  p.text("w,3", 409, 244);
  // m4
  p.text("4", 508, 82);
  // m5
  p.text("5", 613, 192);
  if(gvs.unknown_2 !== "xw5" || gvs.display_results === true) {
    p.text("k,5", 629, 221);
  }
  if(gvs.unknown_2 !== "x5" || gvs.display_results === true) {
    p.text("w,5", 629, 244);
  }
  // recycle
  p.text("R", 291, 312);
  p.text("k,R", 299, 341);
  p.text("w,R", 299, 364);
  p.pop();
}

function drawAll(p) {
  p.translate(30, 50);
  drawShapes(p);
  drawText(p);
}

module.exports = drawAll;