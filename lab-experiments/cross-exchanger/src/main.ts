import 'bootstrap/scss/bootstrap.scss';
import './css/style.css'
import svg from "./media/crossExchanger.svg?raw"
import { initHamburgerMenu } from './ts/hamburger';

const app = document.querySelector<HTMLDivElement>('#app')!;

/**
 * Parse and insert SVG into a div
 * @param {string} svg SVG source to be inserted
 * @returns {HTMLDivElement} Div containing svg
 */
function insertSVG(svg: string): HTMLDivElement {
    const div = document.createElement("div");
  
    // Set basic attributes
    div.id = "apparatus-wrapper";
    div.innerHTML = svg;
    return div;
}

// Create div containing svg
app.appendChild(initHamburgerMenu());
app.appendChild(insertSVG(svg));

