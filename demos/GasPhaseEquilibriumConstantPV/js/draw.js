import { calcAll } from './calcs.js';
const selectionElement = document.getElementById('selection');
const p5container = document.getElementById('p5-container');


let cam;

// This function is used to scale the canvas based on the size of the container
window.relativeSize = () => p5container.offsetWidth / 1280;
//window.relativeSizeY = () => p5container.offsetHeight;

function resize() {
  // Here I am reassigning the width and height of the canvas to a static value of 1280x720,
  // even though the actual canvas size is based on the size of the #p5-container element.
  // So you can effectively treat the canvas like it is 1280x720, even though it will scale to fit the screen.
  z.width;
  z.height;

  scale(relativeSize());

}

// Moved outside of the selection block - Do not call setup() more than once.
// So this should never be inside a conditional statement.
window.setup = function() {

  createCanvas(p5container.offsetWidth, p5container.offsetHeight, WEBGL).parent(p5container);
  frameRate(60);

  //cam = createCamera();
  //cam.camera(0,0,800,-350,0,0);
  //setCamera(cam);
}

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function() {
  // The "window" keyword is used to set global variables. So you can use
  // "selection" in any file, function, block, etc.
  window.selection = selectionElement.value;



  resize();

  background(255);
  calcAll();

  


  if (selection === "constant-pressure") {
    draw3D();
    draw2D();
  } else if (selection === "constant-volume") {
    //draw funcs go here

  }
}

// Look this function up in p5.js documentation. The width and height of
// the #p5-container element are set in the css file.
window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
}

//const label = selection === "velocity-distribution" ? "Velocity Distribution" : "Velocity vs Height";


let angleX = 0;
let angleY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let damping = 0.01; 

function draw3D() {
  
  
  if (mouseIsPressed) {
    let deltaX = mouseX - lastMouseX;
    let deltaY = mouseY - lastMouseY;

    angleY += deltaX * damping;  
    angleX -= deltaY * damping;  
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  push();
  translate(-350, 0);
  rotateX(angleX);
  rotateZ(angleY);
  
  push();
  fill(0, 0, 0, 200);
  cylinder(z.cylRadius-80, z.cylHeight+100, 64, 1);

  pop();

  fill(0,0,0,50);
  cylinder(z.cylRadius, z.cylHeight,64);
  

  
  

  push();
  fill(0, 0, 0, 200);
  cylinder(z.cylRadius-80, z.cylHeight+100, 64, 1);

  pop();
  


  
  

  push();
  stroke(0);
  strokeWeight(1);
  translate(0, -z.cylHeight / 2, 0);  
  cylinder(z.cylRadius, 0.5, 64, 1);
  pop();

  push();
  stroke(0);
  strokeWeight(1);
  translate(0, z.cylHeight / 2, 0); 
  cylinder(z.cylRadius, 0.5, 64, 1);
  pop();

  pop();
}
 
    

    
  
  
  


function draw2D(){

circle(1280/2, 720/2, 50);

//line(width/2, 100, width/2, 500);
//line(width/2, 500, 500, width/2 + 500);

}