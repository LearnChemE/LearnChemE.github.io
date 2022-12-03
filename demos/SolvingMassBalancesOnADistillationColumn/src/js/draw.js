function landingPage(p) {
  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  p.textAlign(p.LEFT, p.CENTER);
  const intro1 = 'This is a quiz simulation to test your ability to perform mass balances.';
  const intro2 = 'It is three questions long and your score will be displayed at the end.'
  const intro3 = 'To begin, enter your name in the input box below then press the blue "start" button above.';
  const intro_width = p.textWidth(intro3);
  p.text(intro1, p.width / 2 - intro_width / 2, 100);
  p.text(intro2, p.width / 2 - intro_width / 2, 130);
  p.text(intro3, p.width / 2 - intro_width / 2, 160);
  p.text("name:", 200, 240);
  p.pop();
}

function question1(p) {
  p.push();
  p.translate(p.width / 2, p.height / 2 - 20);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(2);
  p.line(-50, 0, -300, 0);
  p.fill(0);
  p.triangle(-52, 0, -72, 5, -72, -5);
  p.noStroke();
  p.textSize(18);
  p.text("feed", -200, -10);
  p.text(`z   = ${gvs.Q1zF.toFixed(2)}`, -220, 30);
  p.text(`${gvs.Q1F.toFixed(2)} kmol/h`, -220, 65);
  p.textSize(12);
  p.text("F", -209, 36);

  p.textSize(18);
  p.text(`x   = ${gvs.Q1xD.toFixed(2)}`, 90, -115);
  p.text(`${gvs.Q1D.toFixed(2)} kmol/h`, 90, -80);
  p.textSize(12);
  p.text("D", 101, -109);

  p.textSize(18);
  p.text(`x   = ${gvs.Q1xB.toFixed(2)}`, 90, 185);
  p.text(`${gvs.Q1B.toFixed(2)} kmol/h`, 90, 220);
  p.textSize(12);
  p.text("B", 101, 191);

  p.pop();
}

function question2(p) {
  p.push();
  p.translate(p.width / 2, p.height / 2 - 20);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(2);
  p.translate(0, -70);
  p.line(-50, 0, -300, 0);
  p.fill(0);
  p.triangle(-52, 0, -72, 5, -72, -5);
  p.translate(0, 140);
  p.line(-50, 0, -300, 0);
  p.triangle(-52, 0, -72, 5, -72, -5);
  p.noStroke();
  p.textSize(18);
  p.text("feed 1", -200, -150);
  p.text("feed 2", -200, -10);

  p.translate(0, -70);

  p.text(`z     = ${gvs.Q2zF1.toFixed(2)}`, -220, -40);
  p.text(`${gvs.Q2F1.toFixed(2)} kmol/h`, -220, -5);
  p.textSize(12);
  p.text("F,1", -209, -34);

  p.textSize(18);
  p.text(`z     = ${gvs.Q2zF2.toFixed(2)}`, -220, 100);
  p.text(`${gvs.Q2F2.toFixed(2)} kmol/h`, -220, 135);
  p.textSize(12);
  p.text("F,2", -209, 106);

  p.textSize(18);
  p.text(`x   = ${gvs.Q2xD.toFixed(2)}`, 90, -115);
  p.text(`${gvs.Q2D.toFixed(2)} kmol/h`, 90, -80);
  p.textSize(12);
  p.text("D", 101, -109);

  p.textSize(18);
  p.text(`x   = ${gvs.Q2xB.toFixed(2)}`, 90, 185);
  p.text(`${gvs.Q2B.toFixed(2)} kmol/h`, 90, 220);
  p.textSize(12);
  p.text("B", 101, 191);
  p.pop();
}

function question3(p) {
  p.push();
  p.translate(p.width / 2, p.height / 2 - 20);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(2);
  p.line(-50, 0, -300, 0);
  p.fill(0);
  p.triangle(-52, 0, -72, 5, -72, -5);
  p.noStroke();
  p.textSize(18);
  p.text("feed", -200, -10);

  p.text(`z     = ${gvs.Q3zF1.toFixed(2)}`, -220, 30);
  p.text(`z     = ${gvs.Q3zF2.toFixed(2)}`, -220, 65);
  p.text(`${gvs.Q3F.toFixed(2)} kmol/h`, -220, 100);
  p.textSize(12);
  p.text("F,A", -209, 36);
  p.text("F,B", -209, 71);

  p.textSize(18);
  p.text(`x     = ${gvs.Q3xD1.toFixed(2)}`, 90, -115);
  p.text(`x     = ${gvs.Q3xD2.toFixed(2)}`, 90, -80);
  p.text(`${gvs.Q3D.toFixed(2)} kmol/h`, 90, -45);
  p.textSize(12);
  p.text("D,A", 101, -109);
  p.text("D,B", 101, -74);

  p.textSize(18);
  p.text(`x     = ${gvs.Q3xB1.toFixed(2)}`, 90, 185);
  p.text(`x     = ${gvs.Q3xB2.toFixed(2)}`, 90, 220);
  p.text(`${gvs.Q3B.toFixed(2)} kmol/h`, 90, 255);
  p.textSize(12);
  p.text("B,A", 101, 191);
  p.text("B,B", 101, 226);

  p.pop();
}

function showScore(p) {
  p.push();
  let correct_answers = 0;
  for(let i = 0; i < 7; i++) {
    const guess = Math.round(Number(gvs.guesses[i]) * 100) / 100;
    const answer = gvs.answers[i];
    if(Math.abs(guess - answer) <= 0.01) {
      correct_answers++
    }
  }
  p.pop();

  for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 15; j++) {
      p.push();
      p.textSize(16);
      p.noStroke();
      p.fill(220);
      p.translate((i / 10) * p.width, (j / 15) * p.height);
      p.rotate(p.PI / 4);
      p.text("LearnChemE", 0, 0);
      p.pop();
    }
  }

  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(36);
  p.textAlign(p.CENTER, p.CENTER);
  p.translate(p.width / 2, p.height / 2);
  p.text(`Name: ${gvs.name}`, 0, -50);
  p.text(`Your score: ${correct_answers} / 7`, 0, 0);
  p.pop();
}

function drawColumn(p) {
  p.push();
  p.textSize(18);
  p.noStroke();
  p.fill("red");
  if(gvs.solution_shown) {
    p.text(`press "next question" to proceed`, 260, 40);
  } else {
    p.text(`type the answers in the input boxes, then press "show solution" to check your answers`, 50, 40);
  }
  p.pop();

  p.push();
  p.translate(p.width / 2, p.height / 2 - 20);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(2);
  p.line(-50, -100, -50, 100);
  p.line(50, -100, 50, 100);
  p.arc(0, -100, 100, 40, p.PI, 0);
  p.arc(0, 100, 100, 40, 0, p.PI);
  p.line(0, -120, 0, -150);
  p.line(0, -150, 250, -150);
  p.line(0, 120, 0, 150);
  p.line(0, 150, 250, 150);
  p.fill(0);
  p.triangle(250, -150, 230, -155, 230, -145);
  p.triangle(250, 150, 230, 155, 230, 145);
  p.noStroke();
  p.textSize(18);
  p.text("distillate", 120, -160);
  p.text("bottoms", 120, 140);
  p.pop();
}

function drawAll(p) {
  
  if(gvs.step === 0) {
    landingPage(p)
  }
  
  if(gvs.step === 1) {
    question1(p);
    drawColumn(p);
  }

  if(gvs.step === 2) {
    question2(p);
    drawColumn(p);
  }

  if(gvs.step === 3) {
    question3(p);
    drawColumn(p);
  }

  if(gvs.step === 4) {
    showScore(p)
  }
}

module.exports = drawAll;