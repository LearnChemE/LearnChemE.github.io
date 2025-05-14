export let sliderTemp, tempValue;
export let slidercaCO3, caCO3Value;
export let slidercaO, caOValue;
export let slidercO2, cO2Value;
import { drawContainer, generateCaCO3Molecules,
  generateCaOMolecules,
  generateCO2Molecules, drawTubeFurnace, 
  drawDigitalPressureMeter,  drawYAxis   } from './drawContainer.js';

let caCO3Positions = []; 
let caOPositions = [];
let co2Molecules = [];




export function setupSliders() {
  // Create temperature slider using p5
  sliderTemp = createSlider(300, 2000, 1000, 1); // min, max, default, step
  sliderTemp.position(440, 120);
  sliderTemp.style("width", "200px");

  // Create label text
  const tempLabel = createDiv("Temperature (K):");
  tempLabel.position(320, 100);
  tempLabel.style("font-weight", "bold");
  tempLabel.style("font-size", "14px");
  tempLabel.style("margin-top", "10px");  // Optional: spacing
  tempLabel.style("color", "#000");       // Optional: black text
  tempLabel.style("display", "inline-block");

  // Live value
  tempValue = createSpan("1000");
  tempValue.position(650, 110);  
  tempValue.style("font-weight", "bold");
  tempValue.style("font-size", "14px");
  tempValue.style("color", "#000");

  // --- CaCO₃ Slider ---
  slidercaCO3 = createSlider(0, 1, 1, 0.01);
  slidercaCO3.position(410, 170);
  slidercaCO3.style("width", "100px");

  const CaCO3Label = createDiv("CaCO₃ (mol):");
  CaCO3Label.position(320, 160);
  CaCO3Label.style("font-size", "14px");
  CaCO3Label.style("font-weight", "bold");

  caCO3Value = createSpan("1.0");
  caCO3Value.position(520, 160);
  caCO3Value.style("font-size", "14px");
  caCO3Value.style("font-weight", "bold");

  // --- CaO Slider ---
  slidercaO = createSlider(0, 1, 1, 0.01);
  slidercaO.position(660, 170);
  slidercaO.style("width", "100px");

  const CaOLabel = createDiv("CaO (mol):");
  CaOLabel.position(580, 160);
  CaOLabel.style("font-size", "14px");
  CaOLabel.style("font-weight", "bold");

  caOValue = createSpan("1.0");
  caOValue.position(770, 160);
  caOValue.style("font-size", "14px");
  caOValue.style("font-weight", "bold");

  // --- CO2 Slider ---
  slidercO2 = createSlider(0, 1, 1, 0.01);
  slidercO2.position(900, 170);
  slidercO2.style("width", "100px");

  const CO2Label = createDiv("CO2 (mol):");
  CO2Label.position(820, 160);
  CO2Label.style("font-size", "14px");
  CO2Label.style("font-weight", "bold");

  cO2Value = createSpan("1.0");
  cO2Value.position(1010, 160);
  cO2Value.style("font-size", "14px");
  cO2Value.style("font-weight", "bold");

}



function drawCaCO3Molecules(positions, color = 'blue', size = 6) {
  push();
  noStroke();
  fill(color);

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

function drawCO2Molecules(molecules, radius, centerX, centerY, size = 4) {
  push();
  noStroke();

  for (let mol of molecules) {
    mol.x += mol.vx;
    mol.y += mol.vy;

    // Reflect off boundary if outside unit circle
    const d = sqrt(mol.x ** 2 + mol.y ** 2);
    if (d > 1) {
      mol.x /= d;
      mol.y /= d;
      mol.vx *= -1;
      mol.vy *= -1;
    }

    const px = centerX + mol.x * radius;
    const py = centerY + mol.y * radius;

    let c = window.color('deepskyblue');
    c.setAlpha(150);
    fill(c);
    ellipse(px, py, size, size);
  }

  pop();
}



export function drawAll() {
  background(255);
  let centerX = width / 2 - 40;
  let centerY = height / 2 + 20;
  let radius = 25;

  drawContainer(centerX, centerY, radius);

    //  Draw temperature-dependent tube furnace 
  drawTubeFurnace(centerX, centerY, radius, window.state.T);


const pressure = map(window.state.cO2, 0, 1, 0, 1);

  // Draw connector stem between container and pressure gauge
  const stemWidth = 6;
  const stemHeight = 18;

  push();
  fill(120); // dark gray pipe
  noStroke();
  rectMode(CENTER);
  rect(centerX, centerY - radius + 2.5 - stemHeight / 2, stemWidth -2, stemHeight -3);
  pop();


// Digital readout (just below the gauge or wherever you want)
drawDigitalPressureMeter(centerX, centerY - radius - 10, pressure);



  const molToCount = 20;
  const targetCaCO3 = Math.round(window.state.caCO3 * molToCount);
  const targetCaO   = Math.round(window.state.caO * molToCount);
  const targetCO2 = Math.round(window.state.cO2 * molToCount);
  
  if (caCO3Positions.length !== targetCaCO3) {
    caCO3Positions = generateCaCO3Molecules(targetCaCO3, radius, centerX, centerY);
  }
  if (caOPositions.length !== targetCaO) {
    caOPositions = generateCaOMolecules(targetCaO, radius, centerX, centerY);
  }
  if (co2Molecules.length !== targetCO2) {
    co2Molecules = generateCO2Molecules(targetCO2);
  }
  
  drawCaCO3Molecules(caCO3Positions, 'blue', 5);
  drawCaOMolecules(caOPositions, 'green', 3);
  drawCO2Molecules(co2Molecules, radius, centerX, centerY, 2);
  
// Position to the right side of the container
const axisX = centerX + radius + 60;
const axisY = centerY + 20;
drawYAxis(axisX, axisY, 40);  // height of 80px




}


