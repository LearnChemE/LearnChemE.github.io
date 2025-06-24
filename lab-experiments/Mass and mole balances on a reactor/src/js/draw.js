import { drawBeaker , drawPumpAndSwitch, 
  drawEvaporatorBody , drawHeaterSwitch } from "./evaporator";

import { drawReactorBody, drawReactorHeaterSwitch,updateCoilGlow, 
  updateReactorVaporParticles, updateExhaustParticles,
   drawExhaustParticles, updateCondenserParticles , 
   updateCondenserParticlesBezier} from './reactor.js';


import { drawThreeWayValve, drawExhaustCap, 
   } from "./threeWayValve";


import { drawCondenserBody,
   drawCoolingSwitch, drawCollectingBeaker,
  drawCondensateTube, drawCondensateTubeStream, 
  drawCondenserParticles, condensedFluidLevel } from "./condenser.js";

  import { drawBubbleMeter, drawBubbleMeterElbowTube, 
    drawTubeAtAngleToBubbleMeter, maybeSpawnHydrogenBubble,
    drawHydrogenBubbles} from "./bubblemeter.js";
  
  import {startBubbleTimer, endBubbleTimer} from "./calcs.js"


export function drawAll(temp) {
  background(255);
  drawBeaker(30, 88, 0.8);
  drawHeaterSwitch(12, 65);
  drawPumpAndSwitch(33, 60, 12, 60);
  drawEvaporatorBody(23, 33, 55);
  updateCoilGlow();
  drawReactorBody(temp); 
  updateReactorVaporParticles (temp); 
  drawReactorHeaterSwitch(63, 36.5);
  updateExhaustParticles();
  drawExhaustParticles();
  updateCondenserParticlesBezier();
  updateCondenserParticles(); // Animate flow from valve to condenser

  drawThreeWayValve();
  drawExhaustCap(118,19.2);
  drawCondenserBody(94, 28, 100); 
  drawCoolingSwitch(81, 63);
  drawCollectingBeaker(100, 88, condensedFluidLevel);
  drawCondenserParticles();

  // drawCondensedDroplets();
 

  drawBubbleMeterElbowTube();
    
  drawCondensateTube();
  drawCondensateTubeStream(); // animate when draining

  drawTubeAtAngleToBubbleMeter();



  drawBubbleMeter(130, 50);

maybeSpawnHydrogenBubble(temp);  // wherever your temperature is tracked
drawHydrogenBubbles();
startBubbleTimer();
endBubbleTimer();


}