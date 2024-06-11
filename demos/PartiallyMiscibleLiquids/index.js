window.g = {
    cnv: undefined,

    // Slider vars
    temp: 385,
    xa: .5,

    // Colors
    orange: [255, 80, 0],
    pink: [250, 0, 200],
    blue: [0, 0, 150],
    green: [0, 80, 0],

    // Graph frame
    lx: 80,
    rx: 620,
    ty: 40,
    by: 380,

    w: 540,
    h: 340,

    minY: 360,
    maxY: 432,
    maxInputY: 148,

    totalParticles: 50,
    currParticles: 0,
    particleList1: Array(50),
    particleList2: Array(50),
    particleList3: Array(50),
    particleList4: Array(50),

    hmax: 108,
    h1: 0,
    h2: 0,
    h3: 0,
}

function setup() {
    g.cnv = createCanvas(700, 420);
    g.cnv.parent("graphics-wrapper");

    let i;
    for (i = 0; i < g.totalParticles; i++) {
        g.particleList1[i] = new Particle(1);
        g.particleList2[i] = new Particle(2);
        g.particleList3[i] = new Particle(3);
        g.particleList4[i] = new Particle(4);
    }

}

function draw() {
    background(250);
    frame();
    drawGraphTicks();
    drawEqFunction();
    findPhaseComps();
    drawDot();
    drawParticles()

}

const temper = document.getElementById("temp");
const tempLabel = document.getElementById("temp-label");

const compos = document.getElementById("mole-frac");
const compLabel = document.getElementById("mole-frac-label");

temper.addEventListener("input", function () {
    let tmp = Number(temper.value);
    g.temp = tmp;
    tempLabel.innerHTML = `${tmp}`;
})

compos.addEventListener("input", function () {
    let tmp = Number(compos.value);
    g.xa = tmp;
    compLabel.innerHTML = `${tmp}`;
})

class Particle {
    constructor(box) {
        this.box = box;
        this.velocity = [random(-2, 2), random(-2, 2)];
        switch (box) {
            case 1:
                this.startY = (g.maxInputY + g.ty) / 2;
                this.position = [g.lx + 72 + random(0, 96), this.startY];
                this.color = g.blue;

                this.lb = g.lx + 72; // left bound
                this.rb = g.lx + 168;

                break;
            case 2:
                this.startY = (g.maxInputY + g.ty) / 2;
                this.position = [302 + random(0, 96), this.startY];
                this.color = g.green;

                this.lb = 302;
                this.rb = 398;

                break;
            case 3:
                this.startY = g.ty + 2;
                this.position = [g.rx - 168 + random(0, 96), this.startY];
                this.color = g.green;

                this.lb = g.rx - 168;
                this.rb = g.rx - 72;

                break;
            case 4:
                this.startY = g.maxInputY - 2;
                this.position = [g.rx - 168 + random(0, 96), this.startY];
                this.color = g.green;

                this.lb = g.rx - 168;
                this.rb = g.rx - 72;

                break;
        }
    }

    draw() {
        if (this._update()) {
            fill(this.color);
            circle(this.position[0], this.position[1], 5);
        }
    }

    _update() {
        let newPos = [this.position[0] + this.velocity[0], this.position[1] + this.velocity[1]];
        let b = this.bounds();

        if (newPos[0] < this.lb || newPos[0] > this.rb) {
            this.velocity[0] = - this.velocity[0];
            newPos[0] += 2 * this.velocity[0];
        }
        if (newPos[1] < b[0] || newPos[1] > b[1]) {
            this.velocity[1] = - this.velocity[1];
            newPos[1] += 2 * this.velocity[1];
            if (newPos[1] < b[0] || newPos[1] > b[1]) {
                newPos[1] = this.startY;
            }
        }

        this.position = newPos;
        return true;
    }

    bounds() { // this could be optimized by caclulating outside in a ParticleList class if needed
        let ty, by;
        switch (this.box) {
            case 1:
                ty = (g.maxInputY + g.ty) / 2 - g.h1 / 2 + 2;
                by = (g.maxInputY + g.ty) / 2 + g.h1 / 2 - 2;
                break;
            case 2:
                ty = (g.maxInputY + g.ty) / 2 - g.h2 / 2 + 2;
                by = (g.maxInputY + g.ty) / 2 + g.h2 / 2 - 2;
                break;
            case 3:
                ty = g.ty + 2;
                by = g.ty + g.h3 - 2;
                break;
            case 4:
                ty = g.ty + g.h3 + 10;
                by = g.maxInputY - 2;
                break;
        }
        return [ty, by];
    }

}