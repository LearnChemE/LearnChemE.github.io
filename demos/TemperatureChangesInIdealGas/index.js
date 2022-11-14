// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv : undefined,
  HEAT : 5,
  heatStatus : 'heat-gas',
  Fr : 1, // Going to use this to modulate framerate until I get something that looks nice
  T1 : 300, //K
  R : 8.314, // J/mol/K
  cp : 0,
  cv : 0,
}

// See https://p5js.org/ to learn how to use this graphics library. setup() and draw() are used to draw on the canvas object of the page.  Seriously, spend some time learning p5.js because it will make drawing graphics a lot easier.  You can watch tutorial videos on the "Coding Train" youtube channel. They have a p5.js crash course under their playlists section.  It will make these functions make a lot more sense.
function setup() {
  // Create a p5.js canvas 800px wide and 600px high, and assign it to the global variable "cnv".
  g.cnv = createCanvas(800, 600);

  // Set the parent element to "graphics-wrapper"
  g.cnv.parent("graphics-wrapper");

  // The "main" element is unnecessary. Don't worry about this too much
  document.getElementsByTagName("main")[0].remove();
  fillProps();
}

// Whatever is included in draw() will be calculated at 60 fps.  It is basically a loop that calls itself every 16.67 ms. You can pause it at any time with the noLoop() function and start it again with the loop() function. Be sure to include every graphics statement in a push() / pop() statement, because it minimizes the chance that you accidentally apply styling or properties to another graphics object.
function draw() {
  background(250);
  frameRate(g.Fr);
  drawFrame();

  switch (g.heatStatus){
    case 'heat-gas':
      heatAdd();
      break;
    case 'cool-gas':
      let x = 0; 
      heatRemove(x);
      break;
  } 
}

function drawFrame(){
  push();
  textSize(25);
  text('Heat removal label',width/2-110,50)
  text('Constant pressure',width/2-275,100)
  text('Constant volume',width/2+75,100)
  strokeWeight(2);
  // line(400,0,400,height);
  // line(350,0,350,height);
  // line(50,0,50,height);
  // line(450,0,450,height);
  // line(750,0,750,height);
  
  // Boxes for W, deltaU, and deltaH
  rect(width/2-275,125,200,100);
  rect(width/2+75,125,200,100);

  // Reactor box thingy
  strokeWeight(4);
  line(width/2-275,250,width/2-275,500);
  line(width/2-75,250,width/2-75,500);
  line(width/2-275,500,width/2-75,500);
  line(width/2+275,250,width/2+275,500);
  line(width/2+75,250,width/2+75,500);
  line(width/2+275,500,width/2+75,500);
  stroke(75);
  line(width/2-275,500,width/2-300,525);
  line(width/2-75,500,width/2-50,525);

  line(width/2+275,500,width/2+300,525);
  line(width/2+75,500,width/2+50,525);

  if(g.heatStatus == 'heat-gas'){
    strokeWeight(1);
    stroke(0);
    fill(100);
    quad(width/2+70,520,width/2+280,520,width/2+290,530,width/2+60,530);
    quad(width/2-70,520,width/2-280,520,width/2-290,530,width/2-60,530);
  } else{
    stroke(75); strokeWeight(4);
    line(width/2-300,525,width/2-300,375);
    line(width/2-300,525,width/2-50,525);
    line(width/2-50,525,width/2-50,375);
    line(width/2+300,525,width/2+300,375);
    line(width/2+50,525,width/2+50,375);
    line(width/2+50,525,width/2+300,525);
  }


  
  pop();
}

function heatAdd(){
  let T2P, T2V, V1, V2;
}

function heatRemove(){

}

function fillProps(){
  g.cp = 7*g.R/2;
  g.cv = 4*g.R/2;
}

const heat = document.getElementById("HEAT"); // Gets value for heat into system
const heat_label = document.getElementById("HEAT-VALUE"); // Gets label for heat into the system
const addORremoveHeat = document.getElementById("heating-cooling").children; // Radio button for heating/cooling gas

// For 
heat.addEventListener("input", function() {
  const rng_1_value = Number(heat.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  heat_label.innerHTML = `${rng_1_value}`; // Edit the text of the global var range_1_value
  g.HEAT = rng_1_value; // Assign the number to the global object.
  //console.log(`g.HEAT is ${g.HEAT}`); // console.log is the easiest way to see a variable value in the javascript prompt.
});

// For switching radio button. Also changes label & value on the heat added/removed slider
for(let i = 0; i < addORremoveHeat.length; i++){
  addORremoveHeat[i].addEventListener("click",function(){
    for(let j = 0; j < addORremoveHeat.length; j++){
      addORremoveHeat[j].classList.remove("selected");
    };

    addORremoveHeat[i].classList.add("selected");
    g.heatStatus = addORremoveHeat[i].value;

    if(addORremoveHeat[i].value == "cool-gas"){
      heat.setAttribute("min","-5");
      heat.setAttribute("max","0");
      heat.value = "-2";
      g.HEAT = heat.value;
      heat_label.innerHTML = `${g.HEAT}`;
      const temp = document.getElementById("HEAT-label");
      temp.innerHTML = "Heat removed (kJ/mol)"
    } else {
      heat.setAttribute("min","0");
      heat.setAttribute("max","10");
      heat.value = "5";
      g.HEAT = heat.value;
      heat_label.innerHTML = `${g.HEAT}`;
      heat.setAttribute("input-label","Heat added (kJ/mol)")
      const temp = document.getElementById("HEAT-label");
      temp.innerHTML = "Heat added (kJ/mol)"
    }


  });
};



