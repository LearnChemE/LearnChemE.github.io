import { drawContainer, generateCaCO3Molecules,
  generateCaOMolecules,
  generateCO2Molecules, 
  drawDigitalPressureMeter,  drawYAxis, drawLegend   } from './drawContainer.js';

import { calculateEquilibrium } from "./calcs.js";

let caCO3Positions = []; 
let caOPositions = [];
let co2Molecules = [];

let lastT = null;



const containerElement = document.getElementById("p5-container");

export function drawAll() {
  background(255);
  let centerX = width / 2 - 40;
  let centerY = height / 2 + 15;
  let radius = 25;

  drawContainer(centerX, centerY, radius);
  drawLegend(centerX - 30 , centerY + radius + 10);
  // drawTubeFurnace(centerX, centerY, radius, window.state.T);

  //  Equilibrium Calculations 
const T     = +document.getElementById("tempSlider").value;
const caCO3 = +document.getElementById("caco3Slider").value;
const caO   = +document.getElementById("caoSlider").value;
const cO2   = +document.getElementById("co2Slider").value;

const eq = calculateEquilibrium({ T, caCO3, caO, cO2 });

window.state.caCO3_final = eq.nCaCO3_final;
window.state.caO_final   = eq.nCaO_final;
window.state.cO2_final   = eq.nCO2_final;
window.state.T = T;

  // Draw connector stem between container and pressure gauge
  const stemWidth = 6;
  const stemHeight = 18;

  push();
  fill(120);
  noStroke();
  rectMode(CENTER);
  rect(centerX, centerY - radius + 2.5 - stemHeight / 2, stemWidth - 2, stemHeight - 3);
  pop();

  // Draw digital pressure
  drawDigitalPressureMeter(centerX, centerY - radius - 10, eq.pressure);

  // ===  visuals ===
  const molToCount = 10;
  const targetCaCO3 = Math.round(eq.nCaCO3_final * molToCount);
  const targetCaO   = Math.round(eq.nCaO_final * molToCount);
  const targetCO2   = Math.round(eq.nCO2_final * molToCount);

// Only regenerate if count changed by more than 10% or if we don't have positions yet
  if (!caCO3Positions.length || Math.abs(caCO3Positions.length - targetCaCO3) > targetCaCO3 * 0.1) {
    caCO3Positions = generateCaCO3Molecules(targetCaCO3, radius, centerX, centerY);
  }

  if (!caOPositions.length || Math.abs(caOPositions.length - targetCaO) > targetCaO * 0.1) {
    caOPositions = generateCaOMolecules(targetCaO, radius, centerX, centerY);
  }
  if (co2Molecules.length !== targetCO2) {
    co2Molecules = generateCO2Molecules(targetCO2);
}



  drawCaCO3Molecules(caCO3Positions, [100, 149, 255, 300], 4);  
  drawCaOMolecules(caOPositions, [102, 204, 51, 204], 3); 

  drawCO2Molecules(co2Molecules, radius, centerX, centerY, 2);
  

  // Draw bar chart
  const axisX = centerX + radius + 60;
  const axisY = centerY + 20;


  drawYAxis(axisX, axisY, 40);
  
}

function drawCaCO3Molecules(positions, color = [0, 0, 255, 255], size = 6) {
  push();
  noStroke();
  fill(...color);
  for (let [px, py] of positions) {
    ellipse(px, py, size, size);
  }
  pop();
}

function drawCaOMolecules(positions, color = 'green', size = 5) {
  push();
  noStroke();
  fill(color);
  for (let [px, py] of positions) {
    ellipse(px, py, size, size);
  }
  pop();
}

function drawCO2Molecules(molecules, radius, centerX, centerY, size = 4, pressure = 0) {
  push();
  noStroke();

  const boundingRadius = radius * 0.93;
  const intensity = Math.min(1, pressure);
  const alpha = 200 + intensity * 55; 

  for (let mol of molecules) {
    mol.x += mol.vx;
    mol.y += mol.vy;

    const d = sqrt(mol.x ** 2 + mol.y ** 2);
    const maxNormDist = boundingRadius / radius;

    if (d > maxNormDist) {
      mol.vx *= -1;
      mol.vy *= -1;
      const scale = 0.95 * maxNormDist / d;
      mol.x *= scale;
      mol.y *= scale;
    }

    const px = centerX + mol.x * radius;
    const py = centerY + mol.y * radius;

   
    let c = color(255, 255, 0);
    c.setAlpha(alpha);          
    fill(c);
    ellipse(px, py, size, size);
  }
  

  pop();
}

function draw() {
  background(255);

  // 1. Define shared container dimensions
  const centerX = width / 3;
  const centerY = height / 1.8;
  const radius = 90;

  // 2. Draw the container using consistent center and radius
  drawContainer(centerX, centerY, radius);

  // 3. Generate molecules positioned along curved layers at the bottom
  const caCO3Molecules = generateCaCO3Molecules(radius, centerX, centerY);

  // 4. Draw CaCO₃ molecules inside the container
  for (const [x, y] of caCO3Molecules) {
    fill(100, 149, 255); // Blue for CaCO₃
    noStroke();
    ellipse(x, y, 10, 10);
  }

  // You can now also call drawLegend(), drawTubeFurnace(), etc. here
}
