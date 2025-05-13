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

  function totalMoles(x) {
    return z.initialA + z.molesInerts + x * (r - 1);
  }

  function pressureConstVolumeCase(x) {
    return (totalMoles(x) * z.R * z.temperature) / z.volumeConstVolumeCase;
  }

  function volumeConstPressureCase(x) {
    return (totalMoles(x) * z.R * z.temperature) / z.pressureConstPressureCase;
  }

  function equilMolsA(x) {
    return z.initialA - x;
  }

  function equilMolsB(x) {
    return r * x;
  }

  /*
  z.totalMoles = z.initialA + z.molesInerts + x*(r-1);
  z.pressureConstVolumeCase = z.totalMoles*z.R*z.temperature/z.volumeConstVolumeCase;
  z.volumeConstPressureCase = z.totalMoles*z.R*z.temperature/z.pressureConstVolumeCase;
  z.equilMolsA = z.initialA-x;
  z.equilMolsB = r*x;
  */

  function extentReactionEQConstPressureCase(x) {
    return (
      z.kEQ - ((equilMolsB(x) * z.pressureConstPressureCase) / totalMoles(x)) ** r / ((equilMolsA(x) * z.pressureConstPressureCase) / totalMoles(x))
    );
  }

  function extentReactionEQConstVolumeCase(x) {
    return (
      z.kEQ - ((equilMolsB(x) * pressureConstVolumeCase(x)) / totalMoles(x)) ** r / ((equilMolsA(x) * pressureConstVolumeCase(x)) / totalMoles(x))
    );
  }

  //root solver
  function findRoot(f, a, b) {
    let c = (a + b) / 2;

    while (Math.abs(f(c)) > 0.0000001) {
      if (f(a) * f(c) < 0) {
        b = c;
      } else {
        a = c;
      }

      c = (a + b) / 2;
    }

    return c.toFixed(3);
  }

  //z.extentConstPressureCase = z.pressureConstPressureCase;s

  z.extentConstPressureCase = findRoot(extentReactionEQConstPressureCase, 0, 4.999999);
  z.molAForConstPressureSelection = equilMolsA(z.extentConstPressureCase);
  z.molBForConstPressureSelection = equilMolsB(z.extentConstPressureCase);
  z.volumeConstPressureCase = volumeConstPressureCase(z.extentConstPressureCase);

  z.extentConstVolumeCase = findRoot(extentReactionEQConstVolumeCase, 0, 4.999999);
  z.molAForConstVolumeSelection = equilMolsA(z.extentConstVolumeCase);
  z.molBForConstVolumeSelection = equilMolsB(z.extentConstVolumeCase);
  z.pressureConstVolumeCase = pressureConstVolumeCase(z.extentConstVolumeCase);

  let totalCylinderVolume = 2.25;
  z.cylinderLiveVolumeFractionConstantPressureCase = z.volumeConstPressureCase / totalCylinderVolume;
  z.cylinderLiveVolumeFractionConstantVolumeCase = z.volumeConstVolumeCase / totalCylinderVolume;
}
