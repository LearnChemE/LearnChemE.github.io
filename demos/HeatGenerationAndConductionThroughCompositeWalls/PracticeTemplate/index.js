// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv: undefined,
  Q: 6,
  rng_2_value: 0,
  Rtc: 0,
  uniformGen: "A",
  Tinf: 20,  
  h: 10,
  lengthA: 20/1000,
  lengthB: 13/1000,
  lengthC: 20/1000,
  kA: .24,
  kB: .13,
  kC: .5,
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


function draw() {
  background(250);

  // Variables used for positioning wall segments
  let L = 75, R = 575, T = 50, B = 550; // Left, Right, Top, Bottom
  let segmentSize = 177;
  
  // Showing wall with uniform heat generation
  let temp_vec = new Array(2);
  if (g.uniformGen == "A") {
    temp_vec[1] = 4;
    temp_vec[2] = 2;
  } else {
    temp_vec[1] = 2;
    temp_vec[2] = 4;
  }

  // Wall A
  push();
  fill(0, 181, 226);
  strokeWeight(temp_vec[1]);
  rect(L, T, segmentSize, B - T)
  pop();

  // Wall B
  push();
  fill(68, 214, 44);
  strokeWeight(temp_vec[2]); // Temporary -> Need to adjust this based on g.select_value //
  rect(L + segmentSize + 15, T, .65 * segmentSize, B - T);
  pop();

  // Wall C
  push();
  fill(255, 233, 0);
  strokeWeight(2);
  rect(R - segmentSize, T, segmentSize, B - T);
  pop();

  // Overall Wall Shape
  push();
  strokeWeight(2);
  noFill();
  rect(75, 50, 500, 500);
  pop();


  // Left edge and angled lines
  push();
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    line(75, 50 + 42 * i, 50, 80 + 42 * i);
  }
  line(75, 50, 75, 550);
  pop();

  // Length Labels
  push();
  textSize(20);
  text("20 mm", L + .75 * segmentSize / 2, 595);
  text("13 mm", L + 1.25 * segmentSize, 595);
  text("20 mm", R - .675 * segmentSize, 595);
  pop();

  // Length Dimension Marks and Wall Labels
  push();
  strokeWeight(1.5);
  textSize(60);
  // Wall A
  line(L, B + 10, L, B + 30);
  line(L + segmentSize, B + 10, L + segmentSize, B + 30);
  line(L, B + 20, L + segmentSize, B + 20);
  text("A", 150, 300);
  // Wall B
  line(L + segmentSize + 15, B + 10, L + segmentSize + 15, B + 30);
  line(R - segmentSize - 15, B + 10, R - segmentSize - 15, B + 30);
  line(L + segmentSize + 15, B + 20, R - segmentSize - 15, B + 20);
  text("B", 305, 300);
  // Wall C
  line(R - segmentSize, B + 10, R - segmentSize, B + 30);
  line(R, B + 10, R, B + 30);
  line(R - segmentSize, B + 20, R, B + 20);
  text("C", 460, 300);
  pop();

  // Convection and conduction labels
  //let k_a = .24, k_b = .13, k_c = .5;
  push();
  textSize(20);
  text("k_a = 0.24", 120, 85);
  text("W/[m K]", 130, 115);

  text("k_b = 0.13", 280, 85);
  text("W/[m K]", 290, 115);

  text("k_c = 0.50", 440, 85);
  text("W/[m K]", 450, 115);

  textSize(25);
  text("T_∞ = 20\xB0C", 625, 100);
  text("h = 10 W/[m^2 K]", 595, 150);

  fill(0);
  for(let i = 0; i <= 2; i++){
    rect(640+50*i, 200,1, 300);
    triangle(630+50*i,200,650+50*i,200,640+50*i,170);
  }
  pop();
  //let answer = math();
  //console.log(answer.summation[0]);

  ///////////////////////////// MATH /////////////////////////////
  let mathInfo;
  switch (g.uniformGen){
    case 'A' :
      //console.log('Is this working');
      mathInfo = AgenMath();
      points = Acurve(mathInfo.T_vec[5],mathInfo.T_vec[4]);
      //console.log(mathInfo.T_vec[4]);
      //console.log(points.y);
      
      break;
    case 'B' :
      //console.log('Yes, it is');
      break;
  }

  // Drawing temperature profile 
  // Need to add in the last bit of profile via vec.push(); and all L to positions
  // Use curve vertex to draw the non-linear section
  push();
  let positions = [R,R-segmentSize,R-segmentSize-15,L+segmentSize+15,L+segmentSize,L];
  fill(255,0,0);
  for(let i = 0; i < mathInfo.T_vec.length; i++){
    strokeWeight(0);
    circle(positions[i],B - 5*mathInfo.T_vec[i]+150,12); // 6p for every degree C with 32C at y=458
  }

  for(let i = 0; i < mathInfo.T_vec.length-2; i++){ // -2 to account for the curve in A
    strokeWeight(2); stroke(255,0,0);
    line(positions[i],B-5*mathInfo.T_vec[i]+150,positions[i+1],B-5*mathInfo.T_vec[i+1]+150);
  }
  pop();
  push();
  // beginShape(); stroke(255,0,0); strokeWeight(2); noFill();
  // curveVertex(L-1000,B-5*points.y[0]+175);
  // for(let i = 1; i < points.y.length; i++){
    
  //    curveVertex(L+17.7*(i),B-5*points.y[i]+150);
  //    console.log(L+17.7*(i),B-5*points.y[i]+150);
  //   //  if (i == 2) {
  //   //   curveVertex(L,B-5*points.y[0]+150);
  //   //   console.log(L,B-5*points.y[0]+150);
  //   //  }
  //   //  if (i == points.y.length-2) {
  //   //   curveVertex(L+segmentSize,B-5*points.y[10]);
  //   //   console.log(L+segmentSize,B-5*points.y[10]);
  //   //   console.log(points.y[10]);
  //   //  }
  //   curveVertex(L+segmentSize,B-5*points.y[10]+150);
     
  // }
  

  // endShape();
  noFill();
  stroke(255,0,0); strokeWeight(2)
  bezier(L,B-5*points.y[0]+150,L+17.7*4,B-5*points.y[3]+150,L+17.7*8,B-5*points.y[7]+150,L+segmentSize,B-5*points.y[10]+150);
  pop();

}

// Solves temperatures at points for when wall A is generating heat
function AgenMath(){
  let T_vec = new Array(5);
  let heatflux = g.lengthA*g.Q*1000;
  T_vec[0] = heatflux/g.h + g.Tinf;
  T_vec[1] = heatflux*g.lengthC/g.kC + T_vec[0];
  T_vec[2] = heatflux*g.Rtc + T_vec[1];
  T_vec[3] = heatflux*g.lengthB/g.kB + T_vec[2];
  T_vec[4] = heatflux*g.Rtc + T_vec[3];
  let C2 = T_vec[4] + g.Q*Math.pow(g.lengthA,2)*1000/(2*g.kA);
  T_vec.push(C2);
  return{T_vec};
}

// Generates series of points to plot A temperature profile when A is generating heat
function Acurve(constant2,Ts5){
  let x = [];
  let y = [];

  for(let i = 0; i < 10; i++){
    x.push(0.02*i);
    y.push(-1*g.Q*Math.pow(x[i],2)/(2*g.kA) + constant2);
  }
  x.push(.02); y.push(Ts5);
  
  return{y};
}





const range_1_element = document.getElementById("range-1");
const range_1_value_label = document.getElementById("range-1-value");
const range_2_element = document.getElementById("range-2");
const range_2_value_label = document.getElementById("range-2-value");
const range_3_element = document.getElementById("range-3");
const range_3_value_label = document.getElementById("range-3-value");
const select_element = document.getElementById("select-1");
const select_label = document.getElementById("select-value");

range_1_element.addEventListener("input", function () {
  const rng_1_value = Number(range_1_element.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  range_1_value_label.innerHTML = `${rng_1_value}`; // Edit the text of the global var range_1_value
  g.Q = rng_1_value; // Assign the number to the global object.
  //console.log(`g.Q is ${g.Q}`); // console.log is the easiest way to see a variable value in the javascript prompt.
});

range_2_element.addEventListener("input", function () {
  const rng_2_value = Number(range_2_element.value);
  range_2_value_label.innerHTML = `${rng_2_value}`;
  g.rng_2_value = rng_2_value;
  //console.log(`g.rng_2_value is ${g.rng_2_value}`);
});

range_3_element.addEventListener("input", function () {
  const rng_3_value = Number(range_3_element.value);
  range_3_value_label.innerHTML = `${rng_3_value}`;
  g.Rtc = rng_3_value;
  //console.log(`g.Rtc is ${g.Rtc}`);
});

select_element.addEventListener("change", function () {
  const select_value = select_element.value;
  select_label.innerHTML = `Selection value is: <span style="color:orange" >${select_value}</span>.`
  g.uniformGen = select_value;
  //console.log(`g.uniformGen is ${select_value}`);
})