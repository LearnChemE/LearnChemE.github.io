import {hsvToRgb} from './hsvToRgb.js';
// import * as math from './math.js';
import {linspace} from './sky-helpers.js';

export class animCanvas {
    constructor(args) {
        // Default values
        this.name = '';
        this.Tinit = 0;
        this.Tmax = 1;
        this.fps = 60;
        this.running = true;
        this.loops = true;
        this.points = 100;
        this.nextUpdate = (new Date).getTime();
        // Apply arguments
        if (args) {
            for (let key of Object.keys(args)) {
                this[key] = args[key];
            }
        }
        if (this.canvas === undefined) {
            console.log('ERROR making animCanvas, must provide canvas');
        } else {
            this.ctx = this.canvas.getContext("2d");
        }
        this.T = this.Tinit;
        this.updateCoefficients();
    }

    reset() {
        this.T = this.Tinit;
    }

    updateCoefficients() {
        // pull coefficients from table
        let coeffs = [];
        let sum = 0;
        for (let i = 1; i < 7; i++) {
            const val = parseFloat(document.getElementById(`cn-${i}`).value);
            coeffs.push(val);
            sum += val;
        }
        coeffs.forEach((value, index, array) => array[index] /= sum);
        this.coefficients = coeffs;
    }

    update() {
        if (this.running) {
            // Wait for next frame
            if ((new Date).getTime() > this.nextUpdate) {
                // Set next update
                this.nextUpdate += 1000 / this.fps;

                // Step through time
                this.T += 1 / this.fps;
                if (this.loops) {
                    if (this.T > this.Tmax) {
                        this.T = this.Tinit;
                    }
                }

                // copy matlab code

                const L = 1;
                const m = 1;
                const xs = linspace(0, 1, 100 + 1, true);
                const ns = [1, 2, 3, 4, 5, 6];

                // Superimpose
                // let psi = [];
                // for (let x of xs) {
                //     let v = 0;
                //     for (let i = 0; i < this.coefficients.length; i++) {
                //         v += math.sqrt(2 / L) * math.sin(ns[i] * this.coefficients[i] * math.PI * x)
                //     }
                //     psi.push(v)
                // }

                // EvolvePsi
                let freqs = [];
                let PhaseShifts = [];
                for (let i = 0; i < this.coefficients.length; i++) {
                    const freq = 2 * math.PI * math.pow(ns[i] / (m * L), 2);
                    freqs.push(freq)
                    const ps = math.exp(math.complex(0,freq * this.T));
                    PhaseShifts.push(ps);
                }
                let psi = [];
                for (let x of xs) {
                    let TimeEvolved = [];
                    for (let i = 0; i < this.coefficients.length; i++) {
                        const InitialState = math.sqrt(2 / L) * math.sin(ns[i] * math.pi * x)
                        const WeightedState = InitialState * this.coefficients[i];
                        TimeEvolved.push(math.prod(WeightedState, PhaseShifts[i]));
                    }
                    psi.push(math.sum(TimeEvolved));
                }

                // Clear canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Draw functions
                if (this.components) {
                    const color = hsvToRgb(0,0,0);
                    this.ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
                    this.ctx.beginPath();
                    for (let i = 0; i < xs.length; i++) {
                        const x = xs[i];
                        const y = -math.prod(psi[i], math.conj(psi[i]));
                        const drawx = (x - this.bounds.x.min) * this.canvas.width / (this.bounds.x.max - this.bounds.x.min);
                        const drawy = (y - this.bounds.y.min) * this.canvas.height / (this.bounds.y.max - this.bounds.y.min);
                        this.ctx.lineTo(drawx, drawy);
                    }
                    this.ctx.stroke();
                }

                if (this.sum) {
                    let color = hsvToRgb(220,255,255);
                    this.ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
                    this.ctx.beginPath();
                    for (let i = 0; i < xs.length; i++) {
                        const x = xs[i];
                        const y = math.re(psi[i]);
                        const drawx = (x - this.bounds.x.min) * this.canvas.width / (this.bounds.x.max - this.bounds.x.min);
                        const drawy = (y - this.bounds.y.min) * this.canvas.height / (this.bounds.y.max - this.bounds.y.min);
                        this.ctx.lineTo(drawx, drawy);
                    }
                    this.ctx.stroke();
                    color = hsvToRgb(0,255,255);
                    this.ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
                    this.ctx.beginPath();
                    for (let i = 0; i < xs.length; i++) {
                        const x = xs[i];
                        const y = math.im(psi[i]);
                        const drawx = (x - this.bounds.x.min) * this.canvas.width / (this.bounds.x.max - this.bounds.x.min);
                        const drawy = (y - this.bounds.y.min) * this.canvas.height / (this.bounds.y.max - this.bounds.y.min);
                        this.ctx.lineTo(drawx, drawy);
                    }
                    this.ctx.stroke();
                }

                // end matlab code

                // // Draw components
                // if (this.components) {
                //     const maxn = this.coefficients.filter(n => n != 0).length;
                //     let i = 0;
                //     for (let c in this.coefficients) {
                //         if (this.coefficients[c] != 0) {
                //             this.ctx.lineWidth = 1;
                //             const color = hsvToRgb(i++ / maxn * 255,255,255);
                //             this.ctx.strokeStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
                //             this.ctx.beginPath();
                //             for (let i = 0; i <= this.points; i++) {
                //                 const x = (i / this.points) * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min;
                //                 const t = this.T;
                //                 const y = this.f(x, t, this.coefficients[c]);
                //                 const drawx = (x - this.bounds.x.min) * this.canvas.width / (this.bounds.x.max - this.bounds.x.min);
                //                 const drawy = (y - this.bounds.y.min) * this.canvas.height / (this.bounds.y.max - this.bounds.y.min);
                //                 this.ctx.lineTo(drawx, drawy);
                //                 this.ctx.stroke();
                //             }
                //         }
                //     }
                // }

                // // Draw sum
                // if (this.sum) {
                //     this.ctx.lineWidth = 1;
                //     this.ctx.strokeStyle = "black";
                //     this.ctx.beginPath();
                //     for (let i = 0; i <= this.points; i++) {
                //         const x = (i / this.points) * (this.bounds.x.max - this.bounds.x.min) + this.bounds.x.min;
                //         const t = this.T;
                //         let y = 0;
                //         for (let c in this.coefficients) {
                //             if (this.coefficients[c] != 0) {
                //                 y += this.f(x, t, this.coefficients[c]);
                //             }
                //         }
                //         const drawx = (x - this.bounds.x.min) * this.canvas.width / (this.bounds.x.max - this.bounds.x.min);
                //         const drawy = (y - this.bounds.y.min) * this.canvas.height / (this.bounds.y.max - this.bounds.y.min);
                //         this.ctx.lineTo(drawx, drawy);
                //         this.ctx.stroke();
                //     }
                // }

                // Draw current time
//                this.ctx.fillStyle = "green";
//                this.ctx.font = "30px sans-serif";
//                this.ctx.fillText("t=" + this.T.toFixed(2), 5, 30);

            }
            // Request frame from window
            window.requestAnimationFrame(this.update.bind(this));
        }
    }

    start() {
        this.running = true;
        this.update();
    }

    stop() {
        this.running = false;
    }

    toggle() {
        this.running = !this.running;
        this.update();
    }
}