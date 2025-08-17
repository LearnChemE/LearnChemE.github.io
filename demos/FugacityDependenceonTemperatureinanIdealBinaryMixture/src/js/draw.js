import { drawBasicPlot, drawPlot1, drawPlot2, drawBothPlots } from './graph.js';
import { drawControlBar } from './control.js';
import { drawSlider } from './slider.js';
import { drawHamburger, drawCanvasMenu } from './hamburger.js';
import { Tx } from './calcs.js';

export function drawAll() {
  drawControlBar();
  
  // Draw plots based on selected button
  const selectedIndex = window.state.selectedButtonIndex || 0;
  
  if (selectedIndex === 0) {
    // T-x-y button selected - show Plot 1 only
    drawPlot1({ 
      axisLabelSize: 3.5,
      yLabel: "temperature (°C)"
    });
    
    // Add fugacity text above plot with calculated values
    if (window.currentState) {
      const state = window.currentState;
      
      textSize(3.5);
      textAlign(CENTER, BOTTOM);
      fill(0);
      noStroke();
      
      // Draw text with italic mathematical symbols
      const textX = window.contentArea.x + window.contentArea.width / 2 + 4;
      const textY = window.contentArea.y + 4;
      
      // "P = 1 bar"
      textStyle(ITALIC);
      text("P", textX - 50, textY);
      textStyle(NORMAL);
      text(" = 1 bar", textX - 42.5, textY);
      
      // Determine formula and values based on phase region
      let fBFormula, fTFormula, fBValue, fTValue;
      
      if (state.isInTwoPhase) {
        // Two-phase region: fB = yB * P, fT = yT * P
        fBFormula = "y_B P";
        fTFormula = "y_T P";
        fBValue = state.fB.toFixed(2);
        fTValue = state.fT.toFixed(2);
      } else if (state.temperature <= Tx(state.moleFraction)) {
        // Liquid region: fB = xB * PsatB, fT = xT * PsatT
        fBFormula = "x_B P^sat";
        fTFormula = "x_T P^sat";
        fBValue = state.fB.toFixed(2);
        fTValue = state.fT.toFixed(2);
      } else {
        // Vapor region: fB = yB * P, fT = yT * P
        fBFormula = "y_B P";
        fTFormula = "y_T P";
        fBValue = state.fB.toFixed(2);
        fTValue = state.fT.toFixed(2);
      }
      
      // "f_B = formula = value bar"
      textStyle(ITALIC);
      text("f", textX - 21, textY);
      textStyle(NORMAL);
      textSize(2.5);
      text("B", textX - 19, textY + 1);
      textSize(3.5);
      textStyle(ITALIC);
      text(" = ", textX - 16, textY);
      
      // Draw the formula part
      if (fBFormula === "y_B P") {
        text("y", textX - 12, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("B", textX - 9.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX - 7, textY);
      } else if (fBFormula === "x_B P^sat") {
        text("x", textX - 12, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("B", textX - 9.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX - 7, textY);
        textSize(2.5);
        text("sat", textX - 3, textY - 2.5);
        textSize(3.5);
      }
      
      textStyle(NORMAL);
      text(" = " + fBValue + " bar", textX + 6, textY);
      
      // "f_T = formula = value bar"
      textStyle(ITALIC);
      text("f", textX + 22, textY);
      textStyle(NORMAL);
      textSize(2.5);
      text("T", textX + 24, textY + 1);
      textSize(3.5);
      textStyle(ITALIC);
      text(" = ", textX + 27, textY);
      
      // Draw the formula part
      if (fTFormula === "y_T P") {
        text("y", textX + 31, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("T", textX + 33.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX + 36, textY);
      } else if (fTFormula === "x_T P^sat") {
        text("x", textX + 31, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("T", textX + 33.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX + 36, textY);
        textSize(2.5);
        text("sat", textX + 40, textY - 2.5);
        textSize(3.5);
      }
      
      textStyle(NORMAL);
      text(" = " + fTValue + " bar", textX + 49, textY);
    }
  } else if (selectedIndex === 1) {
    // fugacity versus T button selected - show Plot 2 only
    drawPlot2({ 
      axisLabelSize: 3.5,
      xLabel: "temperature (°C)"
    });
    
    // Add fugacity text above plot with calculated values
    if (window.currentState) {
      const state = window.currentState;
      
      textSize(3.5);
      textAlign(CENTER, BOTTOM);
      fill(0);
      noStroke();
      
      // Draw text with italic mathematical symbols
      const textX = window.contentArea.x + window.contentArea.width / 2 + 4;
      const textY = window.contentArea.y + 4;
      
      // "P = 1 bar"
      textStyle(ITALIC);
      text("P", textX - 50, textY);
      textStyle(NORMAL);
      text(" = 1 bar", textX - 42.5, textY);
      
      // Determine formula and values based on phase region
      let fBFormula, fTFormula, fBValue, fTValue;
      
      if (state.isInTwoPhase) {
        // Two-phase region: fB = yB * P, fT = yT * P
        fBFormula = "y_B P";
        fTFormula = "y_T P";
        fBValue = state.fB.toFixed(2);
        fTValue = state.fT.toFixed(2);
      } else if (state.temperature <= Tx(state.moleFraction)) {
        // Liquid region: fB = xB * PsatB, fT = xT * PsatT
        fBFormula = "x_B P^sat";
        fTFormula = "x_T P^sat";
        fBValue = state.fB.toFixed(2);
        fTValue = state.fT.toFixed(2);
      } else {
        // Vapor region: fB = yB * P, fT = yT * P
        fBFormula = "y_B P";
        fTFormula = "y_T P";
        fBValue = state.fB.toFixed(2);
        fTValue = state.fT.toFixed(2);
      }
      
      // "f_B = formula = value bar"
      textStyle(ITALIC);
      text("f", textX - 21, textY);
      textStyle(NORMAL);
      textSize(2.5);
      text("B", textX - 19, textY + 1);
      textSize(3.5);
      textStyle(ITALIC);
      text(" = ", textX - 16, textY);
      
      // Draw the formula part
      if (fBFormula === "y_B P") {
        text("y", textX - 12, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("B", textX - 9.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX - 7, textY);
      } else if (fBFormula === "x_B P^sat") {
        text("x", textX - 12, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("B", textX - 9.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX - 7, textY);
        textSize(2.5);
        text("sat", textX - 3, textY - 2.5);
        textSize(3.5);
      }
      
      textStyle(NORMAL);
      text(" = " + fBValue + " bar", textX + 6, textY);
      
      // "f_T = formula = value bar"
      textStyle(ITALIC);
      text("f", textX + 22, textY);
      textStyle(NORMAL);
      textSize(2.5);
      text("T", textX + 24, textY + 1);
      textSize(3.5);
      textStyle(ITALIC);
      text(" = ", textX + 27, textY);
      
      // Draw the formula part
      if (fTFormula === "y_T P") {
        text("y", textX + 31, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("T", textX + 33.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX + 36, textY);
      } else if (fTFormula === "x_T P^sat") {
        text("x", textX + 31, textY);
        textStyle(NORMAL);
        textSize(2.5);
        text("T", textX + 33.5, textY + 1);
        textSize(3.5);
        textStyle(ITALIC);
        text(" P", textX + 36, textY);
        textSize(2.5);
        text("sat", textX + 40, textY - 2.5);
        textSize(3.5);
      }
      
      textStyle(NORMAL);
      text(" = " + fTValue + " bar", textX + 49, textY);
    }
  } else if (selectedIndex === 2) {
    // both button selected - show both plots side by side
    drawBothPlots({
      leftMargin: 18,
      rightMargin: 8,
      xLabel: "mole fraction benzene",
      yLabel: "temperature (°C)",
      axisLabelSize: 3.5,
      yLabelXOffset: -9,
      isBothPlots: true
    });
  }
  
  if (window.state.showMenu) {
    drawCanvasMenu();
  }
}