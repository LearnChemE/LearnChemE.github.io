
var dropdownvalue = "condenser";
window.g = {
    unknowns: 1,
    displayUnknowns: 1,
    cnv: undefined,
    opt: 1,
    showZb: false,

    extraInfo: 1,
    dof: -3,

    nCol: 0,
    nReb: 0,
    nCon: 0,
    nTot: 0,
  
    condenserType: 'partial'
};

const CON_COL = 0;
const REB_COL = 1;
const CON_TOT = 2;
const REB_TOT = 3;
const COL_TOT = 4;

//storing variables
let textElements = [
    { mainText: 'm', sub: '5', x: 694, y: 500, size: 20, xsub: 8, countsAsTwo: false, gid: REB_TOT },
    { mainText: 'm', sub: '1', x: 60, y: 290, size: 20, xsub: 8, countsAsTwo: false, gid: COL_TOT },
    { mainText: '   y \n 1-y ', sub: '7,A \n \n 7,A', x: 320, y: 410, size: 20, xsub: 5, altText: '   y \n   y', altSub: '7,A \n \n7,B', countsAsTwo: true, gid: REB_COL },
    { mainText: '   x \n 1-x ', sub: '5,A \n \n 5,A', x: 684, y: 530, size: 20, xsub: 5, altText: '   x \n   x', altSub: '5,A \n \n5,B', countsAsTwo: true, gid: REB_TOT },
    { mainText: 'm', sub: '3', x: 330, y: 500, size: 20, xsub: 8, countsAsTwo: false, gid: REB_COL },
    { mainText: '   y \n 1-y ', sub: '4,A \n \n 4,A', x: 684, y: 130, size: 20, xsub: 5, altText: '   y \n   y', altSub: '4,A \n \n4,B', countsAsTwo: true, gid: CON_TOT },
    { mainText: '   z \n 1-z ', sub: '1,A \n \n  1,A', x: 50, y: 320, size: 20, xsub: 5, altText: '   z \n   z', altSub: '1,A \n \n1,B', countsAsTwo: true, gid: COL_TOT },
    { mainText: 'm', sub: '4', x: 694, y: 100, size: 20, xsub: 8, countsAsTwo: false, gid: CON_TOT },
    { mainText: 'm', sub: '2', x: 330, y: 100, size: 20, xsub: 8, countsAsTwo: false, gid: CON_COL },
    { mainText: 'm', sub: '6', x: 330, y: 220, size: 20, xsub: 8, countsAsTwo: false, gid: CON_COL },
    { mainText: 'm', sub: '7', x: 330, y: 380, size: 20, xsub: 8, countsAsTwo: false, gid: REB_COL },
    { mainText: '   x \n 1-x ', sub: '6,A \n \n 6,A', x: 320, y: 250, size: 20, xsub: 5, altText: '   x \n   x', altSub: '6,A \n \n6,B', countsAsTwo: true, gid: CON_COL },
    { mainText: '   y \n 1-y ', sub: '2,A \n \n 2,A', x: 320, y: 130, size: 20, xsub: 5, altText: '   y \n   y', altSub: '2,A \n \n2,B', countsAsTwo: true, gid: CON_COL },
    { mainText: '   x \n 1-x ', sub: '3,A \n \n 3,A', x: 320, y: 530, size: 20, xsub: 5, altText: '   x \n   x', altSub: '3,A \n \n3,B', countsAsTwo: true, gid: REB_COL },
];

let colUnknowns = new Array(15);
let conUnknowns = new Array(9);
let rebUnknowns = new Array(9);
let totUnknowns = new Array(9);

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
        updateUnkowns(g.unknowns);
        updateDOF();
    });
    $("#equationB").click(() => {
        g.showZb = false;
        updateUnkowns(g.unknowns);
        updateDOF();
    });
    $("#fractionB").click(() => {
        g.showZb = true;
        updateUnkowns(g.unknowns);
        updateDOF();
    });
});


const unknowns = document.getElementById("unknown");
const unknownsLabel = document.getElementById("unknown-label");


const defaultColor = 'black';
const activeColor = 'blue';

unknowns.addEventListener("input", function () {
    let unk = Number(unknowns.value);
    updateUnkowns(unk);
    updateDOF();
});

function updateUnkowns(unk) {
    var displayUnknowns = unk;

    for (let i = 0; i < unk; i++) {
        if (textElements[i].countsAsTwo) displayUnknowns++;
    }

    g.unknowns = unk;
    g.displayUnknowns = displayUnknowns;
    if (g.showZb) unknownsLabel.innerHTML = `${displayUnknowns}`;
    else unknownsLabel.innerHTML = `${unk}`
}

function updateDOF() {
    const species = 2;
    var unk = g.unknowns;

    let element, val;


    let nCol = 0, nReb = 0, nCon = 0, nTot = 0;
    let str, j;
    for (let i = 0; i < unk; i++) {
        element = textElements[i];
        str = '', j = 0;
        // console.log(element.mainText)
        while (str == '' || str == ' ') {
            str = element.mainText[j++];
        }
        str = str + element.sub[0];

        switch (element.gid) {
            case CON_COL:
                colUnknowns[nCol] = str;
                nCol++;

                conUnknowns[nCon] = str;
                nCon++;
                break;
            case REB_COL:
                rebUnknowns[nReb] = str;
                nReb++;

                colUnknowns[nCol] = str;
                nCol++;
                break;
            case CON_TOT:
                conUnknowns[nCon] = str;
                nCon++;

                totUnknowns[nTot] = str;
                nTot++;
                break;
            case REB_TOT:
                rebUnknowns[nReb] = str;
                nReb++;

                totUnknowns[nTot] = str;
                nTot++;
                break;
            case COL_TOT:
                colUnknowns[nCol] = str;
                nCol++;

                totUnknowns[nTot] = str;
                nTot++;
                break;
        }
    }

    g.nCol = nCol;
    g.nCon = nCon;
    g.nReb = nReb;
    g.nTot = nTot;

}

function updateExtra() {
    var nExtra = 0;
    let extras;

    if (g.showZb) {
        extras = findExtraXInfo();
        nExtra = extras.length;
    }
    else extras = new Array(0);

    if (dropdownvalue == 'reboiler') {
        extras.push('K');
        nExtra++;
    }
    else if (dropdownvalue == 'condenser') {
        extras.push('K');
        nExtra++;
        // if (g.totalCondenser) nExtra++;
    }

    g.extraInfo = nExtra;
    return extras;
}

function findExtraXInfo() {
    let numUnk, elements;
    switch (dropdownvalue) {
        case 'condenser':
            numUnk = g.nCon;
            elements = conUnknowns;
            break;
        case 'reboiler':
            numUnk = g.nReb;
            elements = rebUnknowns;
            break;
        case 'distillation column':
            numUnk = g.nCol;
            elements = colUnknowns;
            break;
        case 'overall':
            numUnk = g.nTot;
            elements = totUnknowns;
            break;
    }

    let array = new Array(0);
    // let n = 0;
    for (let i = 0; i < numUnk; i++) {
        if (elements[i][0] != 'm') {
            array.push(elements[i]);
        };
    }

    return array;
}

import { drawRectangle, drawArrow, drawBorder, drawText, drawSub } from './functions.mjs';

function drawTextElements(nUnknowns) {
    let element;

    push();
    for (let i = 0; i < nUnknowns; i++) {
        element = textElements[i];
        
        if (g.condenserType === 'partial' && element.mainText === '   y \n 1-y ' && element.sub === '4,A \n \n 4,A') {
            element.mainText = '   y \n 1-y ';    
        } else if ((g.condenserType === 'partial' && element.altText === '   y \n   y' && element.altSub === '4,A \n \n4,B'))
            element.altText = '   y \n   y'; 

        fill(activeColor); 
        drawSub(element.mainText, element.sub, element.x, element.y, element.size, element.xsub, element.altText, element.altSub, g.showZb);
    }
    for (let i = nUnknowns; i < textElements.length; i++) {
        element = textElements[i];

        if (g.condenserType === 'total' && element.mainText === '   y \n 1-y ' && element.sub === '4,A \n \n 4,A') {
            element.mainText = '   x \n 1-x '; 
           
        } else if ((g.condenserType === 'partial' && element.mainText === '   x \n 1-x ' && element.sub === '4,A \n \n 4,A'))
            element.mainText = '   y \n 1-y '; 

        fill(defaultColor); 
        drawSub(element.mainText, element.sub, element.x, element.y, element.size, element.xsub, element.altText, element.altSub, g.showZb);
    }
    for (let i = nUnknowns; i < textElements.length; i++) {
        element = textElements[i];

        if (g.condenserType === 'total' && element.altText === '   y \n   y' && element.altSub === '4,A \n \n4,B') {
            element.altText = '   x \n   x'; 
           
        } else if ((g.condenserType === 'partial' && element.altText === '   x \n   x' && element.altSub === '4,A \n \n4,B'))
            element.altText = '   y \n   y'; 

        fill(defaultColor); 
        drawSub(element.mainText, element.sub, element.x, element.y, element.size, element.xsub, element.altText, element.altSub, g.showZb);
    }
    pop();
}

document.getElementById('partial').addEventListener('change', function () {
    if (this.checked) {
        g.condenserType = 'partial';
    }
});

document.getElementById('total').addEventListener('change', function () {
    if (this.checked) {
        g.condenserType = 'total';
    }
});

const condenserType = document.getElementById('condenser-type');

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
            condenserType.style.display = 'none';
            break;
        case 'condenser':
            borderVars = [475, 20, 200, 180, 10, 'green'];
            colcon = 'green';
            contot = 'green';
            condenserType.style.display = 'block';
            break;
        case 'distillation column':
            borderVars = [100, 120, 200, 380, 10, 'green'];
            colcon = 'green';
            colreb = 'green';
            coltot = 'green';
            condenserType.style.display = 'none';
            break;
        case 'overall':
            borderVars = [60, 30, 670, 560, 10, 'green'];
            contot = 'green';
            rebtot = 'green';
            coltot = 'green';
            condenserType.style.display = 'none';
            break;
        default: 
            condenserType.style.display = 'none';
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

    // drawText(value, 940, 120, 'black', true);
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
    g.cnv.id("defaultCanvas0");
}

document.getElementById('unknown').addEventListener('change', function () {
    g.unknowns = Number(this.value);
    // drawVar(g.unknowns);
});

document.getElementById('isotype').addEventListener('change', function () {
    dropdownvalue = this.value;
    updateDOF();
    // drawDisplay(dropdownvalue);
});

function rightDisplay() {
    push();
    translate(800, 0);
    let rx = 300;
    let by = 600;

    textAlign(CENTER, CENTER);
    fill('black');

    push();
    textStyle('bold'); textSize(22);
    text(dropdownvalue, rx / 2, 50);
    pop();

    let numUnk, elements;
    switch (dropdownvalue) {
        case 'condenser':
            numUnk = g.nCon;
            elements = conUnknowns;
            break;
        case 'reboiler':
            numUnk = g.nReb;
            elements = rebUnknowns;
            break;
        case 'distillation column':
            numUnk = g.nCol;
            elements = colUnknowns;
            break;
        case 'overall':
            numUnk = g.nTot;
            elements = totUnknowns;
            break;
    }

    push();
    fill('blue');
    let n = 0, repeatxyz = g.showZb, str, sub;

    for (let i = 0; i < numUnk; i++) {
        str = elements[i][0];

        if (str != 'm') sub = elements[i][1] + ',A';
        else sub = elements[i][1];

        textSize(20); text(str, 40 + n % 6 * 40, 130 + floor(n / 6) * 30);
        textSize(14); text(sub, 54 + n % 6 * 40, 137 + floor(n / 6) * 30);
        n++;

        if (repeatxyz && str != 'm') {
            textSize(20); text(str, 40 + n % 6 * 40, 130 + floor(n / 6) * 30);
            textSize(14); text(elements[i][1] + ',B', 54 + n % 6 * 40, 137 + floor(n / 6) * 30);
            n++;
        }
    }
    fill('black'); textSize(20);
    text('unknowns = ' + n, 150, 100);
    pop();

    let extras = updateExtra();

    push();
    text("species balances = 2\nA B", 150, 240);
    text('extra information = ' + g.extraInfo, 150, 300);
    pop();

    push();
    fill('blue');
    for (let i = 0; i < g.extraInfo; i++) {
        if (extras[i][0] == 'K') {
            if (dropdownvalue == 'reboiler') {
                text('K  = y  /x', 150, 330 + ceil(i / 3) * 30);
                push(); textSize(14);
                text('r', 130, 337 + ceil(i / 3) * 30);
                text('7', 165, 337 + ceil(i / 3) * 30);
                text('5', 190, 337 + ceil(i / 3) * 30);
                pop();
            }
            else if (g.condenserType === 'total') {
                text('y  = x  = x', 150, 330 + ceil(i / 3) * 30);
                push(); textSize(14);
                text('2', 124, 337 + ceil(i / 3) * 30);
                text('4', 158, 337 + ceil(i / 3) * 30);
                text('6', 194, 337 + ceil(i / 3) * 30);
                pop();
            }
            else {
                text('K  = y  /x', 150, 330 + ceil(i / 3) * 30);
                push(); textSize(14);
                text('c', 130, 337 + ceil(i / 3) * 30);
                text('4', 165, 337 + ceil(i / 3) * 30);
                text('6', 190, 337 + ceil(i / 3) * 30);
                pop();
            }
        }
        else {
            text('Σ' + extras[i][0] + '  = 1', 75 + i % 3 * 75, 330 + 30 * floor(i / 3));

            push(); textSize(14);
            text(extras[i][1], 72 + i % 3 * 75, 337 + 30 * floor(i / 3));
            pop();
        }
    }
    pop();

    push();
    let dof = n - g.extraInfo;
    text('degrees of freedom = ' + dof, 150, 420);
    if (dof == 0) {
        text('solvable', 150, 450);
    }
    else if (dof < 0) {
        text('overspecified', 150, 450);
    }
    else {
        text('underspecified', 150, 450);
    }
    pop();

    pop();
}

function draw() {
    // console.log('state 1');
    background(255);
    drawVar(g.unknowns);
    rightDisplay();
    // updateView();

}

window.setup = setup;
window.draw = draw;