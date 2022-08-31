// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv : undefined,
  temperature_value : 1.0,
  glass_thickness : 1.0,
  concrete_thickness : 1.0,
  steel_thickness : 1.0,
  right_wall_material : "fiberglass",
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

  // Here's where I'm starting
  // Building the box
  fill(255); strokeWeight(1);
  rect(150,50,600,450);

  // These were the last thing I did but needed to be on top for the ticks to be able to be seen
  fill(0,255,255);
  strokeWeight(0);
  quad(150,500,150,150,250,300,250,500);

  fill(255,255,0);
  quad(250,300,250,500,350,500,350,400);

  fill(255,0,255);
  quad(350,400,350,500,600,500,600,425);

  fill(0,255,0);
  quad(600,500,600,425,750,450,750,500);

  fill(0); strokeWeight(2.5);
  line(150,150,250,300); line(250,300,350,400);
  line(350,400,600,425); line(600,425,750,450);

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
  //push(); Solution I found online to rotate text had this with push and pop around it but I can't tell why
  let angle1 = radians(270);
  translate(85,400);
  rotate(angle1);
  text("Temperature (\xB0C)",0,0);
  //pop();
  
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