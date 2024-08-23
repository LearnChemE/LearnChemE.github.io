import { P5CanvasInstance } from "@p5-wrapper/react";

// prettier-ignore
const shellTubeBlueVertices = [[60, 5],[110, 5],[110, 230],[115, 230],[115, 5],[220, 5],[220, 230],[225, 230],[225, 5],[330, 5],[330, 230],[335, 230],[335, 5],[440, 5],[440, 295],[390, 295],[390, 70],[385, 70],[385, 295],[280, 295],[280, 70],[275, 70],[275, 295],[170, 295],[170, 70],[165, 70],[165, 295],[60, 295],[60, 5],
];

function createShellTubeGraphic(p: P5CanvasInstance) {
  const width = 475,
    height = 300;
  let st = p.createGraphics(width, height);
  st.push();
  st.noFill();
  st.strokeWeight(3);
  st.rect(0, 0, width, height); // outline
  st.strokeWeight(2);

  // orange
  st.rect(5, 5, 50, 140);
  st.rect(5, 155, 50, 140);
  st.rect(445, 20, 25, 260);
  // horizontal pipes
  st.rect(55, 30, 390, 20);
  st.rect(55, 105, 390, 20);
  st.rect(55, 175, 390, 20);
  st.rect(55, 250, 390, 20);

  // blue
  st.beginShape();
  for (let i = 0; i < shellTubeBlueVertices.length; i++) {
    st.vertex(shellTubeBlueVertices[i][0], shellTubeBlueVertices[i][1]);
  }
  st.endShape();
  st.pop();
  return st;
}

export default { createShellTubeGraphic };
