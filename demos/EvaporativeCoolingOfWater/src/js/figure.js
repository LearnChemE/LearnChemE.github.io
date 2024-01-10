let waterHeight = 100;  // Start with full height as liquid
let solidHeight = 0;  // No solid at the beginning
let containerHeight = 180;  // Total height of the container
let isSolidComplete = false;  // Flag to check if solidification is complete
let solidifyingRate = 0.5;  // Assumed rate at which solidification happens
let temperature = 40;  // Starting temperature
import rotorImageSrc from '../assets/rotor.PNG';

let sketch = (p) => {
  let rotorImage;
  p.preload = () => {
    // Use the preload function to ensure the image is loaded before setup
    rotorImage = p.loadImage(rotorImageSrc);
  };

  p.setup = () => {
    let divWidth = document.getElementById('figure').offsetWidth;
    let canvas = p.createCanvas(divWidth, 400);
    canvas.parent('figure');
    p.noLoop();
  }

  const scaleFactor = 1.2;
  const startX = 170;
  const startY = 50;

  p.draw = () => {
    p.fill(255); // Use the background color, e.g., white
    p.noStroke(); // No border for the rectangle
    p.rect(100, 0, p.width - 200, 70); // Adjust size and position as needed
    // Now draw the text over the cleared area
    p.fill(0); // Black color for the text
    p.textSize(26);
    p.text("T = " + String(temperature.toFixed(0)) + "°C", 100, 30);
    p.text(String((solidHeight / 10).toFixed(2)) + " kg of water evaporated", 100, 60);


    p.stroke(0);
    p.fill(205);  // Light gray for tank
    p.ellipse(startX * scaleFactor, (100 * scaleFactor) + startY, 150 * scaleFactor, 20 * scaleFactor);  // Top ellipse
    p.fill(100);  // Light gray for tank
    p.rect(startX - 56, ((100 * scaleFactor) - 20) + startY, 150 * scaleFactor, 15 * scaleFactor)
    p.fill(255);
    p.ellipse(startX * scaleFactor, (280 * scaleFactor) + startY, 150 * scaleFactor, 20 * scaleFactor);  // Bottom ellipse
    p.rect(95 * scaleFactor, (100 * scaleFactor) + startY, 150 * scaleFactor, 180 * scaleFactor);  // Bigger tank body

    // Draw the water
    p.fill(0, 0, 255);  // Dark blue for liquid
    let waterTopY = 280 * scaleFactor - waterHeight * scaleFactor;
    p.ellipse(startX * scaleFactor, (waterTopY) + startY, 150 * scaleFactor, 20 * scaleFactor);  // Liquid top ellipse
    p.rect(95 * scaleFactor, (waterTopY) + startY, 150 * scaleFactor, waterHeight * scaleFactor);  // Liquid body

    // Draw the solid from the top down
    if (solidHeight > 0) {
      p.fill(135, 206, 235);  // Light blue for solid
      let solidTopY = waterTopY - solidHeight * scaleFactor;
      p.ellipse(startX * scaleFactor, (solidTopY) + startY, 150 * scaleFactor, 20 * scaleFactor);  // Solid top ellipse
      p.rect(95 * scaleFactor, (solidTopY) + startY, 150 * scaleFactor, solidHeight * scaleFactor);  // Solid body
    }

    // Check if solidification is complete
    if (waterHeight <= 4) {
      isSolidComplete = true;
      p.fill(135, 206, 235);
      p.ellipse(startX * scaleFactor, (280 * scaleFactor) + startY, 150 * scaleFactor, 20 * scaleFactor);  // Bottom ellipse
    }
    else {
      // Bottom cap of the container
      p.fill(0, 0, 255);
      p.ellipse(startX * scaleFactor, (280 * scaleFactor) + startY, 150 * scaleFactor, 20 * scaleFactor);  // Bottom ellipse
    }

    if (rotorImage) { // Check if the image is loaded           
      p.fill(87, 87, 87, 255)
      p.rect(409, 100, 14, 200)
      p.rect(210, 100, 200, 14)
      p.rect(200, 100, 14, 50)
      p.image(rotorImage, 375, 300, 100, 100);
    }

  }

  p.windowResized = () => {
    let divWidth = document.getElementById('figure').offsetWidth;

    p.resizeCanvas(divWidth, 400);
  }
}

let p = new p5(sketch);

function updateFigure(wH, sH, T, isComplete) {
  waterHeight = Number(wH) * 100 / 10;
  solidHeight = Number(sH) * 100 / 10;
  temperature = T;
  isSolidComplete = isComplete;
  p.redraw();
}

export default updateFigure;
