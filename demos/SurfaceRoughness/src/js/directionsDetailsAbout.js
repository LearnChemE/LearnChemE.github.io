import ba from "../media/clearPlotButton.PNG";
import bc from "../media/colorLegend.PNG";
import bb from "../media/comparisonPlot.PNG";
// import bd from "../media/detailsButton.PNG";
// import be from "../media/aboutButton.PNG";
// import bf from "../media/dragPlot.PNG";
import bg from "../media/launchAngleVelocity.PNG";
import bh from "../media/launchButton.PNG";
// import bi from "../media/roughnessPlot.PNG";
import bj from "../media/roughnessSelect.PNG";
// import bk from "../media/sphereStateWindow.PNG";
import bl from "../media/ForceDiagram.PNG";

const aa = document.getElementById("clear-plot-button");
const ab = document.getElementById("comparison-plot");
const ac = document.getElementById("comparison-plot");
const ad = document.getElementById("details-button-img");
const ae = document.getElementById("about-button-img");
const af = document.getElementById("drag-plot");
const ag = document.getElementById("launch-angle-velocity");
const ah = document.getElementById("launch-button");
const ai = document.getElementById("roughness-plot");
const aj = document.getElementById("roughness-select");
const ak = document.getElementById("sphere-state-window");
const al = document.getElementById("force-diagram");

[
  [aa, ba], [ab, bb], [ac, bc], [ag, bg], [ah, bh], [aj, bj], [al, bl]
].forEach(pair => {
  const element = pair[0];
  const source = pair[1];
  const image = new Image();
  image.src = source;
  element.appendChild(image);
});

