export function drawHamburger(iconX, iconY, iconSize, iconMargin, canvasSize) {
  fill(135, 206, 235);
  stroke(0);
  strokeWeight(0.3);
  rect(iconX, iconY, iconSize, iconSize, 1);
  stroke(30);
  strokeWeight(0.4);
  const linePaddingX = 1;
  const lineStartX = iconX + linePaddingX;
  const lineEndX = iconX + iconSize - linePaddingX;
  const lineYs = [iconY + 1.4, iconY + iconSize / 2, iconY + iconSize - 1.4];
  for (let i = 0; i < 3; i++) {
    line(lineStartX, lineYs[i], lineEndX, lineYs[i]);
  }
  window.hamburgerIconBounds = {
    x: iconX,
    y: iconY,
    w: iconSize,
    h: iconSize
  };
}

export function drawCanvasMenu() {
  // Popup menu dimensions (even smaller)
  const menuWidth = 20;
  const buttonHeight = 4.8;
  const buttonSpacing = 1.0;
  const popupPadding = 1.2;
  const iconMargin = 4;
  const margin = 2;
  const iconSize = 6;
  const numButtons = 3;
  const menuHeight = 2 * popupPadding + numButtons * buttonHeight + (numButtons - 1) * buttonSpacing;
  // Align the popup so its right edge matches the right side of the hamburger border
  const menuX = state.canvasSize[0] - margin - iconSize - iconMargin + iconSize - menuWidth + iconSize - 6; // -1 for border
  let menuY = margin + (10 - iconSize) / 2 + iconSize - 0.6;

  // Draw menu background
  push();
  fill(255);
  stroke(0);
  strokeWeight(0.3);
  rect(menuX, menuY, menuWidth, menuHeight, 1);
  pop();

  // Draw buttons
  const labels = ["Directions", "Details", "About"];
  window.menuButtonBounds = [];
  for (let i = 0; i < 3; i++) {
    const btnX = menuX + popupPadding;
    const btnY = menuY + popupPadding + i * (buttonHeight + buttonSpacing);
    const btnW = menuWidth - 2 * popupPadding;
    const btnH = buttonHeight;
    // Button background (no outline)
    noStroke();
    fill('#0D6EFD');
    rect(btnX, btnY, btnW, btnH, 0.6);
    // Button label
    fill(255);
    textSize(2.8);
    textAlign(CENTER, CENTER);
    text(labels[i], btnX + btnW / 2, btnY + btnH / 2 + 0.05);
    // Store bounds for click detection
    window.menuButtonBounds.push({ x: btnX, y: btnY, w: btnW, h: btnH, label: labels[i] });
  }
} 