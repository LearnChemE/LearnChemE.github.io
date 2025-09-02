import './style.css'
import { enableWindowResize, initHamburgerMenu, initSvgDrag, initSvgZoom, insertSVG } from './ts/helpers';
import worksheet from './media/massMoleBalancesWorksheet.pdf';
import svg from './media/canvas.svg?raw';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
  </div>
`;


// Get the app container
const app = document.querySelector<HTMLDivElement>('#app')!;

// Create div containing svg
app.appendChild(initHamburgerMenu(worksheet, "singleEffectEvaporatorWorksheet.pdf"));
// Create hamburger menu
app.appendChild(insertSVG(svg));

// Visibility and accessibility
initSvgZoom();
initSvgDrag();
enableWindowResize();