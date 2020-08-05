import './style/fonts/hack-regular.woff';
import './style/fonts/hack-regular.woff2';
import './style/style.scss';
import jQuery from 'jquery';
window["jQuery"] = jQuery;
window["$"] = jQuery;
import 'bootstrap';
import * as p5 from 'p5';
window.p5 = p5;
import * as setup from './js/setup.js';
import * as loop from './js/loop.js';
import * as Separator from './js/Separator.js';

window.separator = Separator();

/******** ADD HTML ********/
require('./js/insertSVG.js')();
require('./js/insertInputs.js');

let animation = (sk) => {
  setup(sk);
  loop(sk, true);
}


let P5 = new p5(animation);
