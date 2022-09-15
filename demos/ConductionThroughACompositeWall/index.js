// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv : undefined,
  //temperature_value : 75,
  glass_thickness : 1.0,
  concrete_thickness : 1.0,
  steel_thickness : 1.0,
  right_wall_material : "fiberglass",

  // Variables I added
  temperature_left_wall : 75,

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

  console.log(g.right_wall_material);
  // Building the box
  fill(255); strokeWeight(1);
  rect(150,50,600,450);

  let Temp_final = 45; // Fixed temperature of the right wall

  // Vectors to hold x and y positions for the shapes
  let x = new Array(10);
  let y = new Array(10);

  // Left wall
  x[0] = 150; y[0] = 500;
  x[1] = 150; y[1] = 500 - 6*(g.temperature_left_wall - 40); // Sets height of left wall based on input

  // Glass & Concrete connection
  x[2] = x[1] + 6*10*g.glass_thickness; 
  x[3] = x[2]; y[3] = y[0];

  quad(x[0],y[0],x[1],y[1],x[2],y[2],x[3],y[3]);

  // Concrete & Stainless Steel connection
  x[4] = x[2] + 6*10*g.concrete_thickness; //y[4] = 100;
  x[5] = x[4]; y[5] = y[3];
  
  // Stainless Steel and Right Wall connection
  x[6] = x[5] + 6*10*g.steel_thickness; //y[6] = 100;
  x[7] = x[6]; y[7] = y[5];

  // Fixed temperature right wall
  x[8] = 750; y[8] = 500 - 6*(Temp_final-40);
  x[9] = 750; y[9] = 500;

  // Material Properties -- From the mathematica sim
  let k_glass = .96/100;
  let k_concrete = 1.4/100;
  let k_steel = 16.3/100;
  let k_other;
  
  // Defining final k_value
  switch(g.right_wall_material) {
    case 'fiberglass':
      k_other = .04/100;
      break;
    case 'brick' :
      k_other = 1.4/100;
      break;
    case 'lead' :
      k_other = 35/100;
      break;
  }

  // Lengths of each wall segment
  let x_glass = (x[2] - x[1])/60;
  let x_concrete = (x[4] - x[2])/60;
  let x_steel = (x[6] - x[4])/60;
  let x_other = (x[8] - x[6])/60;

  // Total Resistance
  let R_total = x_glass/k_glass + x_concrete/k_concrete + x_steel/k_steel + x_other/k_other;

  // Heat flux
  let qx = (g.temperature_left_wall - Temp_final)/R_total;
  //console.log(qx*(10^4));

  // Defining temperature values at each connection
  let Tglass_conc = g.temperature_left_wall - qx*x_glass/k_glass;
  let Tconc_steel = Tglass_conc - qx*x_concrete/k_concrete;
  let Tsteel_other = Tconc_steel - qx*x_steel/k_steel;
  let Tlast = Tconc_steel - qx*x_other/k_other;


  //500 - 6*(g.temperature_left_wall - 40);
  y[2] = 500 - 6*(Tglass_conc - 40);
  y[4] = 500 - 6*(Tconc_steel - 40);
  y[6] = 500 - 6*(Tsteel_other - 40);
  y[8] = 500 - 6*(Tlast - 40);

  // Wall sections and Labels
  // Glass wall
  push();
  fill(0,255,255); strokeWeight(0);
  quad(x[0],y[0],x[1],y[1],x[2],y[2],x[3],y[3]);
  pop();
  //Concrete wall
  push();
  fill(255,255,0); strokeWeight(0);
  quad(x[3],y[3],x[2],y[2],x[4],y[4],x[5],y[5]);
  pop();
  // Stainless Steel wall
  push();
  fill(255,0,255); strokeWeight(0);
  quad(x[5],y[5],x[4],y[4],x[6],y[6],x[7],y[7]);
  pop();
  // Other wall
  push();
  fill(0,255,0); strokeWeight(0);
  quad(x[7],y[7],x[6],y[6],x[8],y[8],x[9],y[9]);
  pop();

  // Line that goes over the tope of the wall
  fill(0); strokeWeight(2.5);
  line(x[1],y[1],x[2],y[2]); line(x[2],y[2],x[4],y[4]);
  line(x[4],y[4],x[6],y[6]); line(x[6],y[6],x[8],y[8]);

  // Variable declarations 
  let temps = [40,50,60,70,80,90,100,110]; // I tried converting these to strings but it didn't really work
  let dists = [0,2,4,6,8,10];

  strokeWeight(1);
  textSize(25);
  let start = 500, counter0 = 0, left = 150, right = 750;
  //TEMP LINES AND LABELS
  for(let i = 0; i < 38; i++){
    if(i == 0){
      fill(0);
      text(temps[counter0],left-30,start-12*i+10);
      counter0++;
    }else if(i%5==0){ // Checking remainder to draw longer lines
      line(left,start-12*i,left+10,start-12*i); // left long lines
      line(right,start-12*i,right-10,start-12*i); // right long lines
      // Using this to display if-else to display the numbers at roughly the same distance from left edge
      // Without this the 2 digit numbers were spaced kind of far
      if(counter0 <= 5){ 
        text(temps[counter0],left-33,start-12*i+10);
        counter0++;
      }else{
        text(temps[counter0],left-45,start-12*i+10);
        counter0++;
      }
    }else{
      line(left,start-12*i,left+5,start-12*i); // Left short lines
      line(right,start-12*i,right-5,start-12*i); // right short lines
    }
  }

  let counter1 = 0, start2 = 150, top = 50, bottom = 500;
  //DISTANCE LINES AND LABELS
  for(let i = 0; i < 21; i++){
    
    if(i == 0){
      text(dists[counter1],start2+30*i-5,bottom+30);
      counter1++;
    } else if(i%4==0){
      line(start2+30*i,top,start2+30*i,top+10);
      line(start2+30*i,bottom,start2+30*i,bottom-10);
      text(dists[counter1],start2+30*i-10,bottom+30);
      counter1++;
    } else{
        line(start2+30*i,top,start2+30*i,top+5);
        line(start2+30*i,bottom,start2+30*i,bottom-5);
    }
  }

  fill(0);
  text("Wall Thickness (cm)",350,575);
  push(); // Solution I found online to rotate text had this with push and pop around it but I can't tell why
  let angle1 = radians(270);
  translate(85,400);
  rotate(angle1);
  text("Temperature (\xB0C)",0,0);
  pop();
  
}

const temperature_slider = document.getElementById("temperature-slider");
const temperature_label = document.getElementById("temperature-value");
const glass_thickness_slider = document.getElementById("glass-thickness-slider");
const glass_thickness_label = document.getElementById("glass-thickness-value");
const concrete_thickness_slider = document.getElementById("concrete-thickness-slider");
const concrete_thickness_label = document.getElementById("concrete-thickness-value");
const steel_thickness_slider = document.getElementById("steel-thickness-slider");
const steel_thickness_label = document.getElementById("steel-thickness-value");
const select_right_wall = document.getElementById("select-right-wall");

temperature_slider.addEventListener("input", function() {
  const temperature_value = Number(temperature_slider.value); // temperature-slider value is a string by default, so we need to convert it to a number.
  temperature_label.innerHTML = `${temperature_value.toFixed(0)}`; // Edit the text of the global var g.temperature_left_wall
  g.temperature_left_wall = temperature_value; // Assign the number to the global object.
});

glass_thickness_slider.addEventListener("input", function() {
  const glass_thickness_value = Number(glass_thickness_slider.value);
  glass_thickness_label.innerHTML = `${glass_thickness_value.toFixed(1)}`;
  g.glass_thickness = glass_thickness_value;
});

concrete_thickness_slider.addEventListener("input", function() {
  const concrete_thickness_value = Number(concrete_thickness_slider.value);
  concrete_thickness_label.innerHTML = `${concrete_thickness_value.toFixed(1)}`;
  g.concrete_thickness = concrete_thickness_value;
});

steel_thickness_slider.addEventListener("input", function() {
  const steel_thickness_value = Number(steel_thickness_slider.value);
  steel_thickness_label.innerHTML = `${steel_thickness_value.toFixed(1)}`;
  g.steel_thickness = steel_thickness_value;
});

select_right_wall.addEventListener("change", function() {
  const select_value = select_right_wall.value;
  g.right_wall_material = select_value;
})