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
        this.changeCoefficients();
        this.getNs();
        this.getMass();
        this.getLength();
        this.T = 0;this.T -= this.TSTEP;
        this.update();
        var modalFiles = [];
        modalFiles.push(modalFill(this.modalDetails,'../html/modalHTML/pib1DetailsContent.html.txt'));
        modalFiles.push(modalFill(this.modalDirections,'../html/modalHTML/pib1DirectionsContent.html.txt'));
        modalFiles.push(modalFill(this.modalAbout,'../html/modalHTML/pib1AboutContent.html.txt'));
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
          });
        this.scaleBody(this.SCALE);
    }

    defineGlobals() {
        this.RUNNING = false;
        this.FPS = 60;
        this.T = 0;
        this.TSTEP = 0.2 / this.FPS;

        this.minMass = 0.1;
        this.maxMass = 10;
        this.minLength = 1;
        this.maxLength = 10;
        this.scaleMass = 100; // Sliders cannot use floats
        this.scaleLength = 100; // Sliders cannot use floats

        this.graphWidth = 420;
        this.graphHeight = 280;
        this.rightGraphHeight = 240;
        this.bigGraphHeight = 600;
        this.graphLeft = 30;
        this.graphRight = 10;
        this.graphTop = 10;
        this.graphBottom = 50;
        this.xbounds = [0, 1];

        this.separate = true;

        this.MAXCOEFFICIENTS = 6;
        this.NS = linspace(1, this.MAXCOEFFICIENTS, this.MAXCOEFFICIENTS, true);
        this.POINTS = 500;

        this.XS = linspace(this.xbounds[0], this.xbounds[1], this.POINTS + 1, true);
        this.L = 1;
        this.M = 1;
        this.PROBS = [];
        this.RES = [];
        this.IMS = [];

        this.SCALE = Math.min(1, window.innerWidth/1000);

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
        html += `<button id='measure' style='width:250px;'>measure E<br>(probabilistic collapse)</button>`;
        html += `<button id='integrate'>integrate</button>`;
        html += `</div>`;
        document.getElementById("left").insertAdjacentHTML("beforeend", html);

        // Insert integral box
        html = `<div id="integral">`;
        html += `<table>`
        html += `<th>x<sub>1</sub></th><th>x<sub>2</sub></th><th>integral</th>`;
        html += `<tr><td><input id="x1" class="tableinput" value="${0}" placeholder="0"></input></td>`;
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
        html += `<p id="spanlength" class="sliderp">Length</p>`;
        html += `<input type="range" min="${this.minLength * this.scaleLength}" max="${this.maxLength * this.scaleLength}" value="${this.L * this.scaleLength}" class="slider" id="sldlength">`;
        html += `</div>`
        html += `</div>`
        document.getElementById("left").insertAdjacentHTML("beforeend", html);

        // Define graph layouts
        let probgraphinfo = {
            "graphwidth": this.graphWidth,
            "graphheight": this.rightGraphHeight,
            "padding": {
                "left": this.graphLeft,
                "bottom": this.graphBottom,
                "top": this.graphTop,
                "right": this.graphRight
            },
            "graphbackground": "white",
            "axesbackground": "white",
            "x": {
                "label": "x / L",
                "min": this.xbounds[0],
                "max": this.xbounds[1],
                "majortick": 0.2,
                "minortick": 0.2,
                "gridline": 1,
            },
            "y": {
                "label": "",
                "min": 0,
                "max": 5,
                "majortick": 1,
                "minortick": 1,
                "gridline": 5,
            }
        };

        let compgraphinfo = {
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
                "label": "x / L",
                "min": this.xbounds[0],
                "max": this.xbounds[1],
                "majortick": 0.2,
                "minortick": 0.2,
                "gridline": 1,
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

        let energygraphinfo = {
            "graphwidth": this.graphWidth,
            "graphheight": this.rightGraphHeight,
            "padding": {
                "left": this.graphLeft,
                "bottom": this.graphBottom,
                "top": this.graphTop,
                "right": this.graphRight
            },
            "graphbackground": "white",
            "axesbackground": "white",
            "x": {
                "label": "x / L",
                "min": this.xbounds[0],
                "max": this.xbounds[1],
                "majortick": 0.2,
                "minortick": 0.2,
                "gridline": 1,
            },
            "y": {
                "label": "",
                "min": 0,
                "max": 60,
                "majortick": 10,
                "minortick": 10,
                "gridline": 60,
            }
        };

        let combinedgraphinfo = {
            "graphwidth": this.graphWidth - 10,
            "graphheight": this.bigGraphHeight,
            "padding": {
                "left": this.graphLeft + 10,
                "bottom": this.graphBottom,
                "top": this.graphTop,
                "right": this.graphRight
            },
            "graphbackground": "white",
            "axesbackground": "white",
            "x": {
                "label": "x / L",
                "min": this.xbounds[0],
                "max": this.xbounds[1],
                "majortick": 0.2,
                "minortick": 0.2,
                "gridline": 1,
            },
            "y": {
                "label": "",
                "min": 0,
                "max": 150,
                "majortick": 10,
                "minortick": 10,
                "gridline": 60,
            }
        };

        // Create graphs
        document.getElementById("right").insertAdjacentHTML("beforeend", `<button id='switchGraph' class='buttonMed' style='align-self:center;transform:translateY(-20px);width:300px;'>show as single plot</button>`);
        document.getElementById("right").insertAdjacentHTML("beforeend", `<span class="graphtitle" id="pdtitle">Probability Density |ψ|² (=ψ*ψ)</span>`);
        this.densitygc = new GraphCanvas("density-gc", "right", {
            graphinfo: probgraphinfo,
        });

        document.getElementById("left").insertAdjacentHTML("beforeend", `<span class="graphtitle">Real & Imaginary Components</span>`);
        this.componentgc = new GraphCanvas("component-gc", "left", {
            graphinfo: compgraphinfo,
        });

        document.getElementById("right").insertAdjacentHTML("beforeend", `<span class="graphtitle" id="energytitle" style="margin-top:30px;">Energy (kJ / mol)</span>`);
        this.energygc = new GraphCanvas("energy-gc", "right", {
            graphinfo: energygraphinfo,
        });
        document.getElementById("right").insertAdjacentHTML("beforeend", `<span class="graphtitle" id="combtitle">Energy (kJ / mol)</span>`);
        this.combinedgc = new GraphCanvas("combined-gc", "right", {
            graphinfo: combinedgraphinfo,
        });
        // document.getElementById('combined-gc').style.transform = `translateY(${this.getCoords('combtitle').bottom - this.getCoords('combined-gc').top}px)`;
        document.getElementById('combined-gc').style.display = 'none';
        document.getElementById('combtitle').style.display = 'none';
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
            document.getElementById(`n-${i}`).addEventListener("input", () => this.changeCoefficients());
            document.getElementById(`cn-${i}`).addEventListener("input", () => this.changeCoefficients());
        }
        document.getElementById('sldmass').addEventListener("input", () => this.getMass());
        document.getElementById('sldlength').addEventListener("input", () => this.getLength());
        document.getElementById('details').addEventListener("click", () => this.modalDetails.show());
        document.getElementById('directions').addEventListener("click", () => this.modalDirections.show());
        document.getElementById('about').addEventListener("click", () => this.modalAbout.show());
        document.getElementById('zoomIn').addEventListener("click", () => {this.SCALE *= 1.125; this.scaleBody(this.SCALE);});
        document.getElementById('zoomOut').addEventListener("click", () => {this.SCALE /= 1.125; this.scaleBody(this.SCALE);});
        document.getElementById('switchGraph').addEventListener("click", () => {this.switchGraph()});
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
        const freqs = this.NS.map(n => 2 * math.pi * math.pow(n / this.L, 2) / this.M); /*Proportional to n^2/(m L^2)*/
        const PhaseShifts = freqs.map(freq => math.exp(math.complex(0, - freq * this.T)));

        // let InitialStates = math.multiply(math.dotMultiply(math.transpose(math.matrix([this.NS])), math.pi), math.matrix([this.XS]));
        // InitialStates = InitialStates.forEach(function (value, index, matrix) {return math.sqrt(2 / 1) * math.sin(value * math.PI)});

        this.PSI = [];
        this.PROBS = [];
        for (let x of this.XS) {
            let TimeEvolved = [];
            for (let i = 0; i < this.coefficients.length; i++) {
                const InitialState = math.sqrt(2 / this.L) * math.sin(this.NS[i] * math.pi * x)
                const WeightedState = InitialState * this.coefficients[i];
                const te = math.prod(WeightedState, PhaseShifts[i]);
                TimeEvolved.push(te);
            }
            let psi = math.sum(TimeEvolved);
            // psi = math.re(math.prod(math.conj(psi), psi));
            this.PSI.push(psi);
            this.PROBS.push(math.re(math.prod(psi, math.conj(psi))));
        }

        const int = this.riemanntrapezoid(this.XS, this.PROBS, 0, 1, false);
        this.NORMPSI = [];
        for (let psi of this.PSI) {
            this.NORMPSI.push(math.divide(psi, (int * this.L) ** 0.5))
        }

        this.PROBS = [];
        this.drawPROBS = [];
        this.RES = [];
        this.IMS = [];
        for (let psi of this.NORMPSI) {
            this.PROBS.push(math.re(math.prod(psi, math.conj(psi))));
            this.RES.push(math.re(psi));
            this.IMS.push(math.im(psi));
        }
        this.ENERGY = 0;
        for (let i = 0; i < this.MAXCOEFFICIENTS; i++) {
            const level = this.NS[i] ** 2 / (8 * 1.67 * this.L) ** 2 * 6.62 ** 2 * 6.02 / this.M;
            this.ENERGY += level * this.scaledcoefficients[i];
        }
        if(!this.separate) {
        const pmax = math.max(this.PROBS);
            for (let p of this.PROBS) {
                this.drawPROBS.push(10*(p/pmax) + this.ENERGY);
            }
        }
    }

    clearGraphs() {
        this.densitygc.clear();
        this.combinedgc.clear();
        this.componentgc.clear();
        this.energygc.clear();
    }

    drawGraphs() {
        if(this.separate) {
            this.densitygc.drawLine(this.XS, this.PROBS, hsvToRgb(0,0,0), 3);
        } else {
            this.combinedgc.drawLine(this.XS, this.drawPROBS, hsvToRgb(0,0,0), 3);
        }
        this.componentgc.drawText('Re', 0.93, 2.8, {'color':'blue'});
        this.componentgc.drawText('Im', 0.93, 2.3, {'color':'red'});
        this.componentgc.drawLine(this.XS, this.RES, hsvToRgb(220,100,100), 3);
        this.componentgc.drawLine(this.XS, this.IMS, hsvToRgb(0,100,100), 3);

        for (let i = 0; i < this.MAXCOEFFICIENTS; i++) {
            const level = this.NS[i] ** 2 / (8 * 1.67 * this.L) ** 2 * 6.62 ** 2 * 6.02 / this.M;
            if(this.separate){
                this.energygc.drawLine(this.xbounds, [level,level], hsvToRgb(0,0,0), 1, [2, 2]);
            } else {
                this.combinedgc.drawLine(this.xbounds, [level,level], hsvToRgb(0,0,0), 1, [2, 2]);
            }
        }
        if(this.separate){
            this.energygc.drawLine(this.xbounds, [this.ENERGY,this.ENERGY], hsvToRgb(0,100,100), 3);
        } else {
            this.combinedgc.drawLine(this.xbounds, [this.ENERGY,this.ENERGY], hsvToRgb(0,100,100), 3);
        }
    }

    switchGraph() {
        this.separate = !this.separate;
        if(this.separate) {
            document.getElementById('switchGraph').innerText = 'show as single plot';
            document.getElementById('density-gc').style.display = 'block';
            document.getElementById('energy-gc').style.display = 'block';
            document.getElementById('combined-gc').style.display = 'none';
            document.getElementById('pdtitle').style.display = 'block';
            document.getElementById('energytitle').style.display = 'block';
            document.getElementById('combtitle').style.display = 'none';
        } else {
            document.getElementById('switchGraph').innerText = 'show as separate plots';
            document.getElementById('density-gc').style.display = 'none';
            document.getElementById('energy-gc').style.display = 'none';
            document.getElementById('combined-gc').style.display = 'block';
            document.getElementById('pdtitle').style.display = 'none';
            document.getElementById('energytitle').style.display = 'none';
            document.getElementById('combtitle').style.display = 'block';
        }

        this.T -= this.TSTEP;
        this.update();
    }

    toggleRunning() {
        this.RUNNING = !this.RUNNING;
        this.changeCoefficients();
    }

    resetTime() {
        this.RUNNING = false;
        this.T = 0;
        this.getCoefficients();
        this.T -= this.TSTEP;
        this.update();
    }

    changeCoefficients() {
        this.getNs();
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
        this.scaledcoefficients = levels;
        this.T = -this.TSTEP;
        this.RUNNING = false;
        this.update();
    }

    riemanntrapezoid(x, y, x1, x2, draw=false) {
        let int = 0;
        for (let i = 0; i < x.length; i+=1) {
            if (x[i] >= x1 && x[i+1] <= x2) {
                int += (y[i] + y[i+1]) / 2 * (x[i+1] - x[i]);
                if (draw && this.separate) this.densitygc.fillLine([x[i], x[i], x[i+1], x[i+1]], [0, y[i], y[i+1], 0], hsvToRgb(0,100,100));
                if (draw && !this.separate) this.combinedgc.fillLine([x[i], x[i], x[i+1], x[i+1]], [this.ENERGY, y[i], y[i+1], this.ENERGY], hsvToRgb(0,100,100));
            }
        }
        return int;
    }

    integrate() {
        this.RUNNING = false;
        this.clearGraphs();
        const x1 = Number(document.getElementById('x1').value);
        const x2 = Number(document.getElementById('x2').value);
        let int;
        if(!this.separate) {
            int = this.riemanntrapezoid(this.XS, this.PROBS, x1, x2, false) / this.riemanntrapezoid(this.XS, this.PROBS, 0, 1, false);
            this.riemanntrapezoid(this.XS, this.drawPROBS, x1, x2, true);
        } else {
            const fullint = this.riemanntrapezoid(this.XS, this.PROBS, 0, 1, false);
            int = this.riemanntrapezoid(this.XS, this.PROBS, x1, x2, true) / fullint;
        }
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
    }

    getNs() {
        this.NS = [];
        for (let i = 1; i <= this.MAXCOEFFICIENTS; i++) {
            let val = parseFloat(document.getElementById(`n-${i}`).value);
            if (val == 0) val = i;
            this.NS.push(val);
        }
    }

    setCoefficients(coefficients) {
        for (let i = 0; i < this.MAXCOEFFICIENTS; i++) {
            document.getElementById(`cn-${i+1}`).value = coefficients[i];
        }
    }

    getMass() {
        const value = document.getElementById("sldmass").value / this.scaleMass;
        document.getElementById("spanmass").innerHTML = `Mass: ${value}`;
        this.M = value;
        this.T -= this.TSTEP;
        this.update();
    }

    getLength() {
        const value = document.getElementById("sldlength").value / this.scaleLength;
        document.getElementById("spanlength").innerHTML = `Length: ${value}`;
        this.L = value;
        this.T -= this.TSTEP;
        this.update();
    }

    scaleBody() {scale(this.SCALE);}

    getCoords(id) {
        let elem = document.getElementById(id);
        let box = elem.getBoundingClientRect();
      
        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset,
          bottom: box.top + pageYOffset + box.height,
          right: box.left + pageXOffset + box.width,
          height: box.height,
          width: box.width
        };
      }
}

// eslint-disable-next-line no-unused-vars
window.Simulation = new Sim();