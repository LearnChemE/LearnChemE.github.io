/* 
  I usually separate all of the mathematical equations into a file
  called calcs.js, and call the calcAll() function every loop of
  the draw() function in draw.js. That way, calculations are made
  every time the image is drawn, and the simulation is always up-to-date.
*/

export function calcAll() {
  // for simplier variables
  z.hBot = 1 - z.hTop - z.hMid;
  let h3 = z.hTop;
  let h2 = z.hMid;
  let h1 = z.hBot;
  /*
  The original base line equations to graph:

  Line spanning fluid 1 (bottom fluid):
  y = (x*(h3*muMid + h2*muTop + h1*muMid*muTop))/(muMid*muTop)

  Line spanning fluid 2 (middle fluid):
  y = (h3*x*muMid + h1*muTop + h2*x*muTop - h1*mumid*muTop + h1*x*muMid*muTop)/(muTop)

  Line spanning fluid 3 (top fluid):
  y = (h1*muMid + h2*muMid + h3*x*muMid - h2*muTop + h2*x*muTop - h1*muMid*muTop + h1*x*muMid*muTop)/(muMid)
  */

  function fluid1LineYOut(x) {
    return x * ((h3 * z.muMid + h2 * z.muTop + h1 * z.muMid * z.muTop) / (z.muMid * z.muTop));
  }

  function fluid1LineXOut(y) {
    return y * ((z.muMid * z.muTop) / (h3 * z.muMid + h2 * z.muTop + h1 * z.muMid * z.muTop));
  }

  function fluid2LineYOut(x) {
    return (h3 * x * z.muMid + h1 * z.muTop + h2 * x * z.muTop - h1 * z.muMid * z.muTop + h1 * x * z.muMid * z.muTop) / (z.muTop);
  }

  function fluid2LineXOut(y) {
    return (z.muTop * (y - h1 + h1 * z.muMid)) / (h3 * z.muMid + h2 * z.muTop + h1 * z.muMid * z.muTop);
  }

  function fluid3LineYOut(x) {
    return (h1 * z.muMid + h2 * z.muMid + h3 * x * z.muMid - h2 * z.muTop + h2 * x * z.muTop - h1 * z.muMid * z.muTop + h1 * x * z.muMid * z.muTop) / (z.muMid);
  }

  function fluid3LineXOut(y) {
    return (z.muMid * (y - h1 - h2) + z.muTop * (h2 + h1 * z.muMid)) / (h3 * z.muMid + h2 * z.muTop + h1 * z.muMid * z.muTop);
  }

  // dist graph fluid height ratios
  z.centerYTop = -((z.distBY - z.distTY) * z.hBot) - ((z.distBY - z.distTY) * z.hMid) - ((z.distBY - z.distTY) * z.hTop / 2) + z.distBY;
  z.centerYMid = -((z.distBY - z.distTY) * z.hBot) - ((z.distBY - z.distTY) * z.hMid / 2) + z.distBY;
  z.centerYBot = -((z.distBY - z.distTY) * z.hBot) / 2 + z.distBY;

  // calculations for velocity line on dist graph

  // x-values for the function being graphed based on the heights of each fluid. only calculates the x value between fluid 1 and fluid 2, and between fluid 2 and fluid 3
  let x12 = fluid1LineXOut(h1);
  let x23 = fluid2LineXOut(h1 + h2);
  z.distLineX12 = z.distLX + (z.distRX - z.distLX) * x12;
  z.distLineX23 = z.distLX + (z.distRX - z.distLX) * x23;

  // transformed calculated points to real points on the graph
  // for interactive points

  // Slope variables calculate slope of each of the 3 lines
  // CircleY1,Y2,Y3 calculate a live updated Y value based on the X value of the mouse for the bottom line(1), middle line(2), top line(3), this Y value is where the gray circle is placed to keep it on the line
  z.plotCircleY1 = fluid1LineYOut((z.circleX - z.distLX) / (z.distRX - z.distLX)) * (1 - (z.distBY - z.distTY)) + z.distBY;
  z.plotCircleY2 = fluid2LineYOut((z.circleX - z.distLX) / (z.distRX - z.distLX)) * (1 - (z.distBY - z.distTY)) + z.distBY;
  z.plotCircleY3 = fluid3LineYOut((z.circleX - z.distLX) / (z.distRX - z.distLX)) * (1 - (z.distBY - z.distTY)) + z.distBY;

  // Height Graph stuff
  z.centerXTop = -((z.distRX - z.distLX) * z.hTop) / 2 + z.distRX;
  z.centerXMid = -((z.distRX - z.distLX) * z.hTop) - ((z.distRX - z.distLX) * z.hMid / 2) + z.distRX;
  z.centerXBot = -((z.distRX - z.distLX) * z.hTop) - ((z.distRX - z.distLX) * z.hMid) - ((z.distRX - z.distLX) * z.hBot / 2) + z.distRX;

  // Points on the Graph
  z.heightY12 = (1 - (z.heightBY - z.heightTY)) * x12 + z.heightBY;
  z.heightY23 = (1 - (z.heightBY - z.heightTY)) * x23 + z.heightBY;

  let y12 = fluid1LineYOut(h1);
  let y23 = fluid2LineYOut(h1 + h2);

  z.heightX12 = z.distLX + (z.distRX - z.distLX) * y12;
  z.heightX23 = z.distLX + (z.distRX - z.distLX) * y23;

  z.plotCircleY4 = fluid1LineXOut((z.circleX - z.distLX) / (z.distRX - z.distLX)) * (1 - (z.heightBY - z.heightTY)) + z.heightBY;
  z.plotCircleY5 = fluid2LineXOut((z.circleX - z.distLX) / (z.distRX - z.distLX)) * (1 - (z.heightBY - z.heightTY)) + z.heightBY;
  z.plotCircleY6 = fluid3LineXOut((z.circleX - z.distLX) / (z.distRX - z.distLX)) * (1 - (z.heightBY - z.heightTY)) + z.heightBY;
}