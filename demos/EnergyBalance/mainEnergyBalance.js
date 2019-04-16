// Global variables
let distColImg;
let nextButton;
let cnv;
let overlayCnv;
let cnvWidth;
let cnvHeight;
let bG = [255, 255, 255];
let aspRatio = 1500/1200;
let dColAspRatio;
let step = 1;
let F = 25;
let D = 0.5 * F;
let B = (1 - 0.5) * F;
let textReg = 20;
let inpB;

function preload() {
  distColImg = loadImage('./img/DistCol.png');
}

function centerCanvas() {
  cnvWidth = Math.min(windowWidth, 1500);
  cnvHeight = Math.min(windowHeight, 1200);
  if(cnvWidth/cnvHeight < aspRatio) {
    cnvHeight = cnvWidth / aspRatio;
  } else if(cnvWidth/cnvHeight > aspRatio) {
    cnvWidth = cnvHeight * aspRatio;
  }
  resizeCanvas(cnvWidth, cnvHeight);
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
  nextButton.position(x + 10, y + 10);
  if(cnvWidth < 500) {textSize(12);}
  else if(500 <= cnvWidth && cnvWidth <=1000) {textSize(20);}
  else if(cnvWidth >= 1000) {textSize(24);}
}

function setup() {
  cnvWidth = Math.min(windowWidth, 600);
  cnvHeight = Math.min(windowHeight, 600);

  cnv = createCanvas(cnvWidth, cnvHeight);
  overlayCnv = createGraphics(cnvWidth, cnvHeight);
  
  nextButton = createButton('begin');
  nextButton.mousePressed(performAction);

  inpB = createInput('type your answer here');
  inpB.size(cnvWidth/10);
  inpB.hide();
  
  centerCanvas();
  dColAspRatio = distColImg.width / distColImg.height;

  background(230, 230, 230);
}

function windowResized() {
  centerCanvas();
}

function performAction() {
  switch(step) {
    case 1:
      nextButton.html('next step');
      step++;
      break;
    case 2:
      nextButton.html('begin');
      step = 1;
      break;
  }
}

function draw() {
  background.apply(this, bG);
  switch(step) {
    case 1:
      text("this is a practice exercise to solve\nmass and energy balances around\na simple, continuous distillation\ncolumn. Press \"begin\" when you're ready\nto begin.", 0, 70);
      break;
    case 2:
      image(distColImg, 150, 50, (cnvHeight - 100)*dColAspRatio, cnvHeight - 100);
      push();
      text("step 1. solve for B");
      text("F = ".concat(F, " mol/s"), 100, (cnvHeight - 100) / 1.8);
      inpB.center();
      inpB.show();
      text("D = ".concat(D, " mol/s"), 150 + (cnvHeight-100)*dColAspRatio, 30 + cnvHeight / 2.6);
      text("");
      pop();
    case 3:
      if(step < 3) {break;}
      else {text("B = ".concat(B, " mol/s"), 150 + (cnvHeight-100)*dColAspRatio/2.2, cnvHeight - 50);}
      break;
    default:
      break;
  }
}
