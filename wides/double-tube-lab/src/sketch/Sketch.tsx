import Graphics from "./Graphics";
import { P5CanvasInstance } from "@p5-wrapper/react";
// import { Tooltip } from "bootstrap";
import { calcHeatTransferRate, randStartVals } from "./Functions.tsx";
import drawAll, { V1CX, V1CY, V2CX, V2CY } from "./Draw.tsx";
import { AnimationFactory, HexFill, PathTrace, TubeFill } from "../types";
import { fillVertShaderSource, blueFragShaderSource, orngFragShaderSource } from "./shaders.ts";

// Globals defined here
export const g = {
  cnv: undefined,
  width: 800,
  height: 640,

  orngTime: -1, // -1 means it's not running, will be replaced by millis() once pumps are started
  blueTime: -1,

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

export function togglePumps(pumpsAreRunning: boolean) {
  if (pumpsAreRunning) {
    g.hIsFlowing = true;
    g.cIsFlowing = true;
    if (g.orngTime === -1) {
      g.orngTime = p5_instance.millis();
      g.blueTime = p5_instance.millis();
    }
  } else {
    g.hIsFlowing = false;
    g.cIsFlowing = false;
  }
}

export var p5_instance: P5CanvasInstance;

export default function sketch(p: P5CanvasInstance) {
  p5_instance = p;
  // let canvas: P5CanvasInstance;

  let dt: P5CanvasInstance;
  let dtb: P5CanvasInstance;
  let dto: P5CanvasInstance;
  let bt: P5CanvasInstance;
  let v: P5CanvasInstance;
  let pa: P5CanvasInstance;

  var tubes: P5CanvasInstance;

  var fillingAnimation: AnimationFactory;
  var blueShader: any;
  var orngShader: any;
   
  p.preload = () => {
    tubes = p.loadImage("./Tubes.png");

    dt = Graphics.doubleTubeGraphic(500, 400, p);
    dtb = Graphics.doubleTubeBlue(500, 400, 50, 450, 50, p);
    dto = Graphics.doubleTubeOrng(500, 400, 50, 450, 50, p);
    v = Graphics.valve(p);
    pa = Graphics.pumpAssembly(p);
  };

  p.setup = () => {
    p.createCanvas(g.width, g.height, p.WEBGL);
    randStartVals(p);
    bt = Graphics.beakersAndTubes(p, tubes);
    // Cretae shaders
    blueShader = p.createShader(fillVertShaderSource,blueFragShaderSource);
    orngShader = p.createShader(fillVertShaderSource,orngFragShaderSource);

    // Create the parameterized filling animation
    fillingAnimation = new AnimationFactory;

    // Inlet tubes
    // Orange
    var vertices = [[659, 430],[659, 125],[600, 125]];
    fillingAnimation.createSegment(.3, TubeFill, .7, vertices, g.orangeFluidColor);
    // Blue
    vertices = [[284, 450],[284, 399],[550, 399],[550, 375]];
    fillingAnimation.createSegment(.3, TubeFill, .7, vertices, g.blueFluidColor);

    // Vertices for orange path
    vertices = [[600,125],[200,125],[200,190],[600,190],[600,254],[200,254],[200,323],[600,323],];
    // HexFill for orange filling
    fillingAnimation.createSegment(1, HexFill, 3, vertices, drawOrngFillLong, (p:P5CanvasInstance)=>{p.image(dto,149,25)});
    // Vertices for blue path
    vertices = [[550,375],[550,320],[250,320],[250,255],[550,255],[550,190],[250,190],[250,125],[550,125],[550,75]];
    // HexFill for blue filling
    fillingAnimation.createSegment(1, HexFill, 3, vertices, drawBlueFillLong, (p:P5CanvasInstance)=>{p.image(dtb,150,25)});

    // Outlet Tubes
    // Orange
    var vertices = [[602, 322],[622,322],[622,433],[459,433],[459,603]];
    fillingAnimation.createSegment(4, TubeFill, 1, vertices, g.orangeFluidColor);
    // Blue
    vertices = [[550, 72],[550, 46],[93,46],[93,603]];
    fillingAnimation.createSegment(4, TubeFill, 1, vertices, g.blueFluidColor);
  };

  p.draw = () => {
    p.background(250);
    p.translate(-g.width/2, -g.height/2);
    calcHeatTransferRate();
    drawAll(p, dt, bt, pa, v, fillingAnimation);
  };

  p.mousePressed = () => {
    if (p.dist(V1CX, V1CY, p.mouseX, p.mouseY) <= 50) {
      g.dragging1 = true;
    } else if (p.dist(V2CX, V2CY, p.mouseX, p.mouseY) <= 50) {
      g.dragging2 = true;
    }
  };

  p.mouseReleased = () => {
    g.dragging1 = false;
    g.dragging2 = false;
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
    p.translate(124,25);
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

    // console.log(orngFillPath.normDist);

    const segmentTimes = orngFillPath.normDist;
    const aniTime = 3;
    drawArc(p,199,156,false, normAniTime(time,aniTime * segmentTimes[1],aniTime * segmentTimes[2]));
    drawArc(p,600,222,true , normAniTime(time,aniTime * segmentTimes[3],aniTime * segmentTimes[4]));
    drawArc(p,199,288,false, normAniTime(time,aniTime * segmentTimes[5],aniTime * segmentTimes[6]));

    p.pop();

  }
}

export function toggleSinglePumps(running: boolean) {
  g.hIsFlowing = running;
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