import { drawBeaker , drawPumpAndSwitch, 
  drawEvaporatorBody , drawHeaterSwitch } from "./evaporator";

import { drawReactorBody, drawReactorHeaterSwitch,updateCoilGlow, 
  updateReactorVaporParticles   } from './reactor.js';


import { drawThreeWayValve, drawExhaustCap, 
   } from "./threeWayValve";


import { drawCondenserBody,
   drawCoolingSwitch, drawCollectingBeaker,
  drawCondensateTube } from "./condenser.js";

  import { drawBubbleMeter} from "./bubblemeter.js";



export function drawAll(temp) {
  background(255);
  drawBeaker(30, 88, 0.8);
  drawHeaterSwitch(12, 65);
  drawPumpAndSwitch(33, 60, 12, 60);
  drawEvaporatorBody(23, 28, 55);
  updateCoilGlow();
  drawReactorBody(temp); 
  updateReactorVaporParticles (temp); 
  drawReactorHeaterSwitch(63, 36.5);
  drawThreeWayValve();
  drawExhaustCap(118,19.2);
  drawCondenserBody(94, 28, 100); 
  drawCoolingSwitch(81, 63);
  drawCollectingBeaker(100, 88, 0);
  drawCondensateTube();
  drawBubbleMeter(130, 50);



}