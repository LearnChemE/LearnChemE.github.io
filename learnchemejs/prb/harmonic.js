/* eslint-disable no-undef */

import {GraphCanvas} from "../src/GraphCanvas.js"
import {hsvToRgb} from '../src/hsvToRgb.js';
import {linspace} from '../src/sky-helpers.js';
import {Modal} from '../src/Modal.js';
import {modalFill} from '../src/modalFill.js';
import {scale} from '../src/scaleApp.js';

class Sim {
    constructor() {
        this.defineGlobals();
        this.insertPageElements();
        this.attachListeners();
        window.setInterval(this.nextFrame.bind(this), 1000 / this.FPS);
        this.init();
    }

    init() {
        this.getCoefficients();
        this.getNs();
        this.getMass();
        this.getKF();
        this.T -= this.TSTEP;
        this.update();
        var modalFiles = [];
        modalFiles.push(modalFill(this.modalDetails,'../html/modalHTML/harmonicDetailsContent.html.txt'));
        modalFiles.push(modalFill(this.modalDirections,'../html/modalHTML/harmonicDirectionsContent.html.txt'));
        modalFiles.push(modalFill(this.modalAbout,'../html/modalHTML/harmonicAboutContent.html.txt'));
        const error1 = this.modalDetails;
        const error2 = this.modalDirections;
        Promise.all(modalFiles).then(function() {
            MathJax.Hub.Configured();
        }).catch(() => {
            console.log("MathJax Not Yet Loaded ...");
            let delay = 1000;
            setTimeout(function jax() {
                try {MathJax.Hub.Configured();}
                catch(error) {console.error(error); if(delay < 10000) {delay*= 1.5; setTimeout(jax, delay);} else {
                    modalFill(error1,'../html/modalHTML/errorText.html.txt');
                    modalFill(error2,'../html/modalHTML/errorText.html.txt');
                }}
            }, delay);
          })
    }

    defineGlobals() {
        this.RUNNING = false;
        this.FPS = 60;
        this.T = 0;
        this.TSTEP = 1 / this.FPS;

        this.minMass = 0.1;
        this.maxMass = 10;
        this.minKF = 1;
        this.maxKF = 100;
        this.scaleMass = 100; // Sliders cannot use floats
        this.scaleKF = 100; // Sliders cannot use floats

        this.graphWidth = 420;
        this.graphHeight = 280;
        this.graphLeft = 30;
        this.graphRight = 10;
        this.graphTop = 10;
        this.graphBottom = 50;
        this.xbounds = [-2, 2];

        this.MAXCOEFFICIENTS = 6;
        this.NS = linspace(0, this.MAXCOEFFICIENTS - 1, this.MAXCOEFFICIENTS, true);
        this.POINTS = 201;

        this.XS = linspace(this.xbounds[0], this.xbounds[1], this.POINTS + 1, true);
        this.YS = [];
        this.HS = [];
        this.KF = 10;
        this.M = 1;
        this.PROBS = [];
        this.RES = [];
        this.IMS = [];

        this.SCALE = 1;
        
        this.detailsContent = "";
        this.directionsContent = "";
        this.aboutContent = "";

        this.modalDetails = new Modal({modalid:"modal-details",modalclass:"modal moveUp",headerstyle:"",header:"Details",contentstyle:"",content:this.detailsContent,showing:false});
        this.modalDirections = new Modal({modalid:"modal-directions",modalclass:"modal moveUp",headerstyle:"",header:"Directions",contentstyle:"",content:this.directionsContent,showing:false});
        this.modalAbout = new Modal({modalid:"modal-about",modalclass:"modal moveUp",headerstyle:"",header:"About",contentstyle:"",content:this.aboutContent,showing:false});    

    }

    insertPageElements() {
        let html = `<div id="page">`;
        html += `<div class="navbar">`;
        html += `<div class='zoom'><img src='../../media/magPlus.png' width='30' id='zoomIn' class='buttonSmall'></img><img src='../../media/magMinus.png' width='30' id='zoomOut' class='buttonSmall'></img></div>`
        html += `<button id='details' class='buttonMed'>details</button>`;
        html += `<button id='directions' class='buttonMed'>directions</button>`;
        html += `<button id='about' class='buttonMed'>about</button>`;
        html += `</div>`;
        html += `<div class="row">`;
        html += `<div id="left" class="column"></div>`;
        html += `<div id="right" class="column"></div>`;
        html += `</div>`;
        html += `</div>`;
        document.body.insertAdjacentHTML("beforeend", html);

        // Insert coefficient table
        html = `<div id="coefficients">`;
        html += `<table>`;
        html += `<th>n</th><th>C<sub>n</sub></th>`;
        for (let row = 1; row < this.MAXCOEFFICIENTS+1; row++) {
            html += `<tr>`;
            html += `<td class="table dark"><input id="n-${row}" class="tableinput" value="${this.NS[row-1]}" placeholder="${row}"></input></td>`;
            html += `<td class="table light"><input id="cn-${row}" class="tableinput" value="${row == 1 ? 1 : 0}" placeholder="0" tabindex="${row}"></input></td>`;
            html += `</tr>`;
        }
        html += `</table>`;
        html += `</div>`;
        document.getElementById("left").insertAdjacentHTML("beforeend", html);

        // Insert buttons
        html = `<div id="buttons">`;
        html += `<button id='resetc'>reset t = 0</button>`;
        html += `<button id='reset'>reset defaults</button>`;
        html += `<button id='togglec'>start/stop</button>`;
        html += `<br>`;
        html += `<button id='measure'>measure E</button>`;
        html += `<button id='integrate'>integrate</button>`;
        html += `</div>`;
        document.getElementById("left").insertAdjacentHTML("beforeend", html);

        // Insert integral box
        html = `<div id="integral">`;
        html += `<table>`
        html += `<th>x<sub>1</sub></th><th>x<sub>2</sub></th><th>integral</th>`;
        html += `<tr><td><input id="x1" class="tableinput" value="${-1}" placeholder="0"></input></td>`;
        html += `<td><input id="x2" class="tableinput" value="${1}" placeholder="0"></input></td>`;
        html += `<td><input id="int" class="tableinput" placeholder="-" readonly></input></td>`;
        html += `</tr></table>`
        html += `</div>`
        document.getElementById("left").insertAdjacentHTML("beforeend", html);

        // Insert sliders
        html = `<div id="sliders" class="row">`;
        html += `<div class="sliderdiv">`;
        html += `<p id="spanmass" class="sliderp">Mass</p>`;
        html += `<input type="range" min="${this.minMass * this.scaleMass}" max="${this.maxMass * this.scaleMass}" value="${this.M * this.scaleMass}" class="slider" id="sldmass">`;
        html += `</div>`
        html += `<div class="sliderdiv">`;
        html += `<p id="spankf" class="sliderp">force constant k<sub>f</sub>&nbsp</p>`;
        html += `<input type="range" min="${this.minKF * this.scaleKF}" max="${this.maxKF * this.scaleKF}" value="${this.KF * this.scaleKF}" class="slider" id="sldkf">`;
        html += `</div>`
        html += `</div>`
        document.getElementById("left").insertAdjacentHTML("beforeend", html);

        // Define graph layouts
        const probgraphinfo = {
            "graphwidth": this.graphWidth,
            "graphheight": this.graphHeight*2.5,
            "padding": {
                "left": this.graphLeft,
                "bottom": this.graphBottom,
                "top": this.graphTop,
                "right": this.graphRight
            },
            "graphbackground": "white",
            "axesbackground": "white",
            "x": {
                "label": "x - x<sub>0</sub>",
                "min": this.xbounds[0],
                "max": this.xbounds[1],
                "majortick": 1,
                "minortick": 1,
                "gridline": 2,
            },
            "y": {
                "label": "",
                "min": 0,
                "max": 70,
                "majortick": 10,
                "minortick": 10,
                "gridline": 70,
            }
        };

        const compgraphinfo = {
            "graphwidth": this.graphWidth,
            "graphheight": this.graphHeight,
            "padding": {
                "left": this.graphLeft,
                "bottom": this.graphBottom,
                "top": this.graphTop,
                "right": this.graphRight
            },
            "graphbackground": "white",
            "axesbackground": "white",
            "x": {
                "label": "x - x<sub>0</sub>",
                "min": this.xbounds[0],
                "max": this.xbounds[1],
                "majortick": 1,
                "minortick": 1,
                "gridline": 2,
            },
            "y": {
                "label": "",
                "min": -3,
                "max": 3,
                "majortick": 1,
                "minortick": 1,
                "gridline": 3,
            }
        };

        // Create graphs
        document.getElementById("right").insertAdjacentHTML("beforeend", `<span class="graphtitle">Energy and Probability Density |ψ|² (=ψ*ψ)</span>`);
        this.densitygc = new GraphCanvas("density-gc", "right", {
            graphinfo: probgraphinfo,
        });

        document.getElementById("left").insertAdjacentHTML("beforeend", `<span class="graphtitle">Real & Imaginary Components</span>`);
        this.componentgc = new GraphCanvas("component-gc", "left", {
            graphinfo: compgraphinfo,
        });
    }

    attachListeners() {
        // Buttons
        document.getElementById('togglec').addEventListener("click", () => this.toggleRunning());
        document.getElementById('resetc').addEventListener("click", () => this.resetTime());
        document.getElementById('reset').addEventListener("click", () => location.reload());
        document.getElementById('measure').addEventListener("click", () => this.measureE());
        document.getElementById('integrate').addEventListener("click", () => this.integrate());
        // Input events
        for (let i = 1; i <= this.MAXCOEFFICIENTS; i++) {
            document.getElementById(`n-${i}`).addEventListener("input", () => this.getNs());
            document.getElementById(`cn-${i}`).addEventListener("input", () => this.getCoefficients());
        }
        document.getElementById('sldmass').addEventListener("input", () => this.getMass());
        document.getElementById('sldkf').addEventListener("input", () => this.getKF());
        document.getElementById('details').addEventListener("click", () => this.modalDetails.show());
        document.getElementById('directions').addEventListener("click", () => this.modalDirections.show());
        document.getElementById('about').addEventListener("click", () => this.modalAbout.show());
        document.getElementById('zoomIn').addEventListener("click", () => {this.SCALE *= 1.125; this.scaleBody(this.SCALE);});
        document.getElementById('zoomOut').addEventListener("click", () => {this.SCALE /= 1.125; this.scaleBody(this.SCALE);});
    }

    nextFrame() {
        if (this.RUNNING) this.update();
    }

    update() {
        this.T += this.TSTEP;
        this.calculatePsi();
        this.clearGraphs();
        this.drawGraphs();
    }

    calculatePsi() {
        const hb = 0.1; // h-bar
        this.PSI = [];
        this.PROBS = [];
        this.RES = [];
        this.IMS = [];

        const freqs = this.NS.map(n => (n + 0.5) * math.sqrt(this.KF / this.M));
        const PhaseShifts = freqs.map(freq => math.exp(math.complex(0, - freq * this.T)));

        const alpha = math.pow(hb*hb/(this.M*this.KF), 0.25);
        const yArr = this.XS.map(x => x / alpha);
        const eArr = yArr.map(y => math.exp(-0.5*math.pow(y, 2)));

        for (let i = 0; i < this.coefficients.length; i++) {
            const Nv = math.divide(1, math.sqrt(math.prod(alpha, math.pow(2, this.NS[i]), math.factorial(this.NS[i]), math.pow(math.PI, 0.5))));
            for (let j = 0; j < this.XS.length; j++) {
                const y = yArr[j];
                const Hv = hermites(this.NS[i], y);
                const e = eArr[j];
                if(i == 0) {
                    // calculates the initial state, pushes to PSI array
                    this.PSI.push(math.prod(this.scaledcoefficients[i], Nv, Hv, e));
                    // converts the initial state to a complex value, multiplies by phase shift
                    this.PSI[j] = math.complex(math.prod(this.PSI[j], math.re(PhaseShifts[i])), math.prod(this.PSI[j], math.im(PhaseShifts[i])));
                    // probability is the product of complex and its conjugate
                    this.PROBS.push(math.re(math.prod(this.PSI[j], math.conj(this.PSI[j]))));      
                    this.RES.push(math.re(this.PSI[j]));
                    this.IMS.push(math.im(this.PSI[j]));              
                }
                else {
                    this.PSI[j].re += math.prod(this.scaledcoefficients[i], Nv, Hv, e, math.re(PhaseShifts[i]));
                    this.PSI[j].im += math.prod(this.scaledcoefficients[i], Nv, Hv, e, math.im(PhaseShifts[i]));
                    this.RES[j] = math.re(this.PSI[j]);
                    this.IMS[j] = math.im(this.PSI[j]);
                    this.PROBS[j] += math.re(math.prod(this.PSI[j], math.conj(this.PSI[j])));
                }
            }
        }

        this.ENERGY = 0;
        for (let i = 0; i < this.MAXCOEFFICIENTS; i++) {
            const level = (this.NS[i] + 0.5) * math.sqrt(this.KF/this.M) * (6.62 / (1.67*2*math.PI)) * 3.16 * 6.022 * 100 / 1000;
            this.ENERGY += level * this.scaledcoefficients[i];
        }
        for (let i = 0; i < this.XS.length; i++) {this.PROBS[i] += this.ENERGY}
    }

    clearGraphs() {
        this.densitygc.clear();
        this.componentgc.clear();
    }

    drawGraphs() {
        for (let i = 0; i < this.MAXCOEFFICIENTS; i++) {
            const level = (this.NS[i] + 0.5) * math.sqrt(this.KF/this.M) * (6.62 / (1.67*2*math.PI)) * 3.16 * 6.022 * 100 / 1000;
            this.densitygc.drawLine(this.xbounds, [level,level], hsvToRgb(0,0,0), 1, [3, 3]);
        }
        //
        //
        this.densitygc.drawLine(this.xbounds, [this.ENERGY, this.ENERGY], hsvToRgb(0,100,100), 3);
        this.densitygc.drawLine(this.XS, this.PROBS, hsvToRgb(0,0,0), 3);

        this.componentgc.drawText('Re', 0.93, 2.8, {'color':'blue'});
        this.componentgc.drawText('Im', 0.93, 2.3, {'color':'red'});
        this.componentgc.drawLine(this.XS, this.RES, hsvToRgb(220,100,100), 3);
        this.componentgc.drawLine(this.XS, this.IMS, hsvToRgb(0,100,100), 3);
    }

    toggleRunning() {
        this.RUNNING = !this.RUNNING;
    }

    resetTime() {
        this.RUNNING = false;
        this.T = 0;
        this.getCoefficients();
        this.T -= this.TSTEP;
        this.update();
    }

    measureE() {
        this.getCoefficients();
        let cumsum = [];
        let levels = [];
        for (let i = 0; i < this.MAXCOEFFICIENTS; i++) {
            levels.push(0);
            const last = i > 0 ? cumsum[i-1] : 0;
            cumsum.push(last + this.scaledcoefficients[i])
        }
        const probe = Math.random();
        for (let i = 0; i < this.MAXCOEFFICIENTS; i++) {
            if (probe < cumsum[i]) {
                levels[i] = 1;
                break;
            }
        }
        this.coefficients = levels;
        this.update();
    }

    riemanntrapezoid(x, y, x1, x2, draw=false) {
        let int = 0;
        for (let i = 0; i < x.length; i+=1) {
            if (x[i] >= x1 && x[i+1] <= x2) {
                int += (y[i] + y[i+1] - 2 * this.ENERGY) / 2 * (x[i+1] - x[i]);
                if (draw) this.densitygc.fillLine([x[i], x[i], x[i+1], x[i+1]], [this.ENERGY, y[i], y[i+1], this.ENERGY], hsvToRgb(0,100,100));
            }
        }
        return int;
    }

    integrate() {
        this.RUNNING = false;
        this.clearGraphs();
        const x1 = Number(document.getElementById('x1').value);
        const x2 = Number(document.getElementById('x2').value);
        const fullint = this.riemanntrapezoid(this.XS, this.PROBS, -2, 2, false);
        const int = this.riemanntrapezoid(this.XS, this.PROBS, x1, x2, true) / fullint;
        this.drawGraphs();
        const digits = 4;
        document.getElementById('int').value = Math.round(int * (10 ** digits), digits) / (10 ** digits);
    }

    getCoefficients() {
        this.coefficients = [];
        this.scaledcoefficients = [];
        let sum = 0;
        for (let i = 1; i <= this.MAXCOEFFICIENTS; i++) {
            const val = parseFloat(document.getElementById(`cn-${i}`).value);
            this.coefficients.push(val);
            this.scaledcoefficients.push(val);
            sum += val;
        }
        this.scaledcoefficients.forEach((value, index, array) => array[index] /= sum);
        this.T -= this.TSTEP;
        this.update();
    }

    getNs() {
        this.NS = [];
        for (let i = 1; i <= this.MAXCOEFFICIENTS; i++) {
            let val = parseFloat(document.getElementById(`n-${i}`).value);
            if(val > 20) {val = 20; document.getElementById(`n-${i}`).value = 20}
            this.NS.push(val);
        }
        this.T -= this.TSTEP;
        this.update();
    }

    getMass() {
        const value = document.getElementById("sldmass").value / this.scaleMass;
        document.getElementById("spanmass").innerHTML = `mass: ${value}`;
        this.M = value;
        this.T -= this.TSTEP;
        this.update();
    }

    getKF() {
        const value = document.getElementById("sldkf").value / this.scaleKF;
        document.getElementById("spankf").innerHTML = `force constant k<sub>f</sub>&nbsp: ${value}`;
        this.KF = value;
        this.T -= this.TSTEP;
        this.update();
    }

    scaleBody() {scale(this.SCALE);}
}

function hermites(n, xx) {
    let eqns = {
    "0": `${1}`,
    "1": `${2*xx}`,
    "2": `${-2 + 4*Math.pow(xx, 2) }`,
    "3": `${-12*xx + 8*Math.pow(xx, 3) }`,
    "4": `${12 - 48*Math.pow(xx, 2) + 16*Math.pow(xx, 4) }`,
    "5": `${120*xx - 160*Math.pow(xx, 3) + 32*Math.pow(xx, 5) }`,
    "6": `${-120 + 720*Math.pow(xx, 2) - 480*Math.pow(xx, 4) + 64*Math.pow(xx, 6) }`,
    "7": `${-1680*xx + 3360*Math.pow(xx, 3) - 1344*Math.pow(xx, 5) + 128*Math.pow(xx, 7) }`,
    "8": `${1680 - 13440*Math.pow(xx, 2) + 13440*Math.pow(xx, 4) - 3584*Math.pow(xx, 6) + 256*Math.pow(xx, 8) }`,
    "9": `${30240*xx - 80640*Math.pow(xx, 3) + 48384*Math.pow(xx, 5) - 9216*Math.pow(xx, 7) + 512*Math.pow(xx, 9) }`,
    "10": `${-30240 + 302400*Math.pow(xx, 2) - 403200*Math.pow(xx, 4) + 161280*Math.pow(xx, 6) - 23040*Math.pow(xx, 8) + 1024*Math.pow(xx, 10) }`,
    "11": `${-665280*xx + 2217600*Math.pow(xx, 3) - 1774080*Math.pow(xx, 5) + 506880*Math.pow(xx, 7) - 56320*Math.pow(xx, 9) + 2048*Math.pow(xx, 11) }`,
    "12": `${665280 - 7983360*Math.pow(xx, 2) + 13305600*Math.pow(xx, 4) - 7096320*Math.pow(xx, 6) + 1520640*Math.pow(xx, 8) - 135168*Math.pow(xx, 10) + 4096*Math.pow(xx, 12) }`,
    "13": `${17297280*xx - 69189120*Math.pow(xx, 3) + 69189120*Math.pow(xx, 5) - 26357760*Math.pow(xx, 7) + 4392960*Math.pow(xx, 9) - 319488*Math.pow(xx, 11) + 8192*Math.pow(xx, 13) }`,
    "14": `${-17297280 + 242161920*Math.pow(xx, 2) - 484323840*Math.pow(xx, 4) + 322882560*Math.pow(xx, 6) - 92252160*Math.pow(xx, 8) + 12300288*Math.pow(xx, 10) - 745472*Math.pow(xx, 12) + 16384*Math.pow(xx, 14) }`,
    "15": `${-518918400*xx + 2421619200*Math.pow(xx, 3) - 2905943040*Math.pow(xx, 5) + 1383782400*Math.pow(xx, 7) - 307507200*Math.pow(xx, 9) + 33546240*Math.pow(xx, 11) - 1720320*Math.pow(xx, 13) + 32768*Math.pow(xx, 15) }`,
    "16": `${518918400 - 8302694400*Math.pow(xx, 2) + 19372953600*Math.pow(xx, 4) - 15498362880*Math.pow(xx, 6) + 5535129600*Math.pow(xx, 8) - 984023040*Math.pow(xx, 10) + 89456640*Math.pow(xx, 12) - 3932160*Math.pow(xx, 14) + 65536*Math.pow(xx, 16) }`,
    "17": `${17643225600*xx - 94097203200*Math.pow(xx, 3) + 131736084480*Math.pow(xx, 5) - 75277762560*Math.pow(xx, 7) + 20910489600*Math.pow(xx, 9) - 3041525760*Math.pow(xx, 11) + 233963520*Math.pow(xx, 13) - 8912896*Math.pow(xx, 15) + 131072*Math.pow(xx, 17) }`,
    "18": `${-17643225600 + 317578060800*Math.pow(xx, 2) - 846874828800*Math.pow(xx, 4) + 790416506880*Math.pow(xx, 6) - 338749931520*Math.pow(xx, 8) + 75277762560*Math.pow(xx, 10) - 9124577280*Math.pow(xx, 12) + 601620480*Math.pow(xx, 14) - 20054016*Math.pow(xx, 16) + 262144*Math.pow(xx, 18) }`,
    "19": `${-670442572800*xx + 4022655436800*Math.pow(xx, 3) - 6436248698880*Math.pow(xx, 5) + 4290832465920*Math.pow(xx, 7) - 1430277488640*Math.pow(xx, 9) + 260050452480*Math.pow(xx, 11) - 26671841280*Math.pow(xx, 13) + 1524105216*Math.pow(xx, 15) - 44826624*Math.pow(xx, 17) + 524288*Math.pow(xx, 19) }`,
    "20": `${670442572800 - 13408851456000*Math.pow(xx, 2) + 40226554368000*Math.pow(xx, 4) - 42908324659200*Math.pow(xx, 6) + 21454162329600*Math.pow(xx, 8) - 5721109954560*Math.pow(xx, 10) + 866834841600*Math.pow(xx, 12) - 76205260800*Math.pow(xx, 14) + 3810263040*Math.pow(xx, 16) - 99614720*Math.pow(xx, 18) + 1048576*Math.pow(xx, 20) }`
    };
    return eqns[n];
}

window['Simulation'] = new Sim();