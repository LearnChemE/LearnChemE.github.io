import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { SimProps, MaterialProperties } from "../types/globals";

// It's annoying that there are no separate types for the graphics objects in this library, but thats a problem for another day...
interface graphics {
  calorimeter: any;
  thermometer: any;
  thermoTicks: any;
  stirrer: any;
}

// Thermometer geometry 
const THERMOMETER_RED_COLOR = "#F22525";
const THERMOMETER_TICK_SPACING = 3;
const THERMOMETER_TOTAL_TICK_HEIGHT = 241;
const THERMOMETER_TOP_TICK_Y = 157;
const THERMOMETER_MAX_TEMP = 60; // C
// Canvas geometry
const CALORIMETER_FLOOR = 103;

// Materials and their properties
const Materials = new Map <string, MaterialProperties> ([
  ["Fe", {
    specificHeat: 0.451, // J/g/K
    color: "#A19D94",
    density: 7.874 // g / mL
  }],
  ["Au", {
    specificHeat: 0.129, // J/g/K
    color: "#FFD700",
    density: 19.3 // g / mL
  }],
  ["Cu", {
    specificHeat: 0.385, // J/g/K
    color: "#b87333",
    density: 8.96 // g / mL
  }],
  ["Hg",{
    specificHeat: 0.140, // J/g/K
    color: "#B7B8B9",
    density: 13.546 // g / mL
  }],
  ["Pb",{
    specificHeat: 0.129, // J/g/K
    color: "#646462",
    density: 11.34 // g / mL
  }]
]);

// Extend the p5 wrapper interface to get my own props
interface CalorimeterSketchProps extends SketchProps, SimProps {};

// P5 Script to draw to canvas
export const CalorimeterSketch = (p: P5CanvasInstance<CalorimeterSketchProps>) => {
  let graphics: graphics;
  let startTemp: number = 4;
  let material: MaterialProperties = {specificHeat: 0.451, color: "#A19D94", density: 7.874};

  p.updateWithProps = (props: CalorimeterSketchProps) => {
    startTemp = props.waterTemp;
    let mp;

    // The first one always comes undefined due to Reacts template render
    if ((mp = Materials.get(props.mat)) === undefined)
      return;

    material = mp;
  };

  // Debug coordinates display in top left corner
  const showDebugCoordinates = () => {
    let mx = p.mouseX, my = p.mouseY;
    p.push();
    p.textAlign(p.LEFT,p.TOP);
    p.text(`x: ${mx}\ny: ${my}`,2,2);
    p.pop();
  }

  // Fills thermometer to proper temp. 
  // Should be called after drawing thermometer and before ticks.
  const drawThermometer = (temp: number) => {
    // Draw thermometer body
    p.image(graphics.thermometer, 64,138);

    if (temp < 0 || temp > THERMOMETER_MAX_TEMP) {
      throw new Error(`Temp of ${temp} is outside of range 0-60`);
    }

    let h = temp * THERMOMETER_TICK_SPACING + 1;
    let ty = THERMOMETER_TOP_TICK_Y + (THERMOMETER_TOTAL_TICK_HEIGHT - h);

    p.push();
    p.fill(THERMOMETER_RED_COLOR);
    p.noStroke();
    p.rect(70, ty, 12, h);
    p.pop();

    // Draw tick marks last
    p.image(graphics.thermoTicks, 70, THERMOMETER_TOP_TICK_Y);
  };

  // Draw the block with its bottom at height z
  const drawBlock = (bottomZ: number) => {
    let col = material.color

    p.push();
    p.noStroke();
    p.fill(col)
    p.rect(1,1,1,1);
    p.pop();
  }

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

    // Draw Calorimeter
    p.image(graphics.calorimeter, 14, 210);
    // Draw thermometer
    drawThermometer(startTemp);
    // Draw block
    drawBlock(150);
  };
};

export {};
