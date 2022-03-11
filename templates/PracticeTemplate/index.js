// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. But only variables declared at the top here will be accessible. It's best practice to store your global variables within an object E.G. g.rng_1_value because it will minimize the risk of namespace issues.
let g = {
  cnv : undefined,
  rng_1_value : 0,
  rng_2_value : 0,
  rng_3_value : 0,
}

// See https://p5js.org/ to learn how to use this graphics library.
function setup() {
  // Create a p5.js canvas 800px wide and 800px high, and assign it to the global variable "cnv".
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

  // An example of how to draw a graphic with the P5.js library.  This statement draws a line that moves across the canvas every 10 seconds (600 ms). Recall that 16.67 ms * 600 = 10000 ms or 10 seconds.

  stroke(255, 100, 100); // Color of the line
  strokeWeight(3); // Width of the line
  line((step / 600) * width, height / 2 - 150, (step / 600) * width, height / 2 + 150); // "line" syntax: line(x1, y2, x2, y2)

  pop();
}

const range_1_element = document.getElementById("range-1");
const range_1_value_label = document.getElementById("range-1-value");
const range_2_element = document.getElementById("range-2");
const range_2_value_label = document.getElementById("range-2-value");
const range_3_element = document.getElementById("range-3");
const range_3_value_label = document.getElementById("range-3-value");

range_1_element.addEventListener("input", function() {
  const rng_1_value = Number(range_1_element.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  range_1_value_label.innerHTML = `${rng_1_value}`; // Edit the text of the global var range_1_value
  g.rng_1_value = rng_1_value; // Assign the number to the global object.
  console.log(`g.rng_1_value is ${g.rng_1_value}`); // console.log is the easiest way to see a variable value in the javascript prompt.
});

range_2_element.addEventListener("input", function() {
  const rng_2_value = Number(range_2_element.value);
  range_2_value_label.innerHTML = `${rng_2_value}`;
  g.rng_2_value = rng_2_value;
  console.log(`g.rng_2_value is ${g.rng_2_value}`);
});

range_3_element.addEventListener("input", function() {
  const rng_3_value = Number(range_3_element.value);
  range_3_value_label.innerHTML = `${rng_3_value}`;
  g.rng_3_value = rng_3_value;
  console.log(`g.rng_3_value is ${g.rng_3_value}`);
});