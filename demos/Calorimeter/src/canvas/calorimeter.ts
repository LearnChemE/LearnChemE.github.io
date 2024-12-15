import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { SimProps, MaterialProperties } from "../types/globals";

// It's annoying that there are no separate types for the graphics objects in this library, but thats a problem for another day...
interface graphics {
  calorimeter: any;
  lid: any;
  thermometer: any;
  thermoTicks: any;
  stirrer: Array<any>[4];
}

// Thermometer geometry
const THERMOMETER_RED_COLOR = "#F22525";
const THERMOMETER_TICK_SPACING = 3;
const THERMOMETER_TOTAL_TICK_HEIGHT = 241;
const THERMOMETER_TOP_TICK_Y = 157;
const THERMOMETER_MAX_TEMP = 60; // C
// Canvas geometry
const CALORIMETER_FLOOR = 442;
const BLOCK_WIDTH = 72;
const BLOCK_LEFT_X = 114;
const BLOCK_BOTTOM_Y = 162;
// Water geometry
const WIDTH_WATER = 208;
const WATER_HEIGHT = 168;
const WATER_LEFT_X = 46;
const WATER_RIGHT_X = WATER_LEFT_X + WIDTH_WATER;
const WATER_TOP_Y = 275;
const WATER_LEVEL_CHANGE = 40;
// Animations
const FALL_TIME = 800; // ms
const WATER_HIT_TIME = 400; // ms
const STIR_FRAME_W = 54; // px
const STIR_FRAME_H = 288; // px
const STIR_FRAMETIME = 50; // ms
// Calculation Constants
const CC = 500; // J / K
const CW = 4184 + CC; // J / K
const H_COEFF = 100; // W / cm^2 / K
const AREA = 1; // cm^2

// Materials and their properties
const Materials = new Map<string, MaterialProperties>([
  [
    "Pt (Sample)",
    {
      specificHeat: 0.133, // J/g/K
      color: "#D5D4D2",
      density: 21.45, // g / mL
    },
  ],
  [
    "A", // Fe
    {
      specificHeat: 0.451, // J/g/K
      color: "#A19D94",
      density: 7.874, // g / mL
    },
  ],
  [
    "B", // Au
    {
      specificHeat: 0.129, // J/g/K
      color: "#FFD700",
      density: 19.3, // g / mL
    },
  ],
  [
    "C", // Cu
    {
      specificHeat: 0.385, // J/g/K
      color: "#b87333",
      density: 8.96, // g / mL
    },
  ],
  [
    "D", // Ag
    {
      specificHeat: 0.233, // J/g/K
      color: "#C4C4C4",
      density: 10.49, // g / mL
    },
  ],
  [
    "E", // Pb
    {
      specificHeat: 0.129, // J/g/K
      color: "#646462",
      density: 11.34, // g / mL
    },
  ],
]);

// Extend the p5 wrapper interface to get my own props
interface CalorimeterSketchProps extends SketchProps, SimProps {
  returnTemperature: (temp: number) => void;
}

// Inverse Z lookup, code by DeepSpace101
// https://stackoverflow.com/questions/8816729/javascript-equivalent-for-inverse-normal-function-eg-excels-normsinv-or-nor
function invNorm(p: number) {
  var a1 = -39.6968302866538,
    a2 = 220.946098424521,
    a3 = -275.928510446969;
  var a4 = 138.357751867269,
    a5 = -30.6647980661472,
    a6 = 2.50662827745924;
  var b1 = -54.4760987982241,
    b2 = 161.585836858041,
    b3 = -155.698979859887;
  var b4 = 66.8013118877197,
    b5 = -13.2806815528857,
    c1 = -7.78489400243029e-3;
  var c2 = -0.322396458041136,
    c3 = -2.40075827716184,
    c4 = -2.54973253934373;
  var c5 = 4.37466414146497,
    c6 = 2.93816398269878,
    d1 = 7.78469570904146e-3;
  var d2 = 0.32246712907004,
    d3 = 2.445134137143,
    d4 = 3.75440866190742;
  var p_low = 0.02425,
    p_high = 1 - p_low;
  var q, r;
  var retVal;

  if (p < 0 || p > 1) {
    alert("NormSInv: Argument out of range.");
    retVal = 0;
  } else if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    retVal =
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    retVal =
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    retVal =
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  return retVal;
}

// Returns num with added noise following a gauss distribution with given stdev
const AddGaussNoise = (mean: number, stdev: number, p?: number) => {
  // Get probability from uniform dist
  if (!p) p = Math.random();
  // Lookup z value
  var z = invNorm(p);
  // calculate x using mean and stdev and return
  return z * stdev + mean;
};

// P5 Script to draw to canvas
export const CalorimeterSketch = (
  p: P5CanvasInstance<CalorimeterSketchProps>
) => {
  let returnTemp: (temp: number) => void;
  // State
  let graphics: graphics;
  let startTemp: number = 4;
  let blockTemp: number = 30;
  let material: MaterialProperties = {
    specificHeat: 0.451,
    color: "#A19D94",
    density: 7.874,
  };
  let mass: number = 1000;
  let stirring: boolean = false;
  let started: boolean = false;
  let paused: boolean = true;
  // Time
  let aniTime: number = 0;
  // Gen Soln
  let k = 0;
  let deltaTempW = 0;
  let finalTemp = 0;

  // This gets called whenever props are updated by React.
  p.updateWithProps = (props: CalorimeterSketchProps) => {
    startTemp = props.waterTemp;
    blockTemp = props.blockTemp;
    mass = props.mass;
    stirring = props.stirring;
    paused = props.paused;
    if (started !== props.started) {
      started = props.started;
      aniTime = 0;
    }
    let mp;

    // Sanity check
    if ((mp = Materials.get(props.mat)) === undefined) {
      throw new Error(`Undefined material passed to canvas: ${props.mat}`);
    }

    material = mp;
    calcGenSolnCoeffs();
    returnTemp = props.returnTemperature;
  };

  // Set the curve parameters for temperature
  const calcGenSolnCoeffs = () => {
    let cm = mass * material.specificHeat;
    // Add stdev = 1% noise
    cm = AddGaussNoise(cm, 0.05 * cm);
    let cw = AddGaussNoise(CW, 0.05 * CW);
    console.log("updated coeffs");

    let ceq = (cm * cw) / (cm + cw);
    let h = stirring ? H_COEFF : H_COEFF / 10;
    k = (h * AREA) / ceq;
    deltaTempW = ((blockTemp - startTemp) * cm) / cw;
    finalTemp = (cm * blockTemp + cw * startTemp) / (cm + cw);
  };

  // Find water temp based on general soln
  const getWaterTemp = () => {
    // Rebase time based on when water hits
    let t = (aniTime - WATER_HIT_TIME) / 1000; // s
    if (t <= 0) return startTemp;
    // Use diff eq from water hit time
    let tmp = finalTemp - deltaTempW * Math.exp(-k * t);
    // Floating point error in deltaTempW can cause tmp to drop in first few milliseconds
    if (tmp < startTemp) return startTemp;
    return tmp;
  };

  // Debug coordinates display in top left corner
  const showDebugCoordinates = () => {
    let mx = p.mouseX,
      my = p.mouseY;
    p.push();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`x: ${mx}\ny: ${my}`, 2, 2);
    p.text(`t = ${aniTime}`, 250, 2);
    p.pop();
  };

  // Fills thermometer to proper temp.
  // Should be called after drawing thermometer and before ticks.
  const drawThermometer = (temp: number) => {
    // Draw thermometer body
    p.image(graphics.thermometer, 64, 138);

    // Sanity check
    if (temp < 0 || temp > THERMOMETER_MAX_TEMP) {
      throw new Error(`Temp of ${temp} is outside of range 0-60`);
    }

    let h = temp * THERMOMETER_TICK_SPACING + 1;
    let ty = THERMOMETER_TOP_TICK_Y + (THERMOMETER_TOTAL_TICK_HEIGHT - h);

    // Draw rect for thermometer fill
    p.push();
    p.fill(THERMOMETER_RED_COLOR);
    p.noStroke();
    p.rect(70, ty, 12, h);
    p.pop();

    // Draw tick marks last
    p.image(graphics.thermoTicks, 70, THERMOMETER_TOP_TICK_Y);
  };

  // Update animation time each frame, as well as static animation flags
  const updateTime = () => {
    if (started && !paused) aniTime += p.deltaTime;
  };

  // Get the height of the block based on mass and density
  const getBlockHeight = () => {
    return (1.2 * mass) / material.density;
  };

  // Find the position of the bottom of the block based on aniTime
  const getBlockPos = () => {
    // Avoid the lerp when possible
    if (aniTime === 0) return BLOCK_BOTTOM_Y;
    if (aniTime > FALL_TIME) return CALORIMETER_FLOOR;

    // Lerp with square smoothing function
    let s = aniTime / FALL_TIME;
    return p.lerp(BLOCK_BOTTOM_Y, CALORIMETER_FLOOR, s * s);
  };

  // Find the volume for the fill height based on the fraction of block submerged
  const getExtraWaterVol = (blockZ: number, blockHeight: number) => {
    // Before and after animation we know what these will be
    if (aniTime === 0) return 0;
    let maxFill = mass / material.density;
    if (aniTime > FALL_TIME) return maxFill;

    // Use the fraction of the block that's below original z value. Waves will cover up the inaccuracy
    let fracSubmerged = (blockZ - WATER_TOP_Y) / blockHeight;
    fracSubmerged = p.constrain(fracSubmerged, 0, 1);
    return fracSubmerged * maxFill;
  };

  // Draw the block with its bottom at height z
  const drawBlock = (bottomZ: number, height: number) => {
    let col = material.color;
    let ty = bottomZ - height;

    p.push();
    p.noStroke();
    p.fill(col);
    p.rect(BLOCK_LEFT_X, ty, BLOCK_WIDTH, height);
    p.pop();
  };

  // Based on x and animation time, calculates sinusoid y value between 0 and 1
  const sines = (x: number) => {
    x = x / WIDTH_WATER;
    let s1 = Math.sin(2 * Math.PI * x + aniTime / 500);
    let s2 = Math.sin(3 * Math.PI * x - aniTime / 300);
    return 0.7 * s1 + 0.3 * s2;
  };

  // Fill the calorimeter with the appropriate amount of water based on the volume of the block submerged
  const fillCalorimeter = (extraVol: number, waves?: boolean) => {
    // Displacement from block
    let dh = (WATER_LEVEL_CHANGE * extraVol) / 127;
    // Fill for steady meniscus
    let avgFillY = WATER_TOP_Y - dh;

    if (!waves) {
      // Height of water rectangle
      let h = WATER_HEIGHT + dh;

      p.push();
      p.fill("#226CA880");
      p.noStroke();
      p.rect(WATER_LEFT_X, avgFillY, WIDTH_WATER, h);
      p.pop();
    } else {
      // Based on displacement height times an exponential decay
      let rippleHeight =
        0.5 * dh * Math.exp(-aniTime / 7500) + Number(stirring);

      p.push();
      p.fill("#226CA880");
      p.noStroke();
      p.beginShape(p.TESS);
      p.vertex(WATER_RIGHT_X, CALORIMETER_FLOOR);
      p.vertex(WATER_LEFT_X, CALORIMETER_FLOOR);
      // Use sines() to generate animated waves
      let num_pts = 15; // You honestly don't need many to make this trick look good, unless there's 3d vertex lighting
      let dx = WIDTH_WATER / (num_pts - 1);
      for (let i = 0; i < num_pts; i++) {
        let x = WATER_LEFT_X + i * dx;
        p.vertex(x, avgFillY + rippleHeight * sines(x));
      }
      p.endShape();
      p.pop();
    }
  };

  const drawLid = () => {
    // step function for when block hits
    var s = aniTime - WATER_HIT_TIME;
    if (s >= 0 && s < 1000) {
      // Smooth over small time
      s = p.lerp(0, 1, Math.exp(s / 1000) - 1);
      // Constrain s value
      s = p.constrain(s, 0, 1);
    }

    p.push();
    p.tint(255, s * 255);
    p.image(graphics.lid, 46, 210);
    p.pop();
  };

  // Draw stirrer with animation
  const drawStirrer = () => {
    // Select frame
    let frame =
      stirring && !paused ? Math.floor((p.millis() / STIR_FRAMETIME) % 4) : 0;
    // Draw image
    p.image(graphics.stirrer[frame], 195, 138);
  };

  const loadStirrerAnimation: Array<any>[4] = (im: P5CanvasInstance) => {
    var frames: Array<P5CanvasInstance>[4] = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      // Figure out frame position on texture
      let x = i * STIR_FRAME_W;
      // Get each frame from texture
      frames[i] = im.get(x, 0, STIR_FRAME_W, STIR_FRAME_H);
    }
    return frames;
  };

  let im: P5CanvasInstance;
  // P5 Calls this first while other things are loading
  p.preload = () => {
    // Load texture containing frames
    im = p.loadImage("StirAniFull.png");
    if (!im) throw new Error("Error: couldn't load StirAniFull.png");
    // p.f = p.loadFont("./Inconsolata-VariableFont_wdth,wght.ttf");
    // Set the graphics objects
    graphics = {
      calorimeter: p.loadImage("Calorimeter.png"),
      lid: p.loadImage("Lid.png"),
      thermometer: p.loadImage("Thermometer.png"),
      thermoTicks: p.loadImage("ThermoTicks.png"),
      stirrer: [0, 0, 0, 0],
    };
  };

  // Setup the P5 canvas
  p.setup = () => {
    graphics.stirrer = loadStirrerAnimation(im);
    p.createCanvas(300, 480, p.WEBGL);
    // p.textFont(p.f);
    p.translate(-150, -240);
  };

  // P5 calls this each frameframe
  p.draw = () => {
    // Clear the framebuffer
    p.background(255, 255, 255);
    // P5 loads identity matrix each frame on its own
    p.translate(-150, -240); // WEBGL coordinates start in middle
    updateTime();
    // showDebugCoordinates(); // for debug, need to load and enable font for this

    drawStirrer();

    // Calc temperature of water
    let temp = getWaterTemp();
    returnTemp(temp);
    // Draw thermometer
    drawThermometer(temp);

    // Draw block
    let blockPos = getBlockPos();
    let blockHeight = getBlockHeight();
    drawBlock(blockPos, blockHeight);

    // Draw Water
    fillCalorimeter(getExtraWaterVol(blockPos, blockHeight), true);
    if (started) drawLid();

    // Draw Calorimeter last
    p.image(graphics.calorimeter, 14, 210);
  };
};

export {};
