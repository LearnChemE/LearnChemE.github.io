export function drawSlider(x, y, width, value, label, displayValue, options = {}) {
  const color = options.color || '#1DCD9F';
  const handleRadius = options.handleRadius || 1.4;
  const trackHeight = options.trackHeight || 0.8;
  const labelX = options.labelX || (x - 10); // Allow custom label position
  const valueX = options.valueX || (x + width + 7.5); // Allow custom value position
  const sliderId = options.sliderId || 'slider'; // Allow custom slider ID

  fill(50, 50, 50);
  noStroke();
  textSize(2.8);
  textAlign(LEFT, CENTER);
  text(label, labelX, y); // Use custom label position
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
  text(displayValue, valueX, y); // Use custom value position
  
  // Store bounds with custom ID
  const bounds = {
    x: x,
    y: y - trackHeight / 2,
    width: width,
    height: trackHeight + handleRadius,
    value: value
  };
  
  if (sliderId === 'slider2') {
    window.slider2Bounds = bounds;
  } else if (sliderId === 'slider3') {
    window.slider3Bounds = bounds;
  } else {
    window.sliderBounds = bounds;
  }
} 