import 'bootstrap/scss/bootstrap.scss';
import './css/style.css';

import 'bootstrap';

import svg from "./media/crossExchanger.svg?raw";
import { initHamburgerMenu, insertSVG } from './ts/helpers';

const app = document.querySelector<HTMLDivElement>('#app')!;


// Create div containing svg
app.appendChild(initHamburgerMenu());
// Create hamburger menu
app.appendChild(insertSVG(svg));

