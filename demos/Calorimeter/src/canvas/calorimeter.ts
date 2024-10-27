import { P5CanvasInstance } from "@p5-wrapper/react";

// It's annoying that there are no separate types for the graphics objects in this library, but thats a problem for another day...
interface graphics {
  calorimeter: any;
  thermometer: any;
  thermoTicks: any;
  stirrer: any;
}

// P5 Script to draw to canvas
export const CalorimeterSketch = (p: P5CanvasInstance) => {
  let graphics: graphics;
  let g: any;

  // p.preload = () => {
  //   graphics = {
  //     calorimeter: p.loadImage("src/Calorimeter.png"),
  //     thermometer: p.loadImage("Thermometer.png"),
  //     thermoTicks: p.loadImage("ThermoTicks.png"),
  //     stirrer: p.loadImage("Stirrer.png"),
  //   };
  // };

  p.setup = () => {
    p.createCanvas(300, 480);
    g = p.loadImage("Calorimeter.png");
  };
  p.draw = () => {
    p.background(255, 255, 255);
    p.image(g, 0, 0);
    // p.image(graphics.calorimeter, 0, 0);
  };
};

export {};
