import { P5CanvasInstance, P5WrapperClassName } from "@p5-wrapper/react";
import createGraphicsObjects, { BLUE_FLUID_COLOR, ORANGE_FLUID_COLOR, graphicsObjects } from "./graphics";
import {
  MIN_COLD_FLOWRATE,
  MAX_COLD_FLOWRATE,
  MIN_HOT_FLOWRATE,
  MAX_HOT_FLOWRATE,
  handleDoubleBeakerCalculations,
  randStartVals,
} from "./functions";
import { AnimationFactory, HexFill, PathTrace, TubeFill } from "../types";
import { blueFragShaderSource, orngFragShaderSource, fillVertShaderSource } from "./shaders";

// Globals defined here
export const g = {
  cnv: undefined,
  width: 800,
  height: 640,

  startTime: -1, // -1 means it's not running, will be replaced by millis() once pumps are started
  // blueTime: -1,

  orangeFluidColor: [255, 50, 0, 200],
  blueFluidColor: [0, 80, 255, 180],

  cpC: 4.186, // J / g / K
  cpH: 4.186, // J / g / K
  mDotC: 2, // g / s
  mDotH: 1, // g / s

  vols: [1000, 0, 1000, 0], // Beakers always follow order [Th_in, Th_out, Tc_in, Tc_out]
  hIsFlowing: false, // These are separate because the simulation used to have you start them separately
  cIsFlowing: false, // I'll leave it in like this in case that ever changes again

  Th_in: 40.0, // These values are overridden by the randStartVals function
  Tc_in: 10.0,
  Th_out: 40,
  Tc_out: 10,
  Th_out_observed: 25, // These values are the starting observed beaker values...
  Tc_out_observed: 25, // The beakers are integrated over the pump run time and display the average temperature over time

  T_measured: [-1, -1, -1, -1],

  dragging1: false, // These are for the valves, they become true on click in the buttons.js
  dragging2: false,
};

const showDebugCoordinates = (p: P5CanvasInstance) => {
  p.push();
  p.noStroke();
  p.fill("black");
  p.textAlign(p.LEFT, p.TOP);
  p.text("x: " + p.mouseX.toFixed(0) + " y: " + p.mouseY.toFixed(0), 1, 1);
  p.pop();
};

const NOT_DRAGGING = 0;
const DRAGGING_HOT = 1;
const DRAGGING_COLD = 2;
const PUMPS_NOT_STARTED = -1;
const START_PUMPS_NEXT_FRAME = -2;

// Sketch for P5 Wrapper
const ShellTubeSketch = (p: P5CanvasInstance) => {
  let graphics: graphicsObjects;
  let isDraggingValves: number = NOT_DRAGGING;
  var blueFillPath: PathTrace;
  var blueShader: any;
  var orngFillPath: PathTrace;
  var orngShader: any;
  var fillingAnimation: AnimationFactory;

  const drag = (isDraggingValves: number) => {
    if (isDraggingValves === NOT_DRAGGING) return;

    // Take the change in angle to find change in mDot. Ignore if angle resets
    if (isDraggingValves === DRAGGING_HOT) {
      var theta = p.atan2(p.mouseY - 440, p.mouseX - 75);
      var prevTheta = p.atan2(p.pmouseY - 440, p.pmouseX - 75);
      var dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
      var dmDot = p.map(
        dTheta,
        0,
        p.PI / 4,
        0,
        MAX_HOT_FLOWRATE - MIN_HOT_FLOWRATE
      );

      g.mDotH += dmDot;
      g.mDotH = p.constrain(g.mDotH, MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE);
    } else {
      theta = p.atan2(p.mouseY - 442, p.mouseX - 447);
      prevTheta = p.atan2(p.pmouseY - 442, p.pmouseX - 447);
      dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
      dmDot = p.map(
        dTheta,
        0,
        p.PI / 4,
        0,
        MAX_COLD_FLOWRATE - MIN_COLD_FLOWRATE
      );

      g.mDotC += dmDot;
      g.mDotC = p.constrain(g.mDotC, MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE);
    }
  };

  const drawValve = (
    x: number,
    y: number,
    flow: number,
    minFlow: number,
    maxFlow: number,
    p: P5CanvasInstance,
    valve: P5CanvasInstance
  ) => {
    p.push();
    var angle: number = p.map(
      flow,
      minFlow,
      maxFlow,
      (3 * Math.PI) / 4,
      Math.PI
    );
    p.imageMode(p.CENTER);
    p.translate(x, y);
    p.scale(0.8);
    p.rotate(angle);

    p.image(valve, 0, 0);
    p.pop();
  };

  const fillPumps = (s: number = 1) => {
    p.push();
    p.noStroke();
    // Left orange
    p.fill(255, 50, 0, 120);
    p.rect(68,458 + 143 * (1-s),14,143 * s);
    // Right blue
    p.fill(0, 80, 255, 100);
    p.rect(438,458 + 143 * (1-s),14,143 * s);
    p.pop();
  }

  const fillAnimation = () => {
    let start: number;
    p.image(graphics.emptyTubes, 0, 0);
    p.image(graphics.shellTube, 75, 75);

    if ((start = g.startTime) === PUMPS_NOT_STARTED) return; // Pumps not started

    let current = p.millis() - start;
    if (current < 5000) {

      let s = current < 300 ? current / 300 : 1;
      fillPumps(s);

      // HEX fill
      p.noStroke();
      fillingAnimation.draw(p, current);
      p.resetShader();

    } else {
      // Pumps have been running
      for (let i = 0; i < 4; i++) p.image(graphics.tubes[i], 0, 0); // fill all tubes
      p.image(graphics.orngShellTube, 75, 75);
      p.image(graphics.blueShellTube, 75, 75);
      fillPumps();
    }
  };

  const fillBeaker = (
    p: P5CanvasInstance,
    x: number,
    vol: number,
    color: Array<number>
  ) => {
    let width = 150;
    vol *= 0.16;
    p.push();
    p.fill(...color);
    p.noStroke();
    p.rect(x, 630 - vol, width, vol);
    p.pop();
  };

  p.setup = () => {
    p.createCanvas(g.width, g.height, p.WEBGL);
    blueShader = p.createShader(fillVertShaderSource,blueFragShaderSource);
    orngShader = p.createShader(fillVertShaderSource,orngFragShaderSource);

    graphics = createGraphicsObjects(p); // Load graphics objects
    randStartVals();

    // Create the parameterized filling animation
    fillingAnimation = new AnimationFactory;

    // Inlet tubes
    // Orange
    var vertices = [[75, 430],[75, 410],[30, 410],[30, 30],[105, 30],[105, 75]];
    fillingAnimation.createSegment(300, TubeFill, 700, vertices, ORANGE_FLUID_COLOR);
    // Blue
    vertices = [[445, 450],[445, 405],[490, 405],[490, 375]];
    fillingAnimation.createSegment(300, TubeFill, 700, vertices, BLUE_FLUID_COLOR);

    // Vertices for orange path
    vertices = [[105,20],[105,150],[585,150],[585,300],[105,300],[105,460],];
    // HexFill for orange filling
    fillingAnimation.createSegment(1000, HexFill, 3000, vertices, drawOrngFillLong, (p:P5CanvasInstance)=>{p.image(graphics.orngShellTube,75,75)});
    // Vertices for blue path
    vertices = [[490,370],[490,110],[435,110],[435,340],[380,340],[380,110],[325,110],[325,340],[270,340],[270,110],[215,110],[215,340],[160,340],[160,80]];
    // HexFill for blue filling
    fillingAnimation.createSegment(1000, HexFill, 3000, vertices, drawBlueFillLong, (p:P5CanvasInstance)=>{p.image(graphics.blueShellTube,75,75)});

    // Outlet tubes
    // Orange
    var vertices = [[105, 375],[105, 395],[265, 395],[265, 620]];
    fillingAnimation.createSegment(4000, TubeFill, 1000, vertices, ORANGE_FLUID_COLOR);
    // Blue
    vertices = [[160, 75],[160, 30],[625, 30],[625, 620]];
    fillingAnimation.createSegment(4000, TubeFill, 1000, vertices, BLUE_FLUID_COLOR);
  };

  p.draw = () => {
    // console.log(p)
    if (g.startTime === START_PUMPS_NEXT_FRAME) g.startTime = p.millis();
    p.background(250);
    p.translate(-g.width/2,-g.height/2);
    // showDebugCoordinates(p);

    p.resetShader();

    p.image(graphics.pumpAssembly,  60, 455);
    p.image(graphics.pumpAssembly, 430, 455);

    fillAnimation();
    drag(isDraggingValves);
    drawValve(
      75,
      440,
      g.mDotH,
      MIN_HOT_FLOWRATE,
      MAX_HOT_FLOWRATE,
      p,
      graphics.valve
    );
    drawValve(
      445,
      440,
      g.mDotC,
      MIN_COLD_FLOWRATE,
      MAX_COLD_FLOWRATE,
      p,
      graphics.valve
    );

    handleDoubleBeakerCalculations(p.deltaTime);
    // console.log(g.Th_in, g.Th_out, g.Tc_in, g.Tc_out);

    // prettier-ignore
    fillBeaker(p,  55, g.vols[0], g.orangeFluidColor);
    fillBeaker(p, 235, g.vols[1], g.orangeFluidColor);
    fillBeaker(p, 415, g.vols[2], g.blueFluidColor);
    fillBeaker(p, 595, g.vols[3], g.blueFluidColor);
    p.image(graphics.beakers, 0, 0);
  };

  // P5 mousePressed handler determines if dragging
  p.mousePressed = () => {
    let x: number = p.mouseX;
    let y: number = p.mouseY;
    if (y >= 360 && y <= 480) {
      if (x >= 35 && x <= 115) {
        isDraggingValves = DRAGGING_HOT;
      }
      if (x >= 405 && x <= 485) {
        isDraggingValves = DRAGGING_COLD;
      }
    }
  };

  // Stop dragging
  p.mouseReleased = () => {
    isDraggingValves = NOT_DRAGGING;
  };

  // Blue long so I can use shader
  const drawBlueFillLong = (p: P5CanvasInstance, time:number, blueFillPath: PathTrace) => {
    const v = [[390, 295],[390,  70],[385,  70],[385, 295],[280, 295],
               [280,  70],[275,  70],[275, 295],[170, 295],[170,  70],[165,  70],
               [165, 295],[ 60, 295],[ 60,   5],[ 60,   5],[110,   5],[110, 230],
               [115, 230],[115,   5],[220,   5],[220, 230],[225, 230],[225,   5],
               [330,   5],[330, 230],[335, 230],[335,   5],[440,   5],[440, 295],];

    var numVert = blueFillPath.findPreviousVertex(time);
    p.push();
    p.translate(75,75);

    var n = v.length;
    // Fill everthing already covered
    p.beginShape();
    p.fill(BLUE_FLUID_COLOR);
    for (let i=0;i<numVert+1;i++) {
      p.vertex(v[i][0],v[i][1]);
    }
    for (let i=n-numVert-1;i<n;i++) {
      p.vertex(v[i][0],v[i][1]);
    }
    p.endShape();


    p.shader(blueShader);
    // Because JS Modulo sucks
    let d = ((numVert-1) % 4 + 4) % 4;
    blueShader.setUniform('waterPos', blueFillPath.calculatePosition(time));
    blueShader.setUniform('time',time);
    blueShader.setUniform("falling", (d < 2));
    p.beginShape();
    
    p.vertex(v[numVert][0],v[numVert][1]);
    p.vertex(v[numVert+1][0],v[numVert+1][1]);
    p.vertex(v[numVert+2][0],v[numVert+2][1]);
    p.vertex(v[n-numVert-3][0],v[n-numVert-3][1]);
    p.vertex(v[n-numVert-2][0],v[n-numVert-2][1]);
    p.vertex(v[n-numVert-1][0],v[n-numVert-1][1]);
    
    p.endShape();
    p.pop();
  };

  const drawOrngFillLong = (p: P5CanvasInstance, time: number, orngFillPath: PathTrace) => {
    const v = [[5,5],[55,5],[55,145],[5,145],

              [55, 30],[55, 50],[445, 50],[445, 30],
              [55,105],[55,125],[445,125],[445,105],
              
              [445,20],[470,20],[470,280],[445,280],

              [55,175],[55,195],[445,195],[445,175],
              [55,250],[55,270],[445,270],[445,250],

              [5,155],[55,155],[55,295],[5,295]];
    
    // Draw Settings
    p.push();
    p.translate(75,75);
    p.stroke('black');
    p.strokeWeight(.5);

    // Shader uniforms
    p.fill(ORANGE_FLUID_COLOR);
    orngShader.setUniform('waterPos', orngFillPath.calculatePosition(time));
    orngShader.setUniform('time',time);

    // Draw filled quads
    var vNum = orngFillPath.findPreviousVertex(time);
    if (vNum > 1) vNum++;
    if (vNum > 4) vNum++;
    p.beginShape(p.QUADS);
    let n = vNum*4;
    for (let i=0;i<n;i++) {
      p.vertex(...v[i]);
    }
    p.endShape();

    if (vNum > 1) orngShader.setUniform("reverse",true);
    else orngShader.setUniform("reverse",false);

    // Draw animated quads
    p.shader(orngShader);
    p.beginShape(p.QUADS);
    n = Math.min(vNum*4 + 12, v.length);
    for (let i=vNum*4;i<n;i++) {
      p.vertex(...v[i]);
    }
    p.endShape();
    
    p.pop();
  }
};

export default ShellTubeSketch;
