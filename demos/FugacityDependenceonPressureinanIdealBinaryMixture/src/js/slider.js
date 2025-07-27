export function drawSlider(x, y, width, value, label, displayValue, options = {}) {
  const color = options.color || '#1DCD9F';
  const handleRadius = options.handleRadius || 1.4;
  const trackHeight = options.trackHeight || 0.8;

  fill(50, 50, 50);
  noStroke();
  textSize(3.0);
  textAlign(LEFT, CENTER);
  text(label, x - 10, y); // move label closer to slider
  stroke(180);
  strokeWeight(trackHeight);
  strokeCap(ROUND);
  line(x, y, x + width, y);
  noStroke();
  const handleX = x + (value * width);
  fill(color);
  ellipse(handleX, y, handleRadius * 2, handleRadius * 2);
  fill(50, 50, 50);
  noStroke();
  textSize(2.8);
  textAlign(RIGHT, CENTER);
  text(displayValue, x + width + 7.5, y);
  window.sliderBounds = {
    x: x,
    y: y - trackHeight / 2,
    width: width,
    height: trackHeight + handleRadius,
    value: value
  };
} 