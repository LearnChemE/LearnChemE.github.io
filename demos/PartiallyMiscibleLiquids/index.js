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
    }

}

function draw() {
    background(250);
    frame();
    drawGraphTicks();
    drawEqFunction();
    findPhaseComps();
    drawDot();

    // Draw Particles
    push();
    stroke('black'); strokeWeight(2);
    let i;
    for (i = 0; i < g.totalParticles * g.xa; i++) {
        g.particleList1[i].draw();
    }
    for (i = 0; i < g.totalParticles * (1 - g.xa); i++) {
        g.particleList2[i].draw();
    }
    pop();

    push();
    stroke('black');
    line(g.lx, g.maxInputY, g.rx, g.maxInputY);
    pop();
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
                this.position = [g.lx + 70 + random(0, 100), (g.maxInputY + g.ty) / 2];
                this.color = g.blue;

                this.lb = g.lx + 72; // left bound
                this.rb = g.lx + 168;

                break;
            case 2:
                this.position = [300 + random(0, 100), (g.maxInputY + g.ty) / 2];
                this.color = g.green;

                this.lb = 302;
                this.rb = 398;

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
        let h = this.height();
        if (h < 4) return false;

        let newPos = [this.position[0] + this.velocity[0], this.position[1] + this.velocity[1]];
        let ty = (g.maxInputY + g.ty) / 2 - h / 2 + 2;
        let by = (g.maxInputY + g.ty) / 2 + h / 2 - 2;

        if (newPos[0] < this.lb || newPos[0] > this.rb) {
            this.velocity[0] = - this.velocity[0];
            newPos[0] += 2 * this.velocity[0];
        }
        if (newPos[1] < ty || newPos[1] > by) {
            this.velocity[1] = - this.velocity[1];
            newPos[1] += 2 * this.velocity[1];
            if (newPos[1] < ty || newPos[1] > by) {
                newPos[1] = (g.maxInputY + g.ty) / 2
            }
        }

        this.position = newPos;
        return true;
    }

    height() {
        switch (this.box) {
            case 1:
                return g.h1;
            case 2:
                return g.h2;
            case 3:
                return g.h3;
            case 4:
                return g.hmax - g.h3;
        }
    }

}