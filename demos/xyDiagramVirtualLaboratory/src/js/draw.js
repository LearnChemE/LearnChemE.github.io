function drawInfo(p) {
  p.push();
  p.translate(50, 50);
  p.textSize(14);
  p.fill(0);
  p.noStroke();
  p.text(`molecular weight of component A: ${gvs.MW_A.toFixed(1)} g/mol`, 0, 0);
  p.text(`molecular weight of component B: ${gvs.MW_B.toFixed(1)} g/mol`, 0, 25);
  p.text(`density of component A: ${gvs.density_A.toFixed(2)} g/mL`, 0, 50);
  p.text(`density of component B: ${gvs.density_B.toFixed(2)} g/mL`, 0, 75);
  p.text(`Antoine constants:`, 0, 110);
  p.text(`component A`, 10, 135);
  p.text(`component B`, 125, 135);
  p.text(`A`, -20, 165);
  p.text(`B`, -20, 197.5);
  p.text(`C`, -20, 230);
  p.textAlign(p.CENTER);
  p.text(`${gvs.component_A_antoine_parameters[0]}`, 55, 165);
  p.text(`${gvs.component_A_antoine_parameters[1].toFixed(1)}`, 55, 197.5);
  p.text(`${gvs.component_A_antoine_parameters[2].toFixed(1)}`, 55, 230);
  p.text(`${gvs.component_B_antoine_parameters[0]}`, 165, 165);
  p.text(`${gvs.component_B_antoine_parameters[1].toFixed(1)}`, 165, 197.5);
  p.text(`${gvs.component_B_antoine_parameters[2].toFixed(1)}`, 165, 230);
  p.textAlign(p.LEFT);
  p.text(`volume of component A remaining:           mL`, 0, 275);
  p.text(`volume of component B remaining:           mL`, 0, 300);
  p.fill(0, 0, 255);
  p.textAlign(p.CENTER);
  p.text(`${gvs.volume_A_remaining.toFixed(1)}`, 238, 275);
  p.text(`${gvs.volume_B_remaining.toFixed(1)}`, 238, 300);
  p.textAlign(p.LEFT);
  p.fill(0);
  p.textSize(18);
  p.text(`vapor condensate sample analysis:`, -20, 340);
  p.text(`y   =`, 40, 385);
  p.textSize(12);
  p.text(`A`, 50, 392);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(1);
  // table of antoine constants
  p.line(0, 145, 220, 145);
  p.line(0, 240, 220, 240);
  p.line(0, 145, 0, 240);
  p.line(220, 145, 220, 240);
  p.line(0, 175, 220, 175);
  p.line(0, 210, 220, 210);
  p.line(110, 145, 110, 240);
  // sample analysis box
  p.fill(250);
  p.rect(85, 365, 80, 30);
  p.fill(0);
  p.noStroke();
  p.textSize(18);
  if(gvs.not_enough_liquid) {
    p.textSize(16);
    p.fill(255, 0, 0);
    p.text(`not enough liquid remaining to perform this test!`, -20, 440);
  } else {
    if(!Number.isNaN(gvs.yA_sample)) {
      p.text(`${(Math.round(gvs.yA_sample * 1000) / 1000).toFixed(3)}`, 103, 386);
    }
  }
  p.pop();

  p.push();
  p.translate(580, 30);
  p.fill(250);
  p.stroke(0);
  p.strokeWeight(1);
  p.rect(-85, 5, 170, 90);
  p.textSize(14);
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER);
  p.text(`boiling flask conditions`, 0, -5);
  p.text(`760 mmHg`, 0, 25);
  p.text(`${gvs.temperature_flask.toFixed(1)}° C`, 0, 45);
  p.text(`${gvs.volume_A.toFixed(1)} mL component A`, 0, 65);
  p.text(`${(Math.round((10 - gvs.volume_A) * 10) / 10).toFixed(1)} mL component B`, 0, 85);
  p.pop();
}

function drawSubmissionPage(p) {
  p.push();
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.textWrap(p.WORD);
  p.text(`Enter the Margules Equation constants and their respective 95% confidence intervals in the input boxes below. The Margules Equation constants will be values between 0.00 and 2.00. Enter your answers with two decimal places of precision, e.g. 1.53.`, 120, 50, 550);
  p.text(`A     = `, 150, 212);
  p.text(`A     = `, 150, 272);
  p.text(`±`, 420, 212);
  p.text(`±`, 420, 272);
  p.textSize(12);
  p.text(`12`, 162, 217);
  p.text(`21`, 162, 277);
  p.pop();
}

function drawResultsPage(p) {

}

function drawAll(p) {
  if(gvs.submission_stage == 1) {
    drawInfo(p);
  } else if(gvs.submission_stage == 2) {
    drawSubmissionPage(p);
  } else {
    drawResultsPage(p);
  }
}

module.exports = drawAll;