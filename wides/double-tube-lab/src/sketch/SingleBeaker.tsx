import { g } from "./Sketch";
import Graphics, { valve } from "./Graphics";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { singleBeakerGraphics } from "./Graphics";
import {
  MAX_COLD_FLOWRATE,
  MAX_COLD_WATER_TEMP,
  MAX_HOT_FLOWRATE,
  MAX_HOT_WATER_TEMP,
  MIN_COLD_WATER_TEMP,
  MIN_HOT_WATER_TEMP,
  singleBeakerCalculations,
} from "./Functions";
import { AnimationFactory, HexFill, PathTrace, TubeFill } from "../types";
import { fillVertShaderSource, blueFragShaderSource, orngFragShaderSource } from "./shaders.ts";

const NOT_STARTED = -1;
const START_ON_RENDER = -2;
let startAniTime = NOT_STARTED; // Start time of fill animation (ms)
export const setAnimationTimeNextFrame = () => {
  if (startAniTime === NOT_STARTED) {
    startAniTime = START_ON_RENDER;
    return true;
  }
  return false;
};

export const setAnimationTimeToNotStarted = () => {
  startAniTime = NOT_STARTED;
};

interface SingleTubeGraphicsObjs {
  dt: any;
  dtb: any;
  dto: any;
  singleBeakers: any;
  pa: any;
  therm: any;
  v: any;
}

export function SingleBeakerSketch(p: P5CanvasInstance) {
  const graphicsObjs = {
    dt: undefined,
    dtb: undefined,
    dto: undefined,
    v: undefined,
    singleBeakers: undefined,
    pa: undefined,
    therm: undefined,
  };
  let pinchingColdTube = false;

  var fillingAnimation: AnimationFactory;
  var blueShader: any;
  var orngShader: any;

  // It is important to preload any images you are using; the function is async but was created before the async keywords 
  p.preload = () => {
    graphicsObjs.v = valve(p);
    graphicsObjs.dt = Graphics.doubleTubeGraphic(500, 400, p);
    graphicsObjs.dtb = Graphics.doubleTubeBlue(500, 400, 50, 450, 50, p);
    graphicsObjs.dto = Graphics.doubleTubeOrng(500, 400, 50, 450, 50, p);
    graphicsObjs.pa = Graphics.pumpAssembly(p);
    graphicsObjs.therm = p.loadImage("thermometer.png");
  }

  p.setup = () => {
    p.createCanvas(g.width, g.height, p.WEBGL);
    randSingleStartVals();
    graphicsObjs.singleBeakers = singleBeakerGraphics(p,graphicsObjs.v);


    // Cretae shaders
    blueShader = p.createShader(fillVertShaderSource,blueFragShaderSource);
    orngShader = p.createShader(fillVertShaderSource,orngFragShaderSource);

    // Create the parameterized filling animation
    fillingAnimation = new AnimationFactory;

    // Inlet tubes
    // Orange
    var vertices = [[625, 430],[625, 122],[475, 122]];
    fillingAnimation.createSegment(300, TubeFill, 700, vertices, g.orangeFluidColor);
    // Blue
    vertices = [[425, 455],[425, 375]];
    fillingAnimation.createSegment(300, TubeFill, 700, vertices, g.blueFluidColor);

    // Vertices for orange path
    vertices = [[600,125],[200,125],[200,190],[600,190],[600,254],[200,254],[200,323],[600,323],];
    // HexFill for orange filling
    fillingAnimation.createSegment(1000, HexFill, 3000, vertices, drawOrngFillLong, (p:P5CanvasInstance)=>{p.image(graphicsObjs.dto,25,25)});
    // Vertices for blue path
    vertices = [[550,375],[550,320],[250,320],[250,255],[550,255],[550,190],[250,190],[250,125],[550,125],[550,75]];
    // HexFill for blue filling
    fillingAnimation.createSegment(1000, HexFill, 3000, vertices, drawBlueFillLong, (p:P5CanvasInstance)=>{p.image(graphicsObjs.dtb,25,25)});

    // Outlet Tubes
    // Orange
    var vertices = [[477, 320],[590,320],[590,433],[590,485]];
    fillingAnimation.createSegment(4000, TubeFill, 1000, vertices, g.orangeFluidColor);
    // Blue
    // vertices = [[390, 485],[390, 375]];
    vertices = [[425, 72],[425, 45],[390,45],[390,75]];
    fillingAnimation.createSegment(4000, TubeFill, 400, vertices, g.blueFluidColor);
    vertices = [[390, 375],[390, 485]];
    fillingAnimation.createSegment(4600, TubeFill, 400, vertices, g.blueFluidColor);
  };

  p.draw = () => {
    p.background(250);
    p.translate(-g.width/2, -g.height/2)
    singleBeakerCalculations(p);
    if (startAniTime === START_ON_RENDER) startAniTime = p.millis();
 
    p.image(graphicsObjs.pa, 410, 435);
    p.image(graphicsObjs.pa, 610, 435);

    Graphics.fillBeaker(362, 1000, g.blueFluidColor, p);
    Graphics.fillBeaker(562, 1000, g.orangeFluidColor, p);

    singleBeakerFillAnimation(p, graphicsObjs);
    // displayValve(100,100,1,0,1,p,v)
    if (startAniTime !== NOT_STARTED) drawThermometer(p, graphicsObjs);
    if (pinchingColdTube) {
      pinchColdTubeGraphic(p);
    } else {
      p.push();
      p.noFill();
      // p.drawingContext.setLineDash([10, 10]);
      p.stroke("green");
      p.strokeWeight(2);
      p.rect(400, 370, 50, 60);
      p.pop();
    }
  };

  const fillPumps = (s: number = 1) => {
    p.push();
    p.noStroke();
    // Left orange
    p.fill(255, 50, 0, 120);
    p.rect(618,458 + 143 * (1-s),14,143 * s);
    // Right blue
    p.fill(0, 80, 255, 100);
    p.rect(418,458 + 143 * (1-s),14,143 * s);
    p.pop();
  }

  function singleBeakerFillAnimation(
    p: P5CanvasInstance,
    graphicsObjs: SingleTubeGraphicsObjs
  ) {
    let aniTime = p.millis() - startAniTime;
    if (startAniTime === NOT_STARTED) {
      // Button not pressed
      p.image(graphicsObjs.singleBeakers, 0, 0);
      p.image(graphicsObjs.dt, 25, 25);
    } else if (aniTime < 7000) {


      let pumpTime = aniTime < 300 ? aniTime / 300 : 1;
      fillPumps(pumpTime);

      p.image(graphicsObjs.singleBeakers, 0, 0);
      p.image(graphicsObjs.dt, 25, 25);
      fillingAnimation.draw(p,aniTime);
      p.push();
      p.scale(.75);
      p.image(graphicsObjs.v, 811,567);
      p.image(graphicsObjs.v, 544,567);
      p.pop();

    } else {
      // already full
      fillPumps();
      fillSingleInletTubes(p);
      fillSingleOutletTubes(p);
      p.image(graphicsObjs.singleBeakers, 0, 0);
      p.image(graphicsObjs.dt, 25, 25);
      p.image(graphicsObjs.dto, 25, 25);
      p.image(graphicsObjs.dtb, 25, 25);
    }
  }

  p.mousePressed = () => {
    if (
      p.mouseX >= 400 &&
      p.mouseX <= 450 &&
      p.mouseY >= 370 &&
      p.mouseY <= 430
    ) {
      pinchingColdTube = true;
      setTimeout(() => {
        g.mDotC = MAX_COLD_FLOWRATE / 8;
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
      const v = [
        [415,314, 20,34],
        [101,279,350,35],
        [115,248, 20,31],
        [101,213,350,35],
        [415,182, 20,31],
        [101,147,350,35],
        [115,116, 20,31],
        [101, 81,350,35],
        [415, 50, 20,31]
      ];
  
      p.push();
      // blueFillPath.drawPath(p,time); // debug
      p.translate(0,25);
      var numVert = blueFillPath.findPreviousVertex(time);
  
      var n = v.length;
  
      // Already full
      p.noStroke();
      // Fill everthing already covered
      p.fill(g.blueFluidColor);
      for (let i=0;i<numVert;i++) {
        p.beginShape(p.QUADS);
        let l=v[i][0];
        let r=l+v[i][2];
        let u=v[i][1];
        let b=u+v[i][3];
        p.vertex(l,u);
        p.vertex(r,u);
        p.vertex(r,b);
        p.vertex(l,b);
        p.endShape()
      }
  
  
      p.shader(blueShader);
      let d = Math.floor(numVert/2) % 2;
      let pos = blueFillPath.calculatePosition(time);
      pos = [pos[0]-50, pos[1]+50];
      blueShader.setUniform('waterPos',pos);
      blueShader.setUniform('time',time);
      blueShader.setUniform("flipx", Boolean(d));
  
      // Shader
      // current
      p.beginShape(p.QUADS);
      let l=v[numVert][0];
      let r=l+v[numVert][2];
      let u=v[numVert][1];
      let b=u+v[numVert][3];
      p.vertex(l,u);
      p.vertex(r,u);
      p.vertex(r,b);
      p.vertex(l,b);
      p.endShape();
      // next
      if (numVert+1 < n) {
        p.beginShape(p.QUADS);
        let l=v[numVert+1][0];
        let r=l+v[numVert+1][2];
        let u=v[numVert+1][1];
        let b=u+v[numVert+1][3];
        p.vertex(l,u);
        p.vertex(r,u);
        p.vertex(r,b);
        p.vertex(l,b);
        p.endShape();
      }
      p.pop();
    };
  
    const drawOrngFillLong = (p: P5CanvasInstance, time: number, orngFillPath: PathTrace) => {
      const v = [
        [200,113, 399,20],
        [200,179, 399,20],
        [200,245, 399,20],
        [200,311, 399,20],
      ];
  
      p.push();
      p.translate(-125,0);
      // orngFillPath.drawPath(p,time); // debug
      var numVert = orngFillPath.findPreviousVertex(time);
  
      var n = Math.floor(numVert / 2) + 1;
  
      // Already full
      p.noStroke();
      // Fill everthing already covered
      p.fill(g.orangeFluidColor);
      p.shader(orngShader);
  
      let pos = orngFillPath.calculatePosition(time);
      let d = Math.floor(numVert/2) % 2;
      pos = [pos[0]+75, pos[1]+75];
      orngShader.setUniform('waterPos',pos);
      orngShader.setUniform('time',time);
      orngShader.setUniform("flipx", Boolean(d));
  
      for (let i=0;i<n;i++) {
        p.beginShape(p.QUADS);
        let l=v[i][0];
        let r=l+v[i][2];
        let u=v[i][1];
        let b=u+v[i][3];
        p.vertex(l,u);
        p.vertex(r,u);
        p.vertex(r,b);
        p.vertex(l,b);
        p.endShape();
      }
  
      console.log(orngFillPath.normDist);
  
      const segmentTimes = orngFillPath.normDist;
      const aniTime = 3000;
      drawArc(p,199,156,false, normAniTime(time,aniTime * segmentTimes[1],aniTime * segmentTimes[2]));
      drawArc(p,600,222,true , normAniTime(time,aniTime * segmentTimes[3],aniTime * segmentTimes[4]));
      drawArc(p,199,288,false, normAniTime(time,aniTime * segmentTimes[5],aniTime * segmentTimes[6]));
  
      p.pop();
  
    }
}

function normAniTime(time: number, start: number, end: number) {
  if (time < start) return 0;
  if (time > end) return 1;
  return (time - start) / (end - start);
}

function drawArc(p:P5CanvasInstance,x:number, y:number,flip=false, ratio: number) {
  p.push();
  p.noFill();
  p.stroke(g.orangeFluidColor);
  p.strokeWeight(20);
  p.strokeCap(p.SQUARE);

  if (!flip)
    p.arc(x,y , 67,67 , p.HALF_PI + (1 - ratio) * p.PI, p.HALF_PI + p.PI);
  else
    p.arc(x,y , 67,67 ,-p.HALF_PI, -p.HALF_PI + ratio * p.PI);

  p.pop();
}

// Fill the lines going into the HEX
function fillSingleInletTubes(p: P5CanvasInstance, alpha = 200) {
  let color = g.orangeFluidColor.slice();
  color[3] = alpha;

  p.push();
  p.noStroke();
  p.fill(color);
  p.rect(620, 117, 10, 330);
  p.rect(470, 117, 150, 10);

  alpha *= 18/20;
  color = g.blueFluidColor.slice();
  color[3] = alpha;
  p.fill(color);
  p.rect(420, 370, 10, 60);
  // p.rect(418, 430, 13, 140);
  p.pop();
}

// Fill tubes coming out of HEX
function fillSingleOutletTubes(p: P5CanvasInstance, alpha = 200) {
  let color = g.orangeFluidColor.slice();
  color[3] = alpha;
  p.push();
  p.noStroke();
  p.fill(color);
  p.rect(585, 315, 10, 170);
  p.rect(475, 315, 110, 10);

  alpha *= 18/20;
  color = g.blueFluidColor.slice();
  color[3] = alpha;
  p.fill(color);
  p.rect(385, 375, 10, 110);
  p.rect(385,  40, 10,  35);
  p.rect(395,  40, 25,  10);
  p.rect(420,  40, 10,  35);
  p.pop();
}

// Apply overlay to canvas that makes it look like you are pinching the tube
function pinchColdTubeGraphic(p: P5CanvasInstance) {
  p.push();
  p.noStroke();
  // p.rect(419, 385, 12, 30);

  p.fill("white");
  p.triangle(419, 385, 419, 415, 423, 400);
  p.triangle(431, 385, 431, 415, 427, 400);

  p.stroke("black");
  p.strokeWeight(2);
  p.line(420, 385, 423, 400);
  p.line(420, 415, 423, 400);
  p.line(430, 385, 427, 400);
  p.line(430, 415, 427, 400);

  p.pop();
}

// randomize start values for single
export function randSingleStartVals() {
  g.Th_in =
    Math.random() * (MAX_HOT_WATER_TEMP - MIN_HOT_WATER_TEMP) +
    MIN_HOT_WATER_TEMP;
  g.Th_out =
    Math.random() * (MAX_COLD_WATER_TEMP - MIN_COLD_WATER_TEMP) +
    MIN_COLD_WATER_TEMP;
  g.mDotH = MAX_HOT_FLOWRATE;
  g.mDotC = MAX_COLD_FLOWRATE;
}

function drawThermometer(
  p: P5CanvasInstance,
  graphicsObjs: SingleTubeGraphicsObjs
) {
  // show measurement of the outlet stream
  console.log("drawing therm");
  p.push();
  p.translate(495, 455);
  p.rotate(-1.5);
  p.image(graphicsObjs.therm, 0, 0);
  p.pop();
}
