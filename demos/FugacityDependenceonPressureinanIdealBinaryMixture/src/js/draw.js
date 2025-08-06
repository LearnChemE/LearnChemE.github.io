import { drawBasicPlot, drawPlot1, drawPlot2 } from './graph.js';
import { drawControlBar } from './control.js';
import { drawSlider } from './slider.js';
import { drawHamburger, drawCanvasMenu } from './hamburger.js';

export function drawAll() {
  drawControlBar();
  
  // Draw plots based on selected button
  const selectedIndex = window.state.selectedButtonIndex || 0;
  
  if (selectedIndex === 0) {
    // P-x-y button selected - show Plot 1 only
    drawPlot1({ axisLabelSize: 3.5 });
    
    // Add fugacity text above plot with calculated values
    if (window.currentState) {
      const state = window.currentState;
      const fB = state.fB.toFixed(2);
      const fT = state.fT.toFixed(2);
      
      textSize(3.5);
      textAlign(CENTER, BOTTOM);
      fill(0);
      noStroke();
      text(`fugacity of benzene = ${fB} bar              fugacity of toluene = ${fT} bar`, 
           window.contentArea.x + window.contentArea.width / 2 + 4, 
           window.contentArea.y + 4);
    }
  } else if (selectedIndex === 1) {
    // fugacity versus P button selected - show Plot 2 only
    drawPlot2({ axisLabelSize: 3.5 });
    
    // Add fugacity text above plot with calculated values
    if (window.currentState) {
      const state = window.currentState;
      const fB = state.fB.toFixed(2);
      const fT = state.fT.toFixed(2);
      
      textSize(3.5);
      textAlign(CENTER, BOTTOM);
      fill(0);
      noStroke();
      text(`fugacity of benzene = ${fB} bar              fugacity of toluene = ${fT} bar`, 
           window.contentArea.x + window.contentArea.width / 2 + 4, 
           window.contentArea.y + 4);
    }
  } else if (selectedIndex === 2) {
    // both button selected - show both plots side by side
    const gap = 12; // Space between plots
    const totalMargin = 26 + gap; // 18 + 8 + gap (left margin + right margin + gap)
    const plotWidth = (window.contentArea.width - totalMargin) / 2; // Equal width for both plots
    
    // Plot 1 (left side)
    drawPlot1({
      leftMargin: 18,
      rightMargin: plotWidth + gap + 8, // Add gap and use correct right margin
      xLabel: "mole fraction benzene",
      yLabel: "pressure (bar)",
      axisLabelSize: 3.5,
      yLabelXOffset: -9 // Move Y-axis label to the right in both case
    });
    
    // Plot 2 (right side) - same size as Plot 1
    drawPlot2({
      leftMargin: plotWidth + gap + 18, // Add gap to separate from Plot 1
      rightMargin: 8, // Same right margin as individual plots (default)
      xLabel: "pressure (bar)",
      yLabel: "fugacity (bar)",
      axisLabelSize: 3.5,
      yLabelXOffset: -9, // Move Y-axis label to the right in both case
      isBothPlots: true // Increase text gap when both plots are shown
    });
  }
  
  if (window.state.showMenu) {
    drawCanvasMenu();
  }
}