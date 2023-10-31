
let waterHeight = 100;  // Start with full height as liquid
let solidHeight = 10;  // No solid at the beginning
let containerHeight = 180;  // Total height of the container
let isSolidComplete = false;  // Flag to check if solidification is complete
let solidifyingRate = 0.5


let sketch = (p) => {
  p.setup = () => {
    let divWidth = document.getElementById('figure').offsetWidth;
    let canvas = p.createCanvas(divWidth, 400);
    canvas.parent('figure');
  }

  const scaleFactor = 1.35;  // Define a scaling factor
  const startX = 170;
  p.draw = () => {
    p.fill(205);  // Light gray for tank
    p.ellipse(startX * scaleFactor, 100 * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Top ellipse
    p.fill(255);
    p.ellipse(startX * scaleFactor, 280 * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Bottom ellipse
    p.rect(95 * scaleFactor, 100 * scaleFactor, 150 * scaleFactor, 180 * scaleFactor);  // Bigger tank body

    if (isSolidComplete) {
      p.fill(135, 206, 205);  // Light blue for complete solid
      p.rect(95 * scaleFactor, 200 * scaleFactor, 150 * scaleFactor, 80 * scaleFactor);  // Solid body to fill entire tank
      p.ellipse(startX * scaleFactor, 200 * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Solid top ellipse
      p.ellipse(startX * scaleFactor, 280 * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Solid bottom ellipse
    } else {
      // Draw the solid
      p.fill(135, 206, 205);  // Light blue for solid
      p.ellipse(startX * scaleFactor, (280 - solidHeight) * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Solid top ellipse
      p.rect(95 * scaleFactor, (280 - solidHeight) * scaleFactor, 150 * scaleFactor, solidHeight * scaleFactor);  // Solid body

      // Draw the water
      p.fill(0, 0, 255);  // Dark blue for water
      p.ellipse(startX * scaleFactor, (280 - solidHeight - waterHeight) * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Water top ellipse
      p.rect(95 * scaleFactor, (280 - solidHeight - waterHeight) * scaleFactor, 150 * scaleFactor, waterHeight * scaleFactor);  // Water body        
      p.ellipse(startX * scaleFactor, 280 * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Bottom ellipse
      // Simulation logic
    }
  }

  // This function is called whenever the window is resized
  p.windowResized = () => {
    let divWidth = document.getElementById('figure').offsetWidth;

    p.resizeCanvas(divWidth, 400);
  }
}

new p5(sketch)

function updateFigure(wH, sH, isComplete) {
  waterHeight = Number(wH) * 100 / 10;
  solidHeight = Number(sH);
  debugger;
  console.log(280 - Math.abs(solidHeight - waterHeight));
  isSolidComplete = isComplete;
}

export default updateFigure;