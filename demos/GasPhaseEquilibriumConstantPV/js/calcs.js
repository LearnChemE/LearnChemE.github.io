/* 
  I usually separate all of the mathematical equations into a file
  called calcs.js, and call the calcAll() function every loop of
  the draw() function in draw.js. That way, calculations are made
  every time the image is drawn, and the simulation is always up-to-date.
*/

export function calcAll() {
  

  z.totalmoles = z.initialA + z.molesInerts + z.x*(z.coeffBValue-1);
 
}