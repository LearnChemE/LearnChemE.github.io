// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.m_dothot" because it will minimize the risk of namespace issues.
window.g = {
  cnv : undefined,
  m_dothot : 0.3, // kg/s
  m_dotcold : 0.3,
  HEX_length : 15, // m
  hot_fluid : "liquid water",
  flow_type : "parallel",

  // HEX properties
  di : 0.025, // m
  do : 0.045,
  T_hot1 : 400, // K
  T_cold1 : 300,

  // For graphing purposes
  left : 100,
  right : 750,
  top : 50,
  bottom : 500,
}

// See https://p5js.org/ to learn how to use this graphics library. setup() and draw() are used to draw on the canvas object of the page.  Seriously, spend some time learning p5.js because it will make drawing graphics a lot easier.  You can watch tutorial videos on the "Coding Train" youtube channel. They have a p5.js crash course under their playlists section.  It will make these functions make a lot more sense.
function setup() {
  // Create a p5.js canvas 800px wide and 600px high, and assign it to the global variable "cnv".
  g.cnv = createCanvas(800, 600);

  // Set the parent element to "graphics-wrapper"
  g.cnv.parent("graphics-wrapper");

  // The "main" element is unnecessary. Don't worry about this too much
  document.getElementsByTagName("main")[0].remove();
}

// Whatever is included in draw() will be calculated at 60 fps.  It is basically a loop that calls itself every 16.67 ms. You can pause it at any time with the noLoop() function and start it again with the loop() function. Be sure to include every graphics statement in a push() / pop() statement, because it minimizes the chance that you accidentally apply styling or properties to another graphics object.
function draw() {
  background(250);

  // BUILDING THE GRAPH \\

  // Temperature lines & labels
  push();
  rect(100,50,650,450);
  let tempInfo = drawTemplines(); // Drawing temperature lines returning values relevant to temperature (pixel value of T = 295K, pixels between lines, and scale between lines)
  let T295 = tempInfo[0];
  let spacePer_Tempmark = tempInfo[1];
  let scaleTemperature = tempInfo[2];

  let distanceInfo = drawDistlines(); // Drawing distance lines and returning values relevant to positioning (pixel value of 0m, pixels between lines, and scale between lines)
  let zeroPosition = distanceInfo[0];
  let spacePer_Position = distanceInfo[1];
  let scalePosition = distanceInfo[2];

 let cp_vec, mu_vec, k_vec;
 let cp_hot, mu_hot, k_hot;
 let cp_cold, mu_cold, k_cold;
 let properties;

 // Grabbing hot fluid properties based on fluid type and initial hot temperature (400 K)
  switch(g.hot_fluid){
    case 'liquid water':
      cp_vec = cp_water;
      mu_vec = mu_water;
      k_vec = k_water;
      properties = getProperties(g.T_hot1,cp_vec,mu_vec,k_vec);
      cp_hot = properties[0];
      mu_hot = properties[1];
      k_hot = properties[2];
      break;
    case 'air': // Air uses set values
      cp_hot = cp_air;
      mu_hot = mu_air;
      k_hot = k_air; 
      break;
    case 'liquid sodium':
      cp_vec = cp_na;
      mu_vec = mu_na;
      k_vec = k_na;
      properties = getProperties(g.T_hot1,cp_vec,mu_vec,k_vec);
      cp_hot = properties[0];
      mu_hot = properties[1];
      k_hot = properties[2];
      break;
  }

  // Grabbing cold fluid properties (fixed fluid: water)
  let properties_cold;
  properties_cold = getProperties(g.T_cold1,cp_water,mu_water,k_water);
  cp_cold = properties_cold[0];
  mu_cold = properties_cold[1];
  k_cold = properties_cold[2];

  // Calculating Reynold's numbers
  d_hot = g.do - g.di;
  d_cold = g.di;
  crt_hot = (g.do + g.di)/(g.do - g.di); // Not really sure what this is but I think it has to do with the annular flow
  crt_cold = 1;

  Re_hot = 4*g.m_dothot/(Math.PI*mu_hot*d_hot*crt_hot);
  Re_cold = 4*g.m_dotcold/(Math.PI*mu_cold*d_cold*crt_cold);

  // Calculating Nusselt number
  nus_hot = nusselt(Re_hot,cp_hot,mu_hot,k_hot,.3);
  nus_cold = nusselt(Re_cold,cp_cold,mu_cold,k_cold,.4);
  

  // Calculating overall heat transfer coefficient
  let U; 
  U = Math.pow(d_hot/(nus_hot*k_hot)+d_cold/(nus_cold*k_cold),-1);

  
 
  let temperatures; // Variable to hold temperature values
  let step = .1; // Used for resolution in Euler's method
  let delta1, delta2, LMTD; // Used for calculating log-mean temperature difference
  let Q; // For displaying heat transfer rate
  switch(g.flow_type){
    case 'parallel':
    temperatures = parallelMATH(U,cp_hot,cp_cold,step);
    // Vector used to plot positions
    let positions = []; 
    for(let i = 0; i<temperatures.length; i++){ 
      positions.push((step*i).toFixed(1)); // Tofixed 1 decimal to avoid slight error
    } // Note: if step size is adjusted value in 'toFixed' needs to be modified
    //console.log(positions)
    drawParallel(temperatures,0,T295,spacePer_Tempmark,scaleTemperature,zeroPosition,spacePer_Position,positions);
    drawParallel(temperatures,1,T295,spacePer_Tempmark,scaleTemperature,zeroPosition,spacePer_Position,positions);
    delta1 = temperatures[0][0]-temperatures[0][1];
    delta2 = temperatures[temperatures.length-1][0]-temperatures[temperatures.length-1][1];
    LMTD = (delta1-delta2)/Math.log(delta1/delta2);
    Q = U*Math.PI*g.di*g.HEX_length*LMTD/1000;

    break;
    case 'counterflow':

    break;

    

  }

  // Heat transfer rate label
  push();
  textSize(25);
  let Q_temp = Q.toFixed(1);
  let Q_label = Q_temp.toString();
  let title = "Heat transfer rate = ";
  let units = "kW";
  let temp1 = title.concat(Q_label);
  let HT_display = temp1.concat(units);
  text(HT_display,250,40);
  pop();

  // Labels for turbulent or laminar flow
  push();
  rect(525,70,200,72);
  let hotFlow = "Hot flow = ";
  let coldFlow = "Cold flow = ";
  let hotType, coldType;
  if(Re_hot >= 10000){
    hotType = "turbulent";
  } else {
    hotType = "laminar"
  }
  if(Re_cold >= 10000){
    coldType = "turbulent";
  } else {
    coldType = "laminar";
  }
  let hotLabel = hotFlow.concat(hotType);
  let coldLabel = coldFlow.concat(coldType);
  textSize(20);
  text(hotLabel,535,100);
  text(coldLabel,534,125);
  pop();
    
  
 
}

const range_1_element = document.getElementById("range-1");
const range_1_value_label = document.getElementById("range-1-value");
const range_2_element = document.getElementById("range-2");
const range_2_value_label = document.getElementById("range-2-value");
const range_3_element = document.getElementById("range-3");
const range_3_value_label = document.getElementById("range-3-value");
const select_element = document.getElementById("select-1");
const select_label = document.getElementById("select-value");

range_1_element.addEventListener("input", function() {
  const m_dothot = Number(range_1_element.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  range_1_value_label.innerHTML = `${m_dothot}`; // Edit the text of the global var range_1_value
  g.m_dothot = m_dothot; // Assign the number to the global object.
  //console.log(`g.m_dothot is ${g.m_dothot}`); // console.log is the easiest way to see a variable value in the javascript prompt.
});

range_2_element.addEventListener("input", function() {
  const m_dotcold = Number(range_2_element.value);
  range_2_value_label.innerHTML = `${m_dotcold}`;
  g.m_dotcold = m_dotcold;
  //console.log(`g.m_dotcold is ${g.m_dotcold}`);
});

range_3_element.addEventListener("input", function() {
  const HEX_length = Number(range_3_element.value);
  range_3_value_label.innerHTML = `${HEX_length}`;
  g.HEX_length = HEX_length;
  //console.log(`g.HEX_length is ${g.HEX_length}`);
});

select_element.addEventListener("change", function() {
  const hot_fluid = select_element.value;
  //select_label.innerHTML = `Selection value is: <span style="color:orange" >${hot_fluid}</span>.`
  g.hot_fluid = hot_fluid;
 //console.log(`g.hot_fluid is ${hot_fluid}`);
})



// I was trying to copy the method used in the manometers sim to make a button but I couldn't get it to work

//const selectFlow = document.getElementById("select-flow").children;
// for(let i = 0; i < selectFlow.length; i++){
//   selectFlow[i].addEventListener("click", function(){

//     for(let j = 0; j < selectFlow.length; j++){
//       selectFlow[j].classList.remove("selected");
//     }

//     selectFlow[i].classList.add("selected");
//     g.flow_type = selectFlow[i].value;
//   })
// }



// // // MATERIAL PROPERTIES FROM WOLFRAM SIM \\ \\ \\
// After looking through the wolfram sim, I don't understand why they have these large vectors for values. My interpretation of the wolfram math is that they use the fluid properties based on the initial temperature
// Water properties
let mu_water = [[300., 0.000855], [305, 0.0007689], [310, 0.000695], [315, 0.0006309], [320, 0.0005769], [325, 0.0005279], [330, 0.000489], [335, 0.000453], [340, 0.00041996], [345, 0.00038897], [350, 0.000365], [355, 0.000343], [360, 0.00032396], [365, 0.000306], [370, 0.000289], [373.15, 0.000279], [375, 0.000274], [380, 0.00026], [385, 0.000248], [390, 0.000237], [400, 0.000217], [410, 0.00019998], [420, 0.000185], [430, 0.000173], [440, 0.00016198], [450, 0.00015198], [460, 0.000143], [470, 0.000136], [480, 0.000129], [490, 0.000124], [500, 0.000118]];
let cp_water = [[300, 4.179], [305, 4.178], [310, 4.1785], [315, 4.179], [320, 4.180], [325, 4.182], [330, 4.184], [335, 4.186], [340, 4.188], [345, 4.191], [350, 4.195], [355, 4.199], [360, 4.203], [365, 4.209], [370, 4.214], [373.15, 4.217], [375, 4.220], [380, 4.226], [385, 4.232], [390, 4.239], [400, 4.256], [410, 4.278], [420, 4.302], [430, 4.331], [440, 4.36], [450, 4.4], [460, 4.44], [470, 4.48], [480, 4.53], [490, 4.59], [500, 4.66]];
let k_water = [[300., 0.6130], [305., 0.62], [310., 0.628], [315., 0.634], [320., 0.64], [325., 0.645], [330., 0.65], [335., 0.656], [340., 0.66], [345., 0.664], [350., 0.668], [355., 0.671], [360., 0.674], [365., 0.677], [370., 0.679], [373.15, 0.68], [375., 0.681], [380., 0.683], [385., 0.685], [390., 0.686], [400., 0.6880], [410., 0.6880], [420., 0.6880], [430., 0.685], [440., 0.682], [450., 0.678], [460., 0.673], [470., 0.667], [480., 0.66001], [490., 0.651], [500., 0.642]];

cp_water = correction(cp_water);

// Liquid sodium properties
let mu_na = [[366,6.983*Math.pow(10,-4)],[644,2.813*Math.pow(10,-4)],[977,1.779*Math.pow(10,-4)]];
let cp_na = [[366,1.36],[644,1.3],[977,1.26]];
let k_na = [[366,86.2],[644,72.3],[977,59.7]];

//cp_na = correction(cp_na);

// Air properties
let mu_air = 1014;
let cp_air = 230.1*Math.pow(10,-7);
let k_air = 33.8*Math.pow(10,-3);

// Used to increase cp values by 1000
function correction(array){
  for(let i = 0; i < array.length; i++){
    array[i][1] = array[i][1]*1000;
  }
  return(array);
}

function interpolate(x,x1,x2,y1,y2){
  let y = y1 + (x-x1)*(y2-y1)/(x2-x1);
  return(y);
}

function drawTemplines(){
  let T_labels = [300, 320, 340, 360, 380, 400]; // Temperature labels
  let counter = 0; // for placing temp labels
  let biglines = 1; // Conditional for where larger lines should be
  textSize(22);
  for(let i = 0; i < 23; i++){
    if(i == biglines){ // Bigger lines
      line(g.left,g.bottom-19*(i+1),g.left+10,g.bottom-19*(i+1)); // Temperature lines every 19 pixels, first T @ 295 & last T @ 405 (every 5K)
      line(g.right,g.bottom-19*(i+1),g.right-10,g.bottom-19*(i+1));
      text(T_labels[counter],g.left-40,g.bottom-19*(i+1)+5);
      counter++;
      biglines = biglines + 4;
    } else { // Smaller lines
      line(g.left, g.bottom-19*(i+1), g.left+4, g.bottom-19*(i+1));
      line(g.right,g.bottom-19*(i+1),g.right-4,g.bottom-19*(i+1));
    } 
  }
  textSize(25);
  let angle1 = radians(270);
  translate(45,370);
  rotate(angle1);
  text("Temperature (K)",0,0); // Temperature axis label
  pop();

  let temp = [g.bottom-19,19,5];
  return(temp);
  
}

function drawDistlines(){
  // Distance lines and labels
  // Defining last distance label // Based on wolfram sim
  push();
  let last_distlabel;
  if(g.HEX_length > 13 && g.HEX_length < 23){
    last_distlabel = Math.round((g.HEX_length-1)/5)*5;
  } else if(g.HEX_length >= 23){
    last_distlabel = Math.round(g.HEX_length/5)*5;
  } else if(g.HEX_length == 13){
    last_distlabel = 14;
  } else if(g.HEX_length == 12 || g.HEX_length == 11){
    last_distlabel = 12;
  } else if(g.HEX_length == 10){
    last_distlabel = 10;
  }

  let last_distance = g.HEX_length+1;

  // Defining distance labels and scale
  let dist_labels = [], scale;
  if(g.HEX_length > 13 && g.HEX_length < 23){
    for(let i=0; i < last_distlabel + 1; i+=5){
      dist_labels.push(i);
    }
    scale = 1; // Defining scale
  } else if(g.HEX_length >= 23){
    for(let i=0; i < last_distlabel + 1; i+=5){
      dist_labels.push(i);
    }
    scale = 1;
  } else {
    for(let i=0; i < last_distlabel+1; i+=2){
      dist_labels.push(i);
    }
    scale = .5;
  }

  // Number of lines
  let points = last_distance/scale + 1;
  let space = (g.right-g.left-30)/points; // -30 to make sure points don't span whole width of plot
  let counter0 = 0, counter1 = 0;
  textSize(22);

  // Drawing distance lines
  if(g.HEX_length > 13 && g.HEX_length < 23){
    for(let i = 0; i < points+1; i++){
      if(i == counter0){
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-10); // Shifted over by 30 to allow space for temperature labels
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+10);
        text(dist_labels[counter1],20+g.left+space*i,g.bottom+25);
        counter0 = counter0 + 5; // Increase by 5 to correspond to scale of lines 1 line/m with big marks every 5th line
        counter1 = counter1 + 1;
      } else{
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-4);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+4);
      }
    
    }
  } else if(g.HEX_length >= 23){
    space = space - 1; // Need to slightly shift spacing so that the 25 m label isn't displayed on the edge of the graph
    for(let i = 0; i < points+2; i++){ // iterating to points + 2 to allow an extra line to be drawn @ 25 m
      if(i == counter0){
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-10);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+10);
        text(dist_labels[counter1],20+g.left+space*i,g.bottom+25);
        counter0 = counter0 + 5; 
        counter1 = counter1 + 1;
      } else if(i<points+1){ // Extra conditional to make sure a line doesn't exceed the graph
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-4);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+4);
      }
    }
  } else if(g.HEX_length == 13){
    for(let i = 0; i < points+1; i++){ 
      if(i == counter0){
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-10);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+10);
        text(dist_labels[counter1],20+g.left+space*i,g.bottom+25);
        counter0 = counter0 + 4; // Increase by 4 to correspond to scale of lines 1 line/.5m with big marks every 4th line
        counter1 = counter1 + 1;
      } else {
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-4);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+4);
      }
    }
  } else if(g.HEX_length == 11 || g.HEX_length == 12){
    for(let i = 0; i < points+1; i++){
      if(i == counter0){
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-10);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+10);
        text(dist_labels[counter1],20+g.left+space*i,g.bottom+25);
        counter0 = counter0 + 4;
        counter1 = counter1 + 1;
      } else{ 
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-4);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+4);
      }
    }
  } else if(g.HEX_length == 10){
    for(let i = 0; i < points+1; i++){ 
      if(i == counter0){
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-10);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+10);
        text(dist_labels[counter1],20+g.left+space*i,g.bottom+25);
        counter0 = counter0 + 4;
        counter1 = counter1 + 1;
      } else{
        line(30+g.left+space*i,g.bottom,30+g.left+space*i,g.bottom-4);
        line(30+g.left+space*i,g.top,30+g.left+space*i,g.top+4);
      }
    }
  }
  textSize(25);
  text("Distance down heat exchanger (m)",250,g.bottom+75);

  let zerometers = 30+g.left;
  let temp = [zerometers,space,scale];

  pop();
  return(temp);
}

function getProperties(temp,cp_vec,mu_vec,k_vec){
  let cp, mu, k;
  for(let i=0; i<cp_vec.length; i++){
    if(temp == cp_vec[i][0]){
      cp = cp_vec[i][1];
    } else if(temp > cp_vec[i][0] && temp < cp_vec[i+1][0]){ // Required for liquid sodium as values are T = 366, 644, and 977K, need to interpolate for hot values at T = 400K
      cp = interpolate(temp,cp_vec[i][0],cp_vec[i+1][0],cp_vec[i][1],cp_vec[i+1][1]);
    }
  }

  for(let i=0; i<mu_vec.length; i++){
    if(temp == mu_vec[i][0]){
      mu = mu_vec[i][1];
    } else if(temp > mu_vec[i][0] && temp < mu_vec[i+1][0]){
      mu = interpolate(temp,mu_vec[i][0],mu_vec[i+1][0],mu_vec[i][1],mu_vec[i+1][1]);
    }
  }

  for(let i=0; i<k_vec.length; i++){
    if(temp == k_vec[i][0]){
      k = k_vec[i][1];
    } else if(temp > k_vec[i][0] && temp < k_vec[i+1][0]){
      k = interpolate(temp,k_vec[i][0],k_vec[i+1][0],k_vec[i][1],k_vec[i+1][1]);
    }
  }
  return([cp,mu,k]);
}

function nusselt(Re,cp,mu,k,factor){
  let nus;
  if(Re >= 10000){
    nus = 0.023*Math.pow(Re,0.8)*Math.pow((cp*mu)/k,factor);
  } else {
    nus = 4.36;
  }
  return(nus);
}

function parallelMATH(U,cp_hot,cp_cold,step){
  
  let y1, y2; // Temperature values
  let y1next, y2next, y1prime, y2prime; // Temperature values and derivative values
  let A, B, C; // Substitute variables
  let TEMPS = []; // Vector to hold temperatures
  let sub; // Vector to fill TEMPS (will make it easier to correspond with position)
 

  // Values to be used in Euler's method, rather than typing them out several times
  A = U*Math.PI*g.di;
  B = g.m_dothot*cp_hot;
  C = g.m_dotcold*cp_cold;

  // Initial values (y1 refers to hot fluid and y2 refers to cold fluid)
  y1 = g.T_hot1;
  y2 = g.T_cold1;

  // Adding initial values to the temperature arrays
  sub = [y1, y2];
  TEMPS.push(sub);

  for(let i = 0; i<g.HEX_length-step; i += step){
    // Calculating the change in temperature with respect to length down HEX
    y1prime = -(A/B)*y1 + (A/B)*y2;
    y2prime = (A/C)*y1 - (A/C)*y2;

    // Calculating next temperature value
    y1next = y1 + y1prime*step;
    y2next = y2 + y2prime*step;

    // Storing calculated temperature values
    sub = [y1next, y2next];
    TEMPS.push(sub);

    // Resetting temperature values for next calc
    y1 = y1next;
    y2 = y2next;
  }
  return(TEMPS);



}

function drawParallel(temps,value,T295,spacePerTemp,Tempscale,zeroPos,spacePerM,positions){
  let x, y; // Variables for positioning
  let deltay;

  // Correction for x-positions for changing graph scale at lengths < 14 m
  let factor = 1;
  if(g.HEX_length < 14){
    factor = 2;
  }

  push();
  if(value == 0){ // changing color based on hot and cold
    stroke(255,0,0);
  } else{
    stroke(0,0,255);
  }

  deltay = spacePerTemp/Tempscale;

  beginShape();
  for(let i=0; i<temps.length;i++){
    x = zeroPos + positions[i]*spacePerM*factor; // Defining x position based on zero position then increased based on current position times distance between each meter mark 
    y = T295 - (temps[i][value]-295)*deltay; // Defining y position based on difference from 295K
    vertex(x,y);
    
    // Temperature labels
    push();
    stroke(0);
    if(i == 0 && value == 0){
      textSize(20); text("T",x+5,y-5);
      textSize(15); text("h,1",x+17,y); // I'm unsure how to get subscripts in JS, kind of a weak solution
    } else if(i+1 == temps.length && value == 0){
      textSize(20); text("T",x+5,y-5);
      textSize(15); text("h,2",x+17,y);
    } else if(i == 0 && value == 1){
      textSize(20); text("T",x+15,y+10);
      textSize(15); text("c,1",x+27,y+15);
    } else if(i+1 == temps.length && value == 1){
      textSize(20); text("T",x+5,y+15);
      textSize(15); text("c,2",x+17,y+20);
    }
    pop();
  }
  endShape();

  pop();
}