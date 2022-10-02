// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.m_dothot" because it will minimize the risk of namespace issues.
window.g = {
  cnv : undefined,
  m_dothot : 0.3,
  m_dotcold : 0.3,
  HEX_length : 0,
  hot_fluid : "liquid water",
  flow_type : "parallel",
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
  pop();

  console.log(mu_water[2][1]);
  
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
  console.log(`g.m_dothot is ${g.m_dothot}`); // console.log is the easiest way to see a variable value in the javascript prompt.
});

range_2_element.addEventListener("input", function() {
  const m_dotcold = Number(range_2_element.value);
  range_2_value_label.innerHTML = `${m_dotcold}`;
  g.m_dotcold = m_dotcold;
  console.log(`g.m_dotcold is ${g.m_dotcold}`);
});

range_3_element.addEventListener("input", function() {
  const HEX_length = Number(range_3_element.value);
  range_3_value_label.innerHTML = `${HEX_length}`;
  g.HEX_length = HEX_length;
  console.log(`g.HEX_length is ${g.HEX_length}`);
});

select_element.addEventListener("change", function() {
  const hot_fluid = select_element.value;
  //select_label.innerHTML = `Selection value is: <span style="color:orange" >${hot_fluid}</span>.`
  g.hot_fluid = hot_fluid;
  console.log(`g.hot_fluid is ${hot_fluid}`);
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

// Water properties
let mu_water = [[300., 0.000855], [305, 0.0007689], [310, 0.000695], [315, 0.0006309], [320, 0.0005769], [325, 0.0005279], [330, 0.000489], [335, 0.000453], [340, 0.00041996], [345, 0.00038897], [350, 0.000365], [355, 0.000343], [360, 0.00032396], [365, 0.000306], [370, 0.000289], [373.15, 0.000279], [375, 0.000274], [380, 0.00026], [385, 0.000248], [390, 0.000237], [400, 0.000217], [410, 0.00019998], [420, 0.000185], [430, 0.000173], [440, 0.00016198], [450, 0.00015198], [460, 0.000143], [470, 0.000136], [480, 0.000129], [490, 0.000124], [500, 0.000118]];
let cp_water = [[300, 4.179], [305, 4.178], [310, 4.1785], [315, 4.179], [320, 4.180], [325, 4.182], [330, 4.184], [335, 4.186], [340, 4.188], [345, 4.191], [350, 4.195], [355, 4.199], [360, 4.203], [365, 4.209], [370, 4.214], [373.15, 4.217], [375, 4.220], [380, 4.226], [385, 4.232], [390, 4.239], [400, 4.256], [410, 4.278], [420, 4.302], [430, 4.331], [440, 4.36], [450, 4.4], [460, 4.44], [470, 4.48], [480, 4.53], [490, 4.59], [500, 4.66]];
let k_water = [[300., 0.6130], [305., 0.62], [310., 0.628], [315., 0.634], [320., 0.64], [325., 0.645], [330., 0.65], [335., 0.656], [340., 0.66], [345., 0.664], [350., 0.668], [355., 0.671], [360., 0.674], [365., 0.677], [370., 0.679], [373.15, 0.68], [375., 0.681], [380., 0.683], [385., 0.685], [390., 0.686], [400., 0.6880], [410., 0.6880], [420., 0.6880], [430., 0.685], [440., 0.682], [450., 0.678], [460., 0.673], [470., 0.667], [480., 0.66001], [490., 0.651], [500., 0.642]];

cp_water = correction(cp_water);

// Liquid sodium properties
let mu_na = [[366,6.983*Math.pow(10,-4)],[644,2.813*Math.pow(10,-4)],[977,1.779*Math.pow(10,-4)]];
let cp_na = [[366,1.36],[644,1.3],[977,1.26]];
let k_na = [[366,86.2],[644,72.3],[977,59.7]];

cp_na = correction(cp_na);

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



