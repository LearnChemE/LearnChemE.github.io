export function drawButtonBar(x, y, width, height, selectedIndex = 1, options = {}) {
  const buttonLabels = ["P-x-y", "fugacity versus P", "both"];
  const leftSegmentWidth = width * 0.25; // 25% for left
  const middleSegmentWidth = width * 0.5; // 40% for middle (wider)
  const rightSegmentWidth = width * 0.25; // 35% for right
  
  // Draw each button segment background first
  const segments = [
    { x: x, width: leftSegmentWidth, label: buttonLabels[0] },
    { x: x + leftSegmentWidth, width: middleSegmentWidth, label: buttonLabels[1] },
    { x: x + leftSegmentWidth + middleSegmentWidth, width: rightSegmentWidth, label: buttonLabels[2] }
  ];
  
  for (let i = 0; i < 3; i++) {
    const segment = segments[i];
    const btnX = segment.x;
    const btnY = y;
    const btnW = segment.width;
    const btnH = height;
    
    // Check if mouse is hovering over this button
    const isHovered = window.mX >= btnX && window.mX <= btnX + btnW && 
                      window.mY >= btnY && window.mY <= btnY + btnH;
    
    // Determine background color based on state
    let bgColor;
    if (i === selectedIndex) {
      bgColor = [135, 206, 235]; // Light blue for selected
    } else if (isHovered) {
      bgColor = [220, 220, 220]; // Light grey for hover
    } else {
      bgColor = [220, 220, 220]; // Light grey for unselected
    }
    
    // Background color
    fill(bgColor[0], bgColor[1], bgColor[2]);
    noStroke();
    rect(btnX, btnY, btnW, btnH);
    
    // Text
    fill(0);
    if (i === 1) {
      textSize(2.8); // Slightly smaller text for middle button
    } else {
      textSize(3.0);
    }
    textAlign(CENTER, CENTER);
    
    if (i === 1) {
      // Middle button with italicized P - better spacing
      text("    fugacity versus", btnX + btnW / 2 - 3, btnY + btnH / 2);
      textStyle(ITALIC);
      text("    P", btnX + btnW / 2 + 8, btnY + btnH / 2);
      textStyle(NORMAL);
    } else {
      text(segment.label, btnX + btnW / 2, btnY + btnH / 2);
    }
  }
  
  // Ensure text style is reset to normal
  textStyle(NORMAL);
  
  // Draw vertical dividers with thicker stroke after backgrounds
  stroke(0);
  strokeWeight(0.2);
  line(x + leftSegmentWidth, y, x + leftSegmentWidth, y + height);
  line(x + leftSegmentWidth + middleSegmentWidth, y, x + leftSegmentWidth + middleSegmentWidth, y + height);
  
  // Draw the border with rounded corners last
  stroke(0);
  strokeWeight(0.2);
  noFill();
  rect(x, y, width, height, 1);
  
  // Store bounds for click detection
  window.buttonBarBounds = {
    x: x,
    y: y,
    width: width,
    height: height,
    segments: segments,
    labels: buttonLabels,
    selectedIndex: selectedIndex
  };
} 