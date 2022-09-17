// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv: undefined,
  Q: 8,
  rng_2_value: 0,
  Rtc: 0,
  uniformGen: "A",
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

  // k value labels
  //let k_a = .24, k_b = .13, k_c = .5;
  push();
  textSize(20);
  text("k_a = 0.24", 120, 85);
  text("W/[m K]", 130, 115);

  text("k_b = 0.13", 280, 85);
  text("W/[m K]", 290, 115);

  text("k_c = 0.50", 440, 85);
  text("W/[m K]", 450, 115);
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

range_1_element.addEventListener("input", function () {
  const rng_1_value = Number(range_1_element.value); // range_1_element.value is a string by default, so we need to convert it to a number.
  range_1_value_label.innerHTML = `${rng_1_value}`; // Edit the text of the global var range_1_value
  g.Q = rng_1_value; // Assign the number to the global object.
  console.log(`g.Q is ${g.Q}`); // console.log is the easiest way to see a variable value in the javascript prompt.
});

range_2_element.addEventListener("input", function () {
  const rng_2_value = Number(range_2_element.value);
  range_2_value_label.innerHTML = `${rng_2_value}`;
  g.rng_2_value = rng_2_value;
  console.log(`g.rng_2_value is ${g.rng_2_value}`);
});

range_3_element.addEventListener("input", function () {
  const rng_3_value = Number(range_3_element.value);
  range_3_value_label.innerHTML = `${rng_3_value}`;
  g.Rtc = rng_3_value;
  console.log(`g.Rtc is ${g.Rtc}`);
});

select_element.addEventListener("change", function () {
  const select_value = select_element.value;
  select_label.innerHTML = `Selection value is: <span style="color:orange" >${select_value}</span>.`
  g.uniformGen = select_value;
  console.log(`g.uniformGen is ${select_value}`);
})