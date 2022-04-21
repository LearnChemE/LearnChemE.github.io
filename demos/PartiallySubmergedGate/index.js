// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv: undefined,
  rng_1_value: 0,
  rng_2_value: 0,
  rng_3_value: 0,
  select_value: "value-1",
  gate_angle: 45, // degrees
  water_level: 5, // meters or ft
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
  push();

  let step = frameCount % 600; // Modulus operator limits step variable to between 0 and 600.
  // An example of how to draw a graphic with the P5.js library.  This statement draws a line that moves across the canvas every 10 seconds (10000 ms). Recall that 16.67 ms * 600 = 10000 ms or 10 seconds.
  fill(12); // come back and make brown
  // stroke(100, 100, 200); // Color of the line across screen
  strokeWeight(3); // Width of the line
  // "line" syntax: line(x1, y2, x2, y2)


  rect(100, 100, 15, 400)     // (x-cord, y-cord, x-length, y length)
  rect(100, 500, 270, 15)     // bottom rectangle
  pop()



  /*
  * The code below determines the top-right coordinate of the trapezoid that comprises the water.
  * It also determines whether the max gate angle is too high to contain the water, and adjusts
  * the maximum value of the angle slider accordingly.
  */

  const gate_length = 400;
  const gate_angle_radians = g.gate_angle * 2 * PI / 360;
  const water_height_in_pixels = g.water_level * 25;
  const water_top_right_x_coordinate = 400 + water_height_in_pixels * Math.tan(gate_angle_radians); // setting the height equal with gate_angle_radians and tangent
  const max_gate_angle = Math.acos(water_height_in_pixels / gate_length); // uses the height of the water and gate length to deterine a max angle from a for loop that will be usd later

  let max_gate_angle_degrees = max_gate_angle * 360 / (2 * PI) - 1; // conversion to radians (not sure why its subtracting by -1)
  const angle_slider = document.getElementById("Angle_Slider");

  if (max_gate_angle_degrees < g.gate_angle) {
    max_gate_angle_degrees = Math.floor(max_gate_angle_degrees);     // changes max_gate_angle egrees to lowest gate angle
    angle_slider.setAttribute("value", `${max_gate_angle_degrees}`); // sets the gate anlge to max_gate_angle (connecting HTML)
    range_1_value_label.innerHTML = `${max_gate_angle_degrees}`;     // (connecting HTML)
    g.rng_1_value = max_gate_angle_degrees;                          // sets object max angle  value
    g.gate_angle = max_gate_angle_degrees;                           // sets abojected max angle_value
  }
  angle_slider.setAttribute("max", `${max_gate_angle_degrees}`);     // sets anglue slider to the max value in HTML(max between g.gate angle and )


  push();
  fill(0, 100, 200, 40);
  strokeWeight(0);



  // Trapazoid Vertices for Water 
  beginShape();
  vertex(100, 500);                                                     // bottom left
  vertex(400, 500);                                                     // bottom right
  vertex(water_top_right_x_coordinate, 500 - water_height_in_pixels);   // top left
  vertex(100, 500 - water_height_in_pixels);                            // top right
  endShape();
  pop();



  // Gate Rectangle That Rotates From The Fulcrum

  push();                                     //
  translate(390, 510);                        //
  rotate(gate_angle_radians - Math.PI);       // Gate Angle Settings
  rect(-12.5, 0, 30, gate_length);            //  
  pop();                                      //



  // Fulcrum Hinge

  push()                                      //
  fill(128)                                   //
  ellipse(390, 510, 50, 50);                  //
  pop();                                      //

}

// connects html to Javascript and assigns them to a const variable
const range_1_element = document.getElementById("Angle_Slider");
const range_1_value_label = document.getElementById("Angle_Slider_Value");
const range_2_element = document.getElementById("Water_Height");
const range_2_value_label = document.getElementById("Water_Height_Value");
const range_3_element = document.getElementById("Gate_Weight");
const range_3_value_label = document.getElementById("Gate_Weight_Value");
const select_element = document.getElementById("Unit_Selection");
const select_label = document.getElementById("Unit_Selection_Value");

range_1_element.addEventListener("input", function () {

  const rng_1_value = Number(range_1_element.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  range_1_value_label.innerHTML = `${Angle_Slider}`; // Edit the text of the global var range_1_value
  g.rng_1_value = rng_1_value; // Assign the number to the global object.
  const angle = Number(range_1_element.value); // convert the value of the slider from a string to a number
  g.gate_angle = angle;

});

range_2_element.addEventListener("input", function () {

  const rng_2_value = Number(range_2_element.value);
  range_2_value_label.innerHTML = `${Water_height}`;
  g.rng_2_value = rng_2_value;
  const height = Number(range_2_element.value)
  g.water_level = height;

});

range_3_element.addEventListener("input", function () {

  const rng_3_value = Number(range_3_element.value);
  range_3_value_label.innerHTML = `${Gate_Weight}`;
  g.rng_3_value = rng_3_value;

});

select_element.addEventListener("change", function () {

  const select_value = select_element.value;
  g.select_value = select_value;

})