
window.g = {
  cnv : undefined,
  x_pos : 0.5,
  Pr_no : 0.6,
  boundaryType : "temperature",
  targetIndex : 6293,
  deltaTupper : 0,
  deltaTupper2 : 0.075,
}

// Variables filled with boundaryLayer function
let b = {
  eta : [],
  f : [],
  df_deta : [],
  d2f_deta : [],
  TH : [],
  dTH_deta : [],
  Uinf : 1,
  delT : 1,
  kf : 0.0263,
  nu : 15.89*Math.pow(10,-6),
  Lcrit : 5*Math.pow(10,5)*(15.89*Math.pow(10,-6))/1, // 5e5*nu/Uinf
  x : [],
  // x_pos : 5, This value is represented by g.x_pos
  Rex : [],
  delta : [],
  vProfX : [],
  vProfY : [],
  du_dy0 : [],
  Cfx : [],
  deltaT : [],
  tProfx : [],
  tProfy : [],
  dT_dy0 : [],
  Nu_x : [],
  h_x : [],
  h_avg : 0,
  h_local : 0,

}

function setup() {
  g.cnv = createCanvas(900, 700);

  g.cnv.parent("graphics-wrapper");
  document.getElementsByTagName("main")[0].remove();

  let temp = boundaryLayer();
  // These values are set and hold all the info for each Pr number (TH and dTH_deta are 2D arrays, all other values are const)
  b.eta = temp[0];
  b.f = temp[1];
  b.df_deta = temp[2];
  b.d2f_deta = temp[3];
  b.TH = temp[4];
  b.dTH_deta = temp[5];
  
  addValues(); // Values calculated outside of boundaryLayer function
  noLoop();
 
  
}

function draw() {
  background(250);
  frameRate(1);
  push();
  textSize(20);
  text('Laminar flow over an isothermal, flat plate',100,70);
  pop();
  plateDraw();

  
  switch (g.boundaryType){
    case 'velocity':
  
      drawBlue(); // Draws du/dy @ y = 0 && Cf,x
      setTimeout(velocityBoundaryDraw(),2000);
      setTimeout(drawHx(),2000);
      setTimeout(velocityProf(),2000);
      break;
    case 'temperature':
      drawRed(); // Draws dT/dy @ y = 0 && Nux
      setTimeout(drawHx(),2000);
      setTimeout(temperatureBoundaryDraw(),2000);
      break;
  }
 
 
  
  
}


const range_1_element = document.getElementById("range-1");
const range_1_value_label = document.getElementById("range-1-value");
const range_2_element = document.getElementById("range-2");
const range_2_value_label = document.getElementById("range-2-value");
const select_element = document.getElementById("select-1");
let xlabel = document.getElementById("xLabel");
const select_element2 = document.getElementById("select-2");


// x/x_crit or Re_x/Re_crit
range_1_element.addEventListener("input", function() {
  const x_pos = Number(range_1_element.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  range_1_value_label.innerHTML = `${x_pos}`; // Edit the text of the global var range_1_value
  g.x_pos = x_pos; // Assign the number to the global object.
  //console.log(`g.x_pos is ${g.x_pos}`); // console.log is the easiest way to see a variable value in the javascript prompt.
  xDependentChanges(g.x_pos);
  xAndPrDependentChanges(g.x_pos,g.Pr_no);
  g.targetIndex = findClosest(b.x,10*g.x_pos);
  redraw();
});

// Prandtl number
select_element.addEventListener("change", function() {
  const Pr_no = select_element.value;
  g.Pr_no = Pr_no;
  //console.log(`g.Pr_no is ${Pr_no}`);
  xAndPrDependentChanges(g.x_pos,g.Pr_no);
  redraw();
})

// Boundary type
select_element2.addEventListener("change", function() {
  const boundaryType = select_element2.value;
  g.boundaryType = boundaryType;
  //console.log(`g.boundaryType is ${boundaryType}`);
  redraw();
})


// Copied from K. Regner's matlab code: function V_TH_BL
function boundaryLayer(){
  let dEta = 0.001;
  let total = 10;
  // Vectors to be returned. Need to define first spot as 0 for all to define next value
  let etaVec = [];
  etaVec[0] = 0;
  let fVec = [];
  fVec[0] = 0;
  let gVec = [];
  gVec[0] = 0;
  let hVec = []; // Starts at .3319
  hVec[0] = 0.3319;

  for(let i = 0; i < total/dEta; i++){
    etaVec.push(etaVec[i] + dEta);
    etaVec[i] = etaVec[i].toFixed(3); // Resolves minor rounding error
    fVec.push(fVec[i] + gVec[i]*dEta);
    gVec.push(gVec[i] + hVec[i]*dEta);
    hVec.push(hVec[i] - 0.5*fVec[i]*hVec[i]*dEta);
  }
  // Error checking
  let velCheck = gVec[total/dEta];
  if (Math.abs(velCheck - 1) > 0.01){
    console.log('Enter new guess for shooting method (velocity)');
  }
  
  let thVec = [];
  thVec[0] = [0, 0, 0]; // Defining initial values of thVec
  let thDVec = [];
  thDVec[0] = [0.277, 0.332, 0.48485]; // Defining inital values of thDVec
  let Pr = [0.6, 1, 3];
  // Temporary vectors to be used to fill thVec and thDVec
  let thTEMP = [];
  let thDTEMP = []; 
  

  for(let i = 0; i < total/dEta; i++){
    for(let j = 0; j < Pr.length; j++){
      thTEMP.push(thVec[i][j] + thDVec[i][j]*dEta);
      thDTEMP.push(thDVec[i][j] - fVec[i]*Pr[j]*thDVec[i][j]*dEta/2);
    }
    thVec.push(thTEMP);
    thDVec.push(thDTEMP);
    // Removing previous elements from the temporary arrays (originally I was rewriting the values in the temp array after declaring them with new Array(3) and that was breaking something)
    thTEMP = [];
    thDTEMP = [];
  }

 return([etaVec,fVec,gVec,hVec,thVec,thDVec])
}

function addValues(){
  
  let counter = 0;
  // Adding values to x and Rex
  for(let i = 0; i < b.Lcrit*1.26; i += b.Lcrit/10000){
    b.x.push(i);
    b.x[counter] = b.x[counter].toFixed(4) // Resolving decimals
    b.Rex.push(50*counter);
    counter++;
  }
  
  let temp = [];
  let temp2 = [];
  let temp3 = [];
  // Adding values to delta
  //let val; I was using val to fix the number to 4 decimal places but that was just how Matlab was showing me the numbers
  // Might need to do something like that... My numbers are slightly different than what comes out of the matlab code
  for(let i = 0; i < b.x.length; i++){
    //val = b.eta[4920]*Math.pow(b.nu*b.x[i]/b.Uinf,0.5);
    b.delta.push(b.eta[4920]*Math.pow(b.nu*b.x[i]/b.Uinf,0.5));

    //val = b.d2f_deta[0]*b.Uinf*Math.pow(b.Uinf/(b.nu*b.x[i]),0.5);
    b.du_dy0.push(b.d2f_deta[0]*b.Uinf*Math.pow(b.Uinf/(b.nu*b.x[i]),0.5));

    b.Cfx.push(2*b.nu*b.du_dy0[i]/Math.pow(b.Uinf,2));

    b.deltaT.push(b.eta[5948]*Math.pow(b.nu*b.x[i]/b.Uinf,1/2));

    for(let j = 0; j < 3; j++){
      temp.push(-1*b.dTH_deta[0][j]*Math.pow(b.Uinf/(b.nu*b.x[i]),0.5));
      temp2.push(-1*b.x[i]*temp[j]/b.delT);
      temp3.push(-1*temp[j]*b.kf/b.delT);
    }
    b.dT_dy0.push(temp);
    b.Nu_x.push(temp2);
    b.h_x.push(temp3);
    temp = [];
    temp2 = [];
    temp3 = [];
    g.deltaTupper = b.deltaT[b.deltaT.length-1];
  }


  // These values are set for inital Pr and x position and then will change based on those inputs
  for(let i = 0; i < b.df_deta.length; i++){
    b.vProfX.push(b.Uinf*b.df_deta[i] + 10*g.x_pos);
    b.vProfY.push(b.eta[i]*Math.pow(b.nu*g.x_pos*10/b.Uinf,1/2));
    for(let j = 0; j < 3; j++){
      temp.push(-1*b.TH[i][j]+1+10*g.x_pos);
    }
    b.tProfx.push(temp);
    temp = [];
    b.tProfy.push(b.eta[i]*Math.pow(b.nu*10*g.x_pos/b.Uinf,1/2));
  }

  b.h_avg = 0.664*b.kf*Math.pow(g.Pr_no,1/3)*Math.pow(b.Uinf/b.nu,1/2)/Math.pow(10*g.x_pos,1/2)
  b.h_local = b.h_x[Math.round(12600*g.x_pos)+1][0];
}



// For changing the values of vProfX, vProfY, tProfx, and tProfY
function xDependentChanges(x){
  // Clear old values out
  b.vProfX = [];
  b.vProfY = [];
  b.tProfx = [];
  b.tProfy = [];

  // Redefine values
  let temp = [];
  for(let i = 0; i < b.df_deta.length; i++){
    b.vProfX.push(b.Uinf*b.df_deta[i] + 10*x);
    b.vProfY.push(b.eta[i]*Math.pow(b.nu*x*10/b.Uinf,1/2));
    for(let j = 0; j < 3; j++){
      temp.push(-1*b.TH[i][j]+1+10*x);
    }
    b.tProfx.push(temp);
    temp = [];
    b.tProfy.push(b.eta[i]*Math.pow(b.nu*10*x/b.Uinf,1/2));
  }
}

// For chaning the values of h_avg and h_local
function xAndPrDependentChanges(x,Pr){
  let index, index2;

  if(Pr == .6){
    index = 0;
    index2 = 5947;
  } else if (Pr == 1){
    index = 1;
    index2 = 4891;
  } else {
    index = 2;
    index2 = 3266;
  }

  b.h_avg = 0.664*b.kf*Math.pow(Pr,1/3)*Math.pow(b.Uinf/b.nu,1/2)/Math.pow(10*x,1/2)
  b.h_local = b.h_x[Math.round(12600*x)][index];
  b.deltaT = [];
  for(let i = 0; i < b.x.length; i++){
    b.deltaT.push(b.eta[index2]*Math.pow(b.nu*b.x[i]/b.Uinf,1/2));
  }
}

function drawBlue(){

  let xTicks = ['0','0.2','0.4','0.6','0.8','1'];
  let yTicks1 = ['0', '50', '100', '150', '200'];
  let yTicks2 = ['0', '0.002', '0.004', '0.006', '0.008', '0.01']
  let yTicks3 = ['0','2','4','6','8','10'];

  push();
  strokeWeight(2);
  for(let i = 0; i < 3; i++){
    push();
    noFill();
    rect(60+i*width/3+20,height/2+50,200,200); // Graph frame
    pop();
    textSize(15);
    push();
    textStyle(ITALIC);
    text("x/x_crit or Re_x/Re_x,crit",90+i*width/3,650); // X-label
    pop();

    // x lines
    for(let j = 0; j < 4; j++){
      line(80+i*width/3+40*(j+1),height/2+250,80+i*width/3+40*(j+1),height/2+245);
      line(80+i*width/3+40*(j+1),height/2+50,80+i*width/3+40*(j+1),height/2+55);
    }
    // x tick labels
    for(let j = 0; j < xTicks.length; j++){
      if(j == 0 || j == 5){
        text(xTicks[j],80+i*width/3+40*j-5,height/2+267);
      } else {
        text(xTicks[j],80+i*width/3+40*j-10,height/2+267);
      }
    }
  }

  // du/dy y Ticks and Labels 
  for(let j = 0; j < yTicks1.length; j++){
    line(80,height/2+250-50*j,85,height/2+250-50*j);
    if(j == 0){
    
      text(yTicks1[j],65,height/2+255-50*j);
    } else if (j == 1){
      text(yTicks1[j],60,height/2+255-50*j);
    } else {
      text(yTicks1[j],50,height/2+255-50*j);
    }
  }

  // Cf,x y Ticks and Labels
  for(let j = 0; j < yTicks2.length; j++){
    line(80+width/3,height/2+250-40*j,85+width/3,height/2+250-40*j);
    if(j == 0){
      text(yTicks2[j],65+width/3,height/2+255-40*j);
    } else if (j == yTicks2.length-1){
      text(yTicks2[j],47+width/3,height/2+255-40*j);
    } else {
      text(yTicks2[j],38+width/3,height/2+255-40*j);
    }
  }


  // hx y Ticks and Labels
  for(let j = 0; j < yTicks3.length; j++){
    line(80+2*width/3,height/2+250-40*j,85+2*width/3,height/2+250-40*j);
    if(j == yTicks3.length-1){
      text(yTicks3[j],60+2*width/3,height/2+255-40*j);
    } else {
      text(yTicks3[j],65+2*width/3,height/2+255-40*j);
    }
  }

  let xRep = map(g.x_pos,0,1,0,200);
  for(let i = 0; i < 3; i++){
    if(i == 2){
      line(80+i*width/3+xRep,height/2+250,80+i*width/3+xRep,height/2+150)
    } else {
      line(80+i*width/3+xRep,height/2+50,80+i*width/3+xRep,height/2+250);
    }
  }

  pop();
  push();
  textSize(20);
  translate(25,600);
  rotate(radians(270));
  textStyle(ITALIC)
  text('∂u/∂y @ y = 0 [m/s/m]',15,5);
  text('C_f,x',80,width/3);
  text('h_x',80,2*width/3+20);
  pop();
  
  
  
}

function drawRed(){
  
  let xTicks = ['0','0.2','0.4','0.6','0.8','1'];
  let yTicks1 = ['-300','-250','-200','-150','-100','-50','0'];
  let yTicks2 = ['0','100','200','300','400'];
  let yTicks3 = ['0','2','4','6','8','10'];
  push();
  strokeWeight(2);
  for(let i = 0; i < 3; i++){
    rect(80+i*width/3,height/2+50,200,200); // Graph frame
    textSize(15);
    push();
    textStyle(ITALIC);
    text("x/x_crit or Re_x/Re_x,crit",90+i*width/3,650); // X-label
    pop();
    
    // x lines
    for(let j = 0; j < 4; j++){
      line(80+i*width/3+40*(j+1),height/2+250,80+i*width/3+40*(j+1),height/2+245);
      line(80+i*width/3+40*(j+1),height/2+50,80+i*width/3+40*(j+1),height/2+55);
    }
    // x tick labels
    for(let j = 0; j < xTicks.length; j++){
      if(j == 0 || j == 5){
        text(xTicks[j],80+i*width/3+40*j-5,height/2+267);
      } else {
        text(xTicks[j],80+i*width/3+40*j-10,height/2+267);
      }
    }
  }

  // du/dy y Ticks and Labels 
  for(let j = 0; j < yTicks1.length; j++){
    line(80,height/2+250-200/6*j,85,height/2+250-200/6*j);
    if(j == yTicks1.length-1){
      text(yTicks1[j],67,height/2+255-200/6*j);
    } else if (j == yTicks1.length-2){
      text(yTicks1[j],52,height/2+255-200/6*j);
    } else {
      text(yTicks1[j],45,height/2+255-200/6*j);
    }
  }


  // Nu_x y Ticks and Labels
  for(let j = 0; j < yTicks2.length; j++){
    line(80+width/3,height/2+250-50*j,85+width/3,height/2+250-50*j);
    if(j == 0){
      text(yTicks2[j],65+width/3,height/2+255-50*j);
    } else {
      text(yTicks2[j],50+width/3,height/2+255-50*j);
    }
    
  }

  // hx y Ticks and Labels
  for(let j = 0; j < yTicks3.length; j++){
    line(80+2*width/3,height/2+250-40*j,85+2*width/3,height/2+250-40*j);
    if(j == yTicks3.length-1){
      text(yTicks3[j],60+2*width/3,height/2+255-40*j);
    } else {
      text(yTicks3[j],65+2*width/3,height/2+255-40*j);
    }
  }

  let xRep = map(g.x_pos,0,1,0,200);
  for(let i = 0; i < 3; i++){
    if(i == 2){
      line(80+i*width/3+xRep,height/2+250,80+i*width/3+xRep,height/2+150);
    } else {
      line(80+i*width/3+xRep,height/2+50,80+i*width/3+xRep,height/2+250);
    }
  }

  pop();
  push();
  textSize(20);
  translate(25,600);
  rotate(radians(270));
  textStyle(ITALIC)
  text('∂T/∂y @ y = 0 [K/m]',15,5);
  text('Nu_x',80,width/3);
  text('h_x',80,2*width/3+20);
  pop();
}

function velocityBoundaryDraw(){
  // Velocity Boundary \\
  // origin @ px(75,275)
  // top right corner @px(825,50)
  let x, y;
  // pulling values for use in mapping values
  let xlower = b.x[0];
  let xupper = b.x[b.x.length-1];
  let ylower = b.delta[0];
  let yupper = b.delta[b.delta.length-1];
  push();
  stroke(0,0,255); strokeWeight(2);
  beginShape();
  noFill();
  for(let i = 0; i < b.x.length; i++){
    x = map(b.x[i],xlower,xupper,75,825);
    y = map(b.delta[i],ylower,yupper,275,105); // 105 corresponds to the top of the array at @g.xpos
    curveVertex(x,y);

    if(i == b.x.length-1){
      push();
      textSize(15); stroke(0); strokeWeight(1);
      text('δ(x)',x+5,y)
      pop();
    }
  }
  endShape();
  

  //////////\\\\\\\\
  // du/dy @ y = 0 \\
  //////////\\\\\\\\\
  
  // evaluating for du_dy0 ~= 200, so values can be mapped accordingly
  let temp = true; let index = 0;
  while (temp){
    yupper = b.du_dy0[index];
    if (Math.abs(yupper-200) < 0.1){
      temp = false;
    }
    index++;
  }

  ylower = b.du_dy0[b.du_dy0.length-1];
  beginShape();
  for(let i = 1; i < b.x.length; i++){
    x = map(b.x[i],xlower,xupper,80,280);
    y = map(b.du_dy0[i],ylower,yupper,height/2+250-ylower,height/2);
    if (y < height/2+50){ // Correction for very large terms at low x-values
      y = height/2 + 50;
    }
    curveVertex(x,y);
  }
  endShape();
  

  //////////\\\\\\\\
  /////// Cfx \\\\\\\
  //////////\\\\\\\\\
  // Evaluating for Cfx ~=.01, so values can be mapped accordingly
  temp = true; index = 0;
  while (temp){
    yupper = b.Cfx[index];
    if (Math.abs(yupper-.01) < 0.001){
      temp = false;
    }
    index++;
  }

  ylower = b.Cfx[b.Cfx.length-1];
  let shift = ylower/0.002*40; // Account for values not going to zero
  beginShape();
  for(let i = 1; i < b.x.length; i++){
    x = map(b.x[i],xlower,xupper,80+width/3,280+width/3);
    y = map(b.Cfx[i],ylower,yupper,height/2+250-shift,height/2);
    if (y < height/2 + 50){
      y = height/2 + 50;
    }
    curveVertex(x,y);
  }
  endShape();
  pop();

  push();
  //////////\\\\\\\\
  //////// hx \\\\\\\
  //////////\\\\\\\\\


  pop();

}

function plateDraw(){
  let xTicks = ['0','0.2','0.4','0.6','0.8','1'];
  
  push();
  let xRep = map(g.x_pos,0,1,75,825);
  strokeWeight(2);
  
  line(75,300,825,300);
  textSize(20); textStyle(ITALIC);
  text("x/x_crit or Re_x/Re_x,crit",330,360); // X-label
  line(xRep,300,xRep,100);
  fill(0);
  triangle(xRep,95,xRep-5,105,xRep+5,105);
  pop();

  push();
  strokeWeight(2);
  textSize(15);
  for(let i = 0; i < xTicks.length; i++){
    line(75+150*i,300,75+150*i,308);
    if(i == 0 || i == xTicks.length-1){
      text(xTicks[i],70+150*i,325);
    } else {
      text(xTicks[i],65+150*i,325);
    }
  }
  pop();

  push();
  fill(130);
  rect(75,275,750,25);
  pop();

  push();
  line(75,270,75,50);
  fill(0);
  triangle(75,45,72,55,78,55);
  textSize(15); textStyle(ITALIC);
  text('y',72,40); 

  line(30,270,30,100);
  for(let i = 0; i < 7; i++){
    line(30,270-170/6*i,70,270-170/6*i);
    triangle(72,270-170/6*i,62,273-170/6*i,62,267-170/6*i);
  }
  text('U_∞, T_∞',5,80);
  pop();
}

function drawHx(){
  push();
  strokeWeight(2); noFill();
  let index, yupper, xlower, xupper, shift;
  if (g.Pr_no == .6){
    index = 0;
  } else if (g.Pr_no == 1){
    index = 1;
  } else {
    index = 2;
  }
  let temp = true; let index1 = 0;
  while(temp){
    yupper = b.h_x[index1][index];
    if(Math.abs(yupper-10) < .1){
      temp = false;
    }
    index1++;
  }
  
  xlower = b.x[0];
  xupper = b.x[b.x.length-1];
  ylower = b.h_x[b.h_x.length-1][index];
  shift = ylower/2*40;
  let xTemp = []; // Variables used to store x and y coordinates and plot filled area
  let yTemp = [];

  beginShape();
  for(let i = g.targetIndex; i < b.x.length; i++){
    x = map(b.x[i],xlower,xupper,80+2*width/3,280+2*width/3);
    y = map(b.h_x[i][index],ylower,yupper,height/2+250-shift,height/2);
    if (y < height/2 + 50){
      y = height/2 + 50;
    }
    curveVertex(x,y);
  }
  endShape();
  pop();
  push();
  beginShape();
  
  strokeWeight(2);
  fill(255,0,0);
  
  for(let i = 1; i < g.targetIndex; i++){
    x = map(b.x[i],xlower,xupper,80+2*width/3,280+2*width/3);
    y = map(b.h_x[i][index],ylower,yupper,height/2+250-shift,height/2);
    if (y < height/2 + 50){
      y = height/2 + 50;
    }
    curveVertex(x,y);
    
  }

  for(let j = 0; j < Math.round(height/2+250 - y);j++){
    curveVertex(x,y+j);
  }
  for(let j = g.targetIndex; j > 0; j--){
    x = map(b.x[j],xlower,xupper,80+2*width/3,280+2*width/3);
    curveVertex(x,height/2+250);
  }
  endShape();
  pop();
  b.h_avg = 0.664*b.kf*Math.pow(g.Pr_no,1/3)*Math.pow(b.Uinf/b.nu,1/2)/Math.pow(10*g.x_pos,1/2);
  b.h_local = b.h_x[Math.round(12600*g.x_pos)][index];
  let hbarLabel = 'h_0-x = ' + b.h_avg.toFixed(2) + ' W/m^2-K';
  let hLabel = 'h_x = ' + b.h_local.toFixed(2) + ' W/m^2-K';
  push();
  textSize(15);
  line(700,435,705,435);
  text(hbarLabel,700,450);
  text(hLabel,700,475);
  pop();
}

function velocityProf(){
  let xRep = map(g.x_pos,0,1,75,825);
  let x, y;
  let xlower,xupper,ylower,yupper;
  xlower = b.vProfX[0];
  xupper = b.vProfX[b.vProfX.length-1];
  ylower = b.vProfY[0];
  yupper = b.vProfY[b.vProfY.length-1];

  let ylower2 = b.delta[0];
  let yupper2 = b.delta[b.delta.length-1];
  let ymax = map(b.delta[g.targetIndex],ylower2,yupper2,275,105);
  //console.log(ymax)
  let xTemp = []; let yTemp = [];
  //let temp = Math.round(10001/12601*g.targetIndex/5); // target index multiplied by ratio of lengths of v-profiles to x

  push();
  noFill();
  beginShape(); strokeWeight(2); stroke(0,0,255);
  for(let i = 0; i < b.vProfX.length; i++){
    x = map(b.vProfX[i],xlower,xupper,xRep,xRep+70);
    y = map(b.vProfY[i],ylower,yupper,275,ymax-50);
    xTemp.push(x); yTemp.push(y);
    curveVertex(x,y);
    
  }
  endShape();
  pop();

 
  push();
  fill(0);
  let temp = findClosest(yTemp,ymax);
  let scale = Math.round(temp/6);
  for(let i = 1; i < 7; i++){
    line(xRep,yTemp[scale*i],xTemp[scale*i]-3,yTemp[scale*i])
    triangle(xTemp[scale*i],yTemp[scale*i],xTemp[scale*i]-7,yTemp[scale*i]+3,xTemp[scale*i]-7,yTemp[scale*i]-3)
  }
  strokeWeight(2);
  let slope = (yTemp[scale]-275)/(xTemp[scale]-xRep);
  line(xRep,275,xRep+100,275+slope*100)
  pop();
}


function temperatureBoundaryDraw(){
  let xRep = map(g.x_pos,0,1,75,825);
  let index = 0;
  let xlower, xupper;
  let ylower, yupper;
  if(g.Pr_no == .6){
    index = 0;
  } else if (g.Pr_no == 1){
    index = 1;
  } else if (g.Pr_no == 3) {
    index = 2;
  }

  let ylower2 = b.deltaT[0];
  let yupper2 = b.deltaT[b.deltaT.length-1];
  // console.log(`ylower2: ${ylower2}`)
  // console.log(`yupper2: ${yupper2}`)
  let ymax = map(b.deltaT[g.targetIndex],ylower2,g.deltaTupper2,275,105);
  // console.log(`deltaT @ target: ${b.deltaT[g.targetIndex]}`)
  // console.log(`ymax: ${ymax}`)
  let xTemp = [];
  let yTemp = [];

  xlower = b.x[0];
  xupper = b.x[b.x.length-1];
  ylower = b.deltaT[0];
  push();
  strokeWeight(2); stroke(255,0,0);
  noFill();
  beginShape();
  for(let i = 0; i < b.x.length;i++){
    x = map(b.x[i],xlower,xupper,75,825);
    y = map(b.deltaT[i],ylower,g.deltaTupper,275,75); // deltaTupper used to appropriately scale the values across Pr numbers
    curveVertex(x,y);
  }
  
  endShape();
  // Temperature profile
  xlower = b.tProfx[0][index];
  xupper = b.tProfx[b.tProfx.length-1][index];
  ylower = b.tProfy[0];
  yupper = b.tProfy[b.tProfy.length-1];
  let xtemp2,ytemp2;
  beginShape();
  for(let i = 0; i < b.tProfx.length; i++){
    
    x = map(b.tProfx[i][index],xlower,xupper,xRep+70,xRep);
    y = map(b.tProfy[i],ylower,yupper,275,ymax-30);
    xTemp.push(x); yTemp.push(y);
    curveVertex(x,y);
    
  }
  
  endShape();
  push();
  strokeWeight(1); stroke(0);
  let slope = (yTemp[1]-yTemp[0])/(xRep+70-xTemp[1]);
  line(xRep-20,275+slope*90,xRep+70,275)
  pop();

  //dT/dy 
  let temp = true; 
  let index2 = 1;
  while(temp){
    
    ylower = b.dT_dy0[index2][index];
    if(Math.abs(b.dT_dy0[index2][index]+300) < 2){
      temp = false;
    }
    index2++;
  }
  

  yupper = b.dT_dy0[b.dT_dy0.length-1][0];
  
  xlower = b.x[0];
  xupper = b.x[b.x.length-1];
  beginShape();
  for(let i = 1; i < b.x.length; i++){
    x = map(b.x[i],xlower,xupper,80,280);
    y = map(b.dT_dy0[i][index],ylower,yupper,height/2+250,height/2+50-(200/300)*yupper);
    if(y > height/2+250){
      y = height/2+250;
    }
    curveVertex(x,y);
  }
  endShape();



  // Nu_x
  yupper = b.Nu_x[b.Nu_x.length-1][2];
  ylower = b.Nu_x[1][index];
  beginShape();
  for(let i = 1; i < b.x.length; i++){
    x = map(b.x[i],xlower,xupper,80+width/3,280+width/3);
    y = map(b.Nu_x[i][index],ylower,yupper,height/2+250,height/2+50+.5*(400-yupper));
    curveVertex(x,y);
  }
  endShape();


  pop();

}

// For finding x-coord to close off filled area of h_x graph
function findClosest(array,target){
  let bestDif = 10000;
  let diff, position;

  for(let i = 0; i < array.length; i++){
    diff = Math.abs(array[i]-target);
    
    if(diff < bestDif){
      bestDif = diff;
      position = i;
    }
  }
  return(position);
}





