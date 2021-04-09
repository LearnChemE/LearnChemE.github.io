require("./style/svg-graph-library.scss");
const { SVG_Graph } = require("./js/svg-graph-library.js");

const options = {
  title: "example plot",
  axes: {
    x : {
      labels: ["", "new label1"]
    },
    y : {
      labels: ["new label2", ""]
    }
  },
};

window.graph0 = new SVG_Graph(options);

function testFunc(x) {
  return x**0.5;
};

function testFunc2(x) {
  return x**2;
};

function testFunc3(x) {
  return x;
}

graph0.addCurve(testFunc, { stroke: "rgba(0, 0, 255, 1)", resolution: 100 });
graph0.addCurve(testFunc2, { stroke: "rgba(0, 255, 5, 1)", resolution: 100 });
graph0.addCurve(testFunc3, { stroke: "rgba(255, 0, 5, 1)", resolution: 100 });
