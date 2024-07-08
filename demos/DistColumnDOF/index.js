
var dropdownvalue = "condenser";
window.g = {
    unknowns: 1,
    cnv: undefined,
    opt: 1,
    showZb: false,
};

//storing variables
let textElements = [
    { mainText: 'm', sub: '5', x: 694, y: 500, size: 20, xsub: 8 },
    { mainText: 'm', sub: '1', x: 60, y: 290, size: 20, xsub: 8 },
    { mainText: '   y \n 1-y ', sub: '7,A \n \n 7,A', x: 320, y: 410, size: 20, xsub: 5, altText: '   y \n   y', altSub: '7,A \n \n7,B' },
    { mainText: '   x \n 1-x ', sub: '5,A \n \n 5,A', x: 684, y: 530, size: 20, xsub: 5, altText: '   x \n   x', altSub: '5,A \n \n5,B' },
    { mainText: 'm', sub: '3', x: 330, y: 500, size: 20, xsub: 8 },
    { mainText: '   y \n 1-y ', sub: '4,A \n \n 4,A', x: 684, y: 130, size: 20, xsub: 5, altText: '   y \n   y', altSub: '4,A \n \n4,B' },
    { mainText: '   z \n 1-z ', sub: '1,A \n \n  1,A', x: 50, y: 320, size: 20, xsub: 5, altText: '   z \n   z', altSub: '1,A \n \n1,B' },
    { mainText: 'm', sub: '4', x: 694, y: 100, size: 20, xsub: 8 },
    { mainText: 'm', sub: '2', x: 330, y: 100, size: 20, xsub: 8 },
    { mainText: 'm', sub: '6', x: 330, y: 220, size: 20, xsub: 8 },
    { mainText: 'm', sub: '7', x: 330, y: 380, size: 20, xsub: 8 },
    { mainText: '   x \n 1-x ', sub: '6,A \n \n 6,A', x: 320, y: 250, size: 20, xsub: 5, altText: '   x \n   x', altSub: '6,A \n \n6,B' },
    { mainText: '   y \n 1-y ', sub: '2,A \n \n 2,A', x: 320, y: 130, size: 20, xsub: 5, altText: '   y \n   y', altSub: '2,A \n \n2,B' },
    { mainText: '   x \n 1-x ', sub: '3,A \n \n 3,A', x: 320, y: 530, size: 20, xsub: 5, altText: '   x \n   x', altSub: '3,A \n \n3,B' },
];


function shuffleArray(array) {
    console.log('shuffling');
    for (let i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

$(() => {
    $("#shuffle-btn").click(() => {
        shuffleArray(textElements);
    });
    $("#equationB").click(() => {
        g.showZb = false;
    });
    $("#fractionB").click(() => {
        g.showZb = true;
    });
});


const unknowns = document.getElementById("unknown");
const unknownsLabel = document.getElementById("unknown-label");


const defaultColor = 'black';
const activeColor = 'blue';

unknowns.addEventListener("input", function () {
    let unk = Number(unknowns.value);
    g.unknowns = unk;
    unknownsLabel.innerHTML = `${unk}`;
    // drawVar(unk);
});


import { drawRectangle, drawArrow, drawBorder, drawText, drawSub } from './functions.mjs';

function drawTextElements(nUnknowns) {
    let element;

    push();
    for (let i = 0; i < nUnknowns; i++) {
        element = textElements[i];
        fill(activeColor); //stroke(activeColor); //noStroke();
        drawSub(element.mainText, element.sub, element.x, element.y, element.size, element.xsub, element.altText, element.altSub, g.showZb);
    }
    for (let i = nUnknowns; i < textElements.length; i++) {
        element = textElements[i];
        fill(defaultColor); //stroke(activeColor); //noStroke();
        drawSub(element.mainText, element.sub, element.x, element.y, element.size, element.xsub, element.altText, element.altSub, g.showZb);
    }
    pop();


}

function drawDisplay(value) {
    // console.log(value);
    let borderVars;
    let colcon = 'black';
    let colreb = 'black';
    let contot = 'black';
    let rebtot = 'black';
    let coltot = 'black';

    switch (value) {
        case 'reboiler':
            borderVars = [475, 420, 200, 180, 10, 'green'];
            colreb = 'green';
            rebtot = 'green';

            break;
        case 'condenser':
            borderVars = [475, 20, 200, 180, 10, 'green'];
            colcon = 'green';
            contot = 'green';

            break;
        case 'distillation column':
            borderVars = [100, 120, 200, 380, 10, 'green'];
            colcon = 'green';
            colreb = 'green';
            coltot = 'green';

            break;
        case 'overall':
            borderVars = [60, 30, 670, 560, 10, 'green'];
            contot = 'green';
            rebtot = 'green';
            coltot = 'green';

            break;

    }

    push();
    // Units
    drawRectangle(120, height / 2 - 150, 150, 320, 'distillation \n column', 145, 30);
    drawRectangle(500, 50, 150, 120, 'condenser', 70, 30);
    drawRectangle(500, 450, 150, 120, 'reboiler', 70, 40);

    // Green dotted border
    drawBorder(...borderVars);

    // col/condenser
    drawArrow([200, 110], [500, 110], 10, colcon);
    drawArrow([575, 230], [270, 230], 10, colcon);

    // col/reb
    drawArrow([200, 510], [500, 510], 10, colreb);
    drawArrow([575, 390], [270, 390], 10, colreb);

    // cond/total
    drawArrow([650, 110], [750, 110], 10, contot);

    // reb/total
    drawArrow([650, 510], [750, 510], 10, rebtot);

    // col/total
    drawArrow([50, 300], [120, 300], 10, coltot);

    strokeWeight(2);

    stroke(colreb);
    line(200, 510, 200, 470);
    line(575, 450, 575, 390);

    stroke(colcon);
    line(200, 150, 200, 110);
    line(575, 170, 575, 230);

    drawText(value, 940, 120, 'black', true);

    // drawTextElements();
    pop();
}

function drawVar(nUnknowns) {
    clear();
    drawDisplay(dropdownvalue); // Ensure the display is updated
    textSize(18);
    drawTextElements(nUnknowns);
}

function setup() {
    // console.log('state 0');
    g.cnv = createCanvas(1100, 600);
    g.cnv.parent("graphics-wrapper");
}

document.getElementById('unknown').addEventListener('change', function () {
    g.unknowns = Number(this.value);
    // drawVar(g.unknowns);
});

document.getElementById('isotype').addEventListener('change', function () {
    dropdownvalue = this.value;
    // drawDisplay(dropdownvalue);
});

function draw() {
    // console.log('state 1');
    background(255);
    drawVar(g.unknowns);
    // updateView();

}

// document.addEventListener("DOMContentLoaded", function() {
//     // Default to first option, corresponding to 'equationB'
//     //  references to radio buttons
//     const equationB = document.getElementById('equationB');
//     const fractionB = document.getElementById('fractionB');


//     // Initial update (in case the initial state needs to be set)
//     // updateView();
// });

// Event listeners for radio buttons
equationB.addEventListener('change', function () {
    if (this.checked) {
        g.opt = 1; // Set to the option for '1-zA'
        // updateView();
    }
});
fractionB.addEventListener('change', function () {
    if (this.checked) {
        g.opt = 2; // Set to the option for 'zB'
        // updateView();
    }
});

// Function to update the view based on 'opt'
function updateView() {
    if (g.opt === 1) {
        updateForEquationB();
    } else if (g.opt === 2) {
        updateForFractionB();
    }
}

function updateForEquationB() {
    console.log("Updating display for Equation B (1-zA)");
    drawDisplay('condenser');
    if (window.myP5) {
        window.myP5.drawEquationB();
    }
}

function updateForFractionB() {
    console.log("Updating display for Fraction B (zB)");
    push();
    text('O', 100, 100)
    pop();
    if (window.myP5) {
        window.myP5.drawFractionB();
    }
}

window.setup = setup;
window.draw = draw;