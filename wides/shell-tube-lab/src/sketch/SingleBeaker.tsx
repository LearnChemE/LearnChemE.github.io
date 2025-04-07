import { P5CanvasInstance, P5WrapperClassName } from "@p5-wrapper/react";
import createGraphicsObjects, {
  graphicsObjects,
  singleGraphicsObj,
  createSingleGraphicsObjects,
  ORANGE_FLUID_COLOR,
  BLUE_FLUID_COLOR,
} from "./graphics";
import {
  MIN_COLD_FLOWRATE,
  MAX_COLD_FLOWRATE,
  MIN_HOT_FLOWRATE,
  MAX_HOT_FLOWRATE,
  handleDoubleBeakerCalculations,
  randStartVals,
  handleSingleBeakerCalculations,
} from "./functions";
import { g } from "./sketch";
import { blueFragShaderSource, fillVertShaderSource, orngFragShaderSource } from "./shaders";
import { PathTrace } from "../types/pathTrace";
import { AnimationFactory, HexFill, TubeFill } from "../types";

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

const SingleBeakerSketch = (p: P5CanvasInstance) => {
  let graphics: graphicsObjects;
  let singleGraphics: singleGraphicsObj;
  let thermometer: any;
  let pinchingColdTube: boolean = false;
  let blueShader: any;
  let orngShader: any;
  let fillAnimationFactory: AnimationFactory;

  const drawValves = (p: P5CanvasInstance) => {
    p.push();
    p.translate(60, 430);
    p.scale(0.6);
    p.image(graphics.valve, 0, 0);
    p.pop();
    p.push();
    p.translate(590, 430);
    p.scale(0.6);
    p.image(graphics.valve, 0, 0);
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
    p.rect(598,458 + 143 * (1-s),14,143 * s);
    p.pop();
  }

  const fillAnimation = () => {
    let start: number;
    p.image(singleGraphics.emptyTubes, 0, 0);
    p.image(graphics.shellTube, 75, 75);

    if ((start = g.startTime) === PUMPS_NOT_STARTED) return; // Pumps not started

    let current = p.millis() - start;
    if (current < 5000) {
      // Fill animation
      let s = current < 300 ? current / 300 : 1;
      fillPumps(s);

      // HEX fill
      p.noStroke();
      fillAnimationFactory.draw(p, current);
      p.resetShader();

    } else {
      // Pumps have been running
      // Fill tubes
      p.image(singleGraphics.tubes[0], 0, 0);
      if (g.cIsFlowing) p.image(singleGraphics.tubes[1], 0, 0);
      p.image(singleGraphics.tubes[2], 0, 0);
      p.image(singleGraphics.tubes[3], 0, 0);
      fillPumps();
      // Fill HEX
      p.image(graphics.orngShellTube, 75, 75);
      p.image(graphics.blueShellTube, 75, 75);
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
    // Create canvas
    p.createCanvas(g.width, g.height, p.WEBGL);
    blueShader = p.createShader(fillVertShaderSource,blueFragShaderSource);
    orngShader = p.createShader(fillVertShaderSource,orngFragShaderSource);
    // Load graphics objects
    graphics = createGraphicsObjects(p);
    singleGraphics = createSingleGraphicsObjects(p);
    thermometer = p.loadImage("thermometer.png");
    // Randomize start Temps
    randStartVals();
    g.mDotH = MAX_HOT_FLOWRATE;
    g.mDotC = MAX_COLD_FLOWRATE;
    // Im used to OpenGL so I like degrees
    p.angleMode(p.DEGREES);

    // Initialize animation
    // Create the parameterized filling animation
    fillAnimationFactory = new AnimationFactory;

    // Inlet tubes
    // Orange
    var vertices = [[75, 430],[75, 410],[30, 410],[30, 30],[105, 30],[105, 75]];
    fillAnimationFactory.createSegment(300, TubeFill, 700, vertices, ORANGE_FLUID_COLOR);
    // Blue
    vertices = [[605,450],[605,395],[490,395],[490,375]];
    fillAnimationFactory.createSegment(300, TubeFill, 700, vertices, BLUE_FLUID_COLOR);

    // Vertices for orange path
    vertices = [[105,20],[105,150],[585,150],[585,300],[105,300],[105,460],];
    // HexFill for orange filling
    fillAnimationFactory.createSegment(1000, HexFill, 3000, vertices, drawOrngFillLong, (p:P5CanvasInstance)=>{p.image(graphics.orngShellTube,75,75)});
    // Vertices for blue path
    vertices = [[490,370],[490,110],[435,110],[435,340],[380,340],[380,110],[325,110],[325,340],[270,340],[270,110],[215,110],[215,340],[160,340],[160,80]];
    // HexFill for blue filling
    fillAnimationFactory.createSegment(1000, HexFill, 3000, vertices, drawBlueFillLong, (p:P5CanvasInstance)=>{p.image(graphics.blueShellTube,75,75)});

    // Outlet tubes
    // Orange
    var vertices = [[105, 378],[105,470]];
    fillAnimationFactory.createSegment(4000, TubeFill, 1000, vertices, ORANGE_FLUID_COLOR);
    // Blue
    vertices = [[160, 75],[160, 30],[655, 30],[655, 470]];
    fillAnimationFactory.createSegment(4000, TubeFill, 1000, vertices, BLUE_FLUID_COLOR);
  };

  p.draw = () => {
    if (g.startTime === START_PUMPS_NEXT_FRAME) g.startTime = p.millis();
    p.background(250);
    p.translate(-p.width/2,-p.height/2);
    // Coordinates in top left
    // showDebugCoordinates(p);
    // Calculations
    handleSingleBeakerCalculations(p.deltaTime);

    // Pumps
    p.image(graphics.pumpAssembly,  60, 455);
    p.image(graphics.pumpAssembly, 590, 455);

    // Fill ani
    fillAnimation();
    if (g.startTime !== PUMPS_NOT_STARTED) {
      p.push();
      p.translate(198, 370);
      p.rotate(80);
      p.image(thermometer, 0, 0);
      p.pop();
    }

    // Valves
    drawValves(p);
    // Beakers
    // prettier-ignore
    fillBeaker(p,  55, g.vols[0], g.orangeFluidColor);
    fillBeaker(p, 235, g.vols[1], g.orangeFluidColor);
    fillBeaker(p, 415, g.vols[3], g.blueFluidColor);
    fillBeaker(p, 585, g.vols[2], g.blueFluidColor);
    p.image(singleGraphics.beakers, 0, 0);

    if (pinchingColdTube) {
      p.push();
      p.translate(575, 389);
      p.rotate(90);
      p.image(singleGraphics.pinching, 0, 0);
      p.pop();
    } else {
      p.push();
      p.noFill();
      // p.drawingContext.setLineDash([10, 10]);
      p.stroke("green");
      p.strokeWeight(2);
      p.rect(
        PINCH_LEFT,
        PINCH_TOP,
        PINCH_RIGHT - PINCH_LEFT,
        PINCH_BOTTOM - PINCH_TOP
      );
      p.pop();
    }
    // Debug purposes
    // console.log(
    //   g.Th_in + " " + g.Th_out + " " + g.Tc_in + " " + g.Tc_out + " "
    // );
  };

  const PINCH_LEFT: number = 475;
  const PINCH_RIGHT: number = 620;
  const PINCH_TOP: number = 380;
  const PINCH_BOTTOM: number = 410;
  p.mousePressed = () => {
    if (
      p.mouseX >= PINCH_LEFT &&
      p.mouseX <= PINCH_RIGHT &&
      p.mouseY >= PINCH_TOP &&
      p.mouseY <= PINCH_BOTTOM
    ) {
      pinchingColdTube = true;
      setTimeout(() => {
        g.mDotC = MAX_COLD_FLOWRATE / 4;
      }, 1000);
    }
  };

  p.mouseReleased = () => {
    pinchingColdTube = false;
    setTimeout(() => {
      g.mDotC = MAX_COLD_FLOWRATE;
    }, 1000);
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

export default SingleBeakerSketch;
