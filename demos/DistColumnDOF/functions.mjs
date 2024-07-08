
//rect
function drawRectangle(x, y, w, h, label,labely,labelx) {
    push();
    fill(250);
    strokeWeight(1.3);
    rect(x, y, w, h);
    pop();

  
    push();
    noStroke();
    fill(0); 
    textSize(20); 
    text(label, x + labelx, y + labely); 
    pop();
}

function drawBorder(x, y, w, h, dashL, color) {
    let drawLine = true;
    stroke(color);
    // Top edge
    for (let i = 0; i < w; i += dashL) {
      if (drawLine) {
        line(x + i, y, x + min(i + dashL, w), y);
      }
      drawLine = !drawLine;
    }
  
    // Right edge
    drawLine = true;
    for (let i = 0; i < h; i += dashL) {
      if (drawLine) {
        line(x + w, y + i, x + w, y + min(i + dashL, h));
      }
      drawLine = !drawLine;
    }
  
    // Bottom edge
    drawLine = true;
    for (let i = 0; i < w; i += dashL) {
      if (drawLine) {
        line(x + w - i, y + h, x + w - min(i + dashL, w), y + h);
      }
      drawLine = !drawLine;
    }
  
    // Left edge
    drawLine = true;
    for (let i = 0; i < h; i += dashL) {
      if (drawLine) {
        line(x, y + h - i, x, y + h - min(i + dashL, h));
      }
      drawLine = !drawLine;
    }
}
//arrows
function drawArrow(start, end, arrowSize, color) {
    push();
    stroke(color); 
    strokeWeight(2);
    line(start[0], start[1], end[0], end[1]);
    // arrowhead
    let angle = atan2(end[1] - start[1], end[0] - start[0]);
    translate(end[0], end[1]);
    rotate(angle);
    line(0, 0, -arrowSize, arrowSize / 2);
    line(0, 0, -arrowSize, -arrowSize / 2);
    pop();
}

function drawText(textContent, xPos, yPos, textColor, bold=false) {
  if (bold) textStyle('bold');  
  fill(textColor); noStroke();
  textSize(18);
  text(textContent, xPos, yPos);
}
 
 

    
  
export { drawRectangle, drawArrow, drawBorder, drawText};