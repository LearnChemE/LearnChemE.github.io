/* 
  I usually separate all of the mathematical equations into a file
  called calcs.js, and call the calcAll() function every loop of
  the draw() function in draw.js. That way, calculations are made
  every time the image is drawn, and the simulation is always up-to-date.
*/

export function calcAll() {
  
  //bring in r from html
  const coeffB = document.querySelector('input[name="plot"]:checked');
  let r = eval(coeffB.value);

  function totalMoles(x){

    return z.initialA + z.molesInerts + x*((r)-1);

  }

  function pressureCV(x){

    return totalMoles(x)*z.gasConst*z.temp/z.volumeCV;

  }

  function volumeCP(x){

    return totalMoles(x)*z.gasConst*z.temp/z.pressureCP;

  }

  function equilA(x){

    return z.initialA-x;

  }

  function equilB(x){

    return (r)*x;

  }

  /*
  z.totalMoles = z.initialA + z.molesInerts + x*(r-1);
  z.pressureCV = z.totalMoles*z.gasConst*z.temp/z.volumeCV;
  z.volumeCP = z.totalMoles*z.gasConst*z.temp/z.pressureCV;
  z.equilA = z.initialA-x;
  z.equilB = r*x;
  */
  
  function extentReactionEQCP(x){

    return (z.kEQ-(((equilB(x)*z.pressureCP/totalMoles(x))**(r))/(equilA(x)*z.pressureCP/totalMoles(x))));

  }

  function extentReactionEQCV(x){

    return (z.kEQ-(((equilB(x)*pressureCV(x)/totalMoles(x))**r)/(equilA(x)*pressureCV(x)/totalMoles(x))));

  }

  //root solver
  function findRoot(f,a,b){

    let c = (a+b)/2;

    while(Math.abs(f(c))>0.0000001){

      if (f(a)*f(c)< 0){

          b = c;

      }
      else{

        a = c;

      }

        c = (a+b)/2;
 
  }

  return c.toFixed(3);

}

//z.extentCP = z.pressureCP;s

  z.extentCP = findRoot(extentReactionEQCP, 0,4.999999);
  z.molACP = equilA(z.extentCP);
  z.molBCP = equilB(z.extentCP);
  z.volumeCP = volumeCP(z.extentCP);

  z.extentCV = findRoot(extentReactionEQCV, 0,4.999999);
  z.molACV = equilA(z.extentCV);
  z.molBCV = equilB(z.extentCV);
  z.pressureCV = pressureCV(z.extentCV);

}