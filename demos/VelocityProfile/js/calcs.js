/* 
  I usually separate all of the mathematical equations into a file
  called calcs.js, and call the calcAll() function every loop of
  the draw() function in draw.js. That way, calculations are made
  every time the image is drawn, and the simulation is always up-to-date.
*/

export function calcAll() {
  
  let h3 = z.hTop;
  let h2 = z.hMid;
  let h1 = z.hBot;

  //dist graph fluid height ratios
  z.hBot = 1- z.hTop - z.hMid;
  z.centerYTop = -((z.distBY-z.distTY)*z.hBot) - ((z.distBY-z.distTY)*z.hMid) - ((z.distBY-z.distTY)*z.hTop/2) + z.distBY;
  z.centerYMid = -((z.distBY-z.distTY)*z.hBot) - ((z.distBY-z.distTY)*z.hMid/2) + z.distBY;
  z.centerYBot = -((z.distBY-z.distTY)*z.hBot)/2 + z.distBY;


  //calculations for velocity line on dist graph
    //point on fluid barrier between fluid 1 and 2
  let x12 = h1/((h3*z.muMid+h2*z.muTop+h1*z.muTop*z.muMid)/(z.muTop*z.muMid))
  let x23 = ((z.muTop*(h2+h1*z.muMid))/(h1*z.muTop*z.muMid + h3*z.muMid + h2*z.muTop))

  
   //point on fluid barrier between fluid 2 and 3


  //transformed calculated points to real points on the graph

  z.distLineX12 = z.distLX + (z.distRX-z.distLX)*x12;
  z.distLineX23 = z.distLX + (z.distRX-z.distLX)*x23;

  //Height Graph stuff

  z.centerXTop = -((z.distRX-z.distLX)*z.hTop)/2 + z.distRX;
  z.centerXMid = -((z.distRX-z.distLX)*z.hTop) - ((z.distRX-z.distLX)*z.hMid/2) + z.distRX;
  z.centerXBot = -((z.distRX-z.distLX)*z.hTop) - ((z.distRX-z.distLX)*z.hMid) - ((z.distRX-z.distLX)*z.hBot/2) + z.distRX;


  //Points on the Graph

  
  
 
}