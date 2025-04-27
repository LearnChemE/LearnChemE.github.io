function rotateImpeller() {
  const impeller = state.impeller;
  const impellerSpeed = 0.4;
  const impellerRotation = cos(TWO_PI * (frameCount % (60 / impellerSpeed) / (60 / impellerSpeed))).toFixed(2);
  if (state.motorOn) {
    impeller.setAttribute("transform", `translate(205,159) scale(${impellerRotation},1)`);
  }
}

let height = 0;
const maxHeight = 50;

export function drawAll() {
  rotateImpeller();
  const f = frameCount;
  const flowStream = document.getElementById("path33");
  const maxLength = flowStream.getTotalLength();
  const length = min(maxLength, maxLength * (frameCount / 30));
  const pathLength = length.toFixed(2);
  const pathOffset = maxLength - length;
  flowStream.style.strokeDasharray = `${maxLength} ${maxLength}`;
  flowStream.style.strokeDashoffset = pathOffset;
  height = height + (maxHeight - height) / 200;
  // console.log(height);
}