require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT

window.gvs = {
    yA : function(xA) {return 1},
};

while(gvs.yA(0.05) > 0.5 || gvs.yA(0.05) < 0.05) {
    const antoine_list = [
        [7.29964, 1479.02, 216.81],
        [7.02447, 1161, 224],
        [6.90565, 1211.033, 220.79],
        [7.838, 1558.190, 196.881],
        [6.9547, 1170.97, 226.23],
        [6.80267, 656.4028, 255.99],
        [7.01457, 1211.90, 216],
        [8.04494, 1554.3, 222.65],
        [8.11822, 1580.92, 219.61],
        [8.07247, 1574.99, 238.86],
        [6.87776, 1171.53, 224.366],
        [6.9024, 1268.115, 216.9],
        [6.95334, 1343.943, 219.377],
        [7.94917, 1657.462, 227.02]
    ];
    
    const index_A = Math.floor(Math.random() * antoine_list.length);
    let index_B = Math.floor(Math.random() * antoine_list.length);
    while(index_A == index_B) {
        index_B = Math.floor(Math.random() * antoine_list.length);
    }
    
    const component_1_antoine_parameters = antoine_list[index_A];
    const component_2_antoine_parameters = antoine_list[index_B];
    
    const Psat1 = function(T) {
        const A = component_1_antoine_parameters[0];
        const B = component_1_antoine_parameters[1];
        const C = component_1_antoine_parameters[2];
        return 10**(A - B / (T + C));
    }
    
    const Psat2 = function(T) {
        const A = component_2_antoine_parameters[0];
        const B = component_2_antoine_parameters[1];
        const C = component_2_antoine_parameters[2];
        return 10**(A - B / (T + C));
    }
    
    // Define component "A" as the more volatile component at 0 degrees C
    if(Psat1(0) > Psat2(0)) {
        gvs.PsatA = Psat1;
        gvs.PsatB = Psat2;
        gvs.component_A_antoine_parameters = component_1_antoine_parameters;
        gvs.component_B_antoine_parameters = component_2_antoine_parameters;
    } else {
        gvs.PsatA = Psat2;
        gvs.PsatB = Psat1;
        gvs.component_A_antoine_parameters = component_2_antoine_parameters;
        gvs.component_B_antoine_parameters = component_1_antoine_parameters;
    }
    
    gvs.A12 = Number((Math.random() * 2.00).toFixed(2));
    gvs.A21 = Number((Math.random() * 2.00).toFixed(2));
    
    gvs.gamma_A = function(xA) {
        const xB = 1 - xA;
        const ln_gamma_A = xB**2 * (gvs.A12 + 2 * (gvs.A21 - gvs.A12) * xA);
        const gamma_A = Math.exp(ln_gamma_A);
        return gamma_A
    }
    
    gvs.gamma_B = function(xA) {
        const xB = 1 - xA;
        const ln_gamma_B = xA**2 * (gvs.A21 + 2 * (gvs.A12 - gvs.A21) * xB);
        const gamma_B = Math.exp(ln_gamma_B);
        return gamma_B
    }
    
    // generate equilibrium curve
    gvs.eq_line = [];
    for(let xA = 0; xA <= 1.00; xA += 0.01) {
        xA = Math.round(xA * 100) / 100;
        const xB = 1 - xA;
        const P = 760; // atmospheric pressure, mmHg
        let delta = 1e6;
        let T_sat = -273.1;
        for(let T = -273.1; T < 200; T += 0.01) {
            const PsatA = gvs.PsatA(T);
            const PsatB = gvs.PsatB(T);
            const Psat_mixture = xA * gvs.gamma_A(xA) * PsatA + xB * gvs.gamma_B(xA) * PsatB;
            const diff = Math.abs(P - Psat_mixture);
            if(diff < delta) {
                T_sat = Math.round(T * 100) / 100;
                delta = diff;
            }
        }
        const yA = Math.max(0, Math.min(1, xA * gvs.gamma_A(xA) * gvs.PsatA(T_sat) / P));
        gvs.eq_line.push([xA, yA])
    }
    
    gvs.yA = function(xA) {
        let i = 0;
        let y;
        for(let j = 0; j < gvs.eq_line.length; j++) {
            const x = gvs.eq_line[j][0];
            if(xA >= x) {
                i = j;
            }
        }
        let frac;
        if(xA < 1) {
            frac = (xA - gvs.eq_line[i][0]) / (gvs.eq_line[i + 1][0] - gvs.eq_line[i][0]);
            y = gvs.eq_line[i][1] * (1 - frac) + gvs.eq_line[i + 1][1] * frac;
        } else {
            frac = 0;
            y = 1;
        }
        return y
    }
}


const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        const { SVG_Graph } = require("./js/svg-graph-library.js");
        gvs.SVG_Graph = SVG_Graph;
        require("./js/plot.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);