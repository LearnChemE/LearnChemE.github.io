
let waterHeight = 100;  // Start with full height as liquid
let solidHeight = 0;  // No solid at the beginning
let containerHeight = 180;  // Total height of the container
let isSolidComplete = false;  // Flag to check if solidification is complete
let solidifyingRate = 0.5;
let temperature = 40;

let sketch = (p) => {
  p.setup = () => {
    let divWidth = document.getElementById('figure').offsetWidth;
    let canvas = p.createCanvas(divWidth, 400);
    canvas.parent('figure');
    p.noLoop();
  }

  const scaleFactor = 1.35;  // Define a scaling factor
  const startX = 170;
  p.draw = () => {

    p.fill(255); // Use the background color, e.g., white
    p.noStroke(); // No border for the rectangle
    p.rect(100, 20, p.width - 200, 70); // Adjust size and position as needed
    // Now draw the text over the cleared area
    p.fill(0); // Black color for the text
    p.textSize(32);
    p.text("T = " + String(temperature.toFixed(0)) + " °C", 100, 50);
    p.text(String((solidHeight / 10).toFixed(2)) + " Kg of water evaporated", 100, 80);

    // p.fill(0); // Black color
    // p.textSize(32);
    // p.text("T = " + String(temperature) + " °C", 100, 70);
    // p.text(String(solidHeight / 10) + " Kg of water evaporated", 100, 100);
    p.stroke(0);
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

      if (solidHeight > 0.1) {
        p.fill(135, 206, 205);
        p.ellipse(startX * scaleFactor, 280 * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Bottom ellipse
      }
      else {
        p.fill(0, 0, 255);  // Dark blue for water
        p.ellipse(startX * scaleFactor, 280 * scaleFactor, 150 * scaleFactor, 20 * scaleFactor);  // Bottom ellipse
      }

      // Simulation logic
    }
  }

  // This function is called whenever the window is resized
  p.windowResized = () => {
    let divWidth = document.getElementById('figure').offsetWidth;

    p.resizeCanvas(divWidth, 400);
  }
}

let p = new p5(sketch)

function updateFigure(wH, sH, T, isComplete) {
  if (wH && sH) {
    waterHeight = Number(wH) * 100 / 10;
    solidHeight = Number(sH) * 100 / 10;
    temperature = T;
    isSolidComplete = isComplete;
    p.redraw();
  }
}

export default updateFigure;