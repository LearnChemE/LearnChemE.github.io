//javascript main file

//2D Plotting function that spits out an array of numbers from a function
//example: toPlot("y + 3", ["y", 1, 5, 2]); yields [4, 6, 8]
function toPlot() {
  var expr, indepVar, outArray, message, plotRangeMin, plotRangeMax;
  expr = arguments[0];
  indepVar = arguments[1][0];
  plotRangeMin = arguments[1][1];
  plotRangeMax = arguments[1][2];
  outArray = [];

  if (arguments[1].length==4 && isNaN(arguments[1][3]) == false) {plotRangeInc = Number(arguments[1][3])} else {plotRangeInc = Number((arguments[1][2]-arguments[1][1])/10)};

  try { 
    if(arguments.length != 2 ||
      typeof arguments[1] != "object" ||
      arguments[1].length < 3 ||
      arguments[1].length > 4)
      throw "two input arguments: 1.) a single-variate function and 2.) a 3-dimensional array for the independent variable and its respective plot range.";
  }
  catch(err) {
    console.log("function toPlot() requires " + err + " e.g. equationToArray(x + 2x + 6, [x, 0, 100])");
  }

  var i;
  for (i = plotRangeMin; i <= plotRangeMax; i += plotRangeInc) {
    outArray.push(
      math.eval(
        expr.replace(indepVar, String(i.toPrecision(10)))
        )
      );
  }
console.log(outArray);
}