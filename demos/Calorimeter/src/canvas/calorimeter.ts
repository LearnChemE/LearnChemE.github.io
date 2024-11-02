import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";

// It's annoying that there are no separate types for the graphics objects in this library, but thats a problem for another day...
interface graphics {
  calorimeter: any;
  thermometer: any;
  thermoTicks: any;
  stirrer: any;
}

const THERMOMETER_RED_COLOR = "#F22525";
const THERMOMETER_TICK_SPACING = 4;
const THERMOMETER_TOTAL_TICK_HEIGHT = 244;
const THERMOMETER_TOP_TICK_Y = 156;
const THERMOMETER_MAX_TEMP = 60; // C

// Extend the p5 wrapper interface to get my own props
interface CalorimeterSketchProps extends SketchProps {
  startTemp: number;
}

// P5 Script to draw to canvas
export const CalorimeterSketch = (p: P5CanvasInstance<CalorimeterSketchProps>) => {
  let graphics: graphics;
  let startTemp: number = 4;

  p.updateWithProps = (props: CalorimeterSketchProps) => {
    startTemp = props.startTemp;
  };

  const showDebugCoordinates = () => {
    let mx = p.mouseX, my = p.mouseY;
    p.push();
    p.textAlign(p.LEFT,p.TOP);
    p.text(`x: ${mx}\ny: ${my}`,2,2);
    p.pop();
  }

  // Fills thermometer to proper temp. 
  // Should be called after drawing thermometer and before ticks.
  const fillThermometer = (temp: number) => {
    let h = temp / THERMOMETER_MAX_TEMP * THERMOMETER_TOTAL_TICK_HEIGHT;
    let ty = THERMOMETER_TOP_TICK_Y + (THERMOMETER_TOTAL_TICK_HEIGHT - h) + 1;
    // h += 1; // Account for 0

    p.push();
    p.fill(THERMOMETER_RED_COLOR);
    p.noStroke();
    p.rect(70, ty, 12, h);
    p.pop();
  };

  p.preload = () => {
    graphics = {
      calorimeter: p.loadImage("Calorimeter.png"),
      thermometer: p.loadImage("Thermometer.png"),
      thermoTicks: p.loadImage("ThermoTicks.png"),
      stirrer: p.loadImage("Stirrer.png"),
    };
  };

  p.setup = () => {
    p.createCanvas(300, 480);
  };
  p.draw = () => {
    p.background(255, 255, 255);

    // debug
    showDebugCoordinates();

    p.image(graphics.calorimeter, 14, 210);
    p.image(graphics.thermometer, 64,138);
    fillThermometer(startTemp);
    p.image(graphics.thermoTicks, 70, THERMOMETER_TOP_TICK_Y);
  };
};

export {};
