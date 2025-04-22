function rotateImpeller() {
  const impeller = state.impeller;
  const impellerSpeed = 0.4;
  const impellerRotation = cos(TWO_PI * (frameCount % (60 / impellerSpeed) / (60 / impellerSpeed))).toFixed(2);
  impeller.setAttribute("transform", `translate(205,159) scale(${impellerRotation},1)`);
}

export function drawAll() {
  rotateImpeller();
}