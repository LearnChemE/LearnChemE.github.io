let p;
let xMin, xMax, yMin, yMax, margins, gPix;
const reactantsColor = "rgb(0, 0, 255)";
const productsColor = "rgb(0, 150, 80)";

function drawAxes() {

    let incX, incY;

    switch( gvs.reaction ) {
        case "acetylene hydrogenation":
            incX = 20;
            incY = 40;
        break;
        case "methane combustion":
            incX = 60;
            incY = 10;
        break;
        case "carbon monoxide oxidation":
            incX = 30;
            incY = 80;
        break;
        case "haber bosch process":
            incX = 15;
            incY = 80;
        break;
    }

    p.push();

        // Draw x-axis
        p.line(gPix[0][0], gPix[1][1], gPix[0][1], gPix[1][1]);

        let i = 0;
        let yPix = gPix[1][1];
        let offsetY = p.textWidth("X") * 2;

        for ( let x = xMin; x <= xMax; x += incX ) {
            let tickSize;
            if ( i % 5 === 0 ) {
                tickSize = 6;
            } else {
                tickSize = 3;
            }
            
            p.noFill();
            p.stroke(0);
            p.strokeWeight(0.5);

            const xPix = gPix[0][0] + (( x - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
            
            if ( x !== xMin ) { p.line(xPix, yPix, xPix, yPix - tickSize) };

            if ( i % 5 === 0 ) {
                p.noStroke();
                p.fill(0);
                p.textSize(16);
                const offsetX = p.textWidth(`${x}`) / 2;
                p.text(`${x}`, xPix - offsetX, yPix + offsetY);
            }

            i++;
        };

        p.noFill();
        p.stroke(0);
        p.strokeWeight(0.5);

        // Draw y-axis
        p.line(gPix[0][0], gPix[1][0], gPix[0][0], gPix[1][1]);
        i = 0;
        let xPix = gPix[0][0];
        offsetY = 6;

        for ( let y = yMin; y <= yMax; y += incY ) {
            let tickSize;
            if ( i % 5 === 0 ) {
                tickSize = 6;
            } else {
                tickSize = 3;
            }
            p.noFill();
            p.stroke(0);
            p.strokeWeight(0.5);

            const yPix = gPix[1][1] - (( y - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );

            if ( i !== 0 ) { p.line(xPix, yPix, xPix + tickSize, yPix) };
  
            if ( i % 5 === 0 && i !== 0 ) {
                p.noStroke();
                p.fill(0);
                p.textSize(16);
                const offsetX = p.textWidth(`${y}`) + 10;
                p.text(`${y}`, xPix - offsetX, yPix + offsetY);
            }
            i++;
        };

        p.noStroke();
        p.fill(0);

        p.textAlign(p.CENTER, p.BOTTOM);
        
        p.text("standard enthalpy H° (kJ/mol)", (gPix[0][1] - gPix[0][0] + margins[0][0]) / 2 + 50, gPix[1][1] + 3 * margins[1][1] / 4);
        p.rotate(-Math.PI/2);
        p.text("temperature (°C)", gPix[0][0] - 280, gPix[1][0] - 10);

    p.pop();
}

function drawH0() {
    p.push();
        p.noFill();
        p.stroke(reactantsColor);
        // Draw line for X = 0
        p.beginShape();
            let Tinc = ( yMax - yMin ) / 100;
            let H = 0;
            for ( let TC = 25; TC < yMax - Tinc && H < xMax ; TC += Tinc ) {
                const T = 273.15 + TC;
                H = gvs.H(T, 0);
                const xPix = gPix[0][0] + (( H - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
                const yPix = gPix[1][1] - (( TC - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );
                p.vertex(xPix, yPix);
            }
        p.endShape();
    p.pop();
};

function drawH1() {
    p.push();
        p.noFill();
        p.stroke(productsColor);
        // Draw line for X = 1
        p.beginShape();
            Tinc = ( yMax - yMin ) / 100;
            let H = 0;
            for ( let TC = 25; TC < yMax - Tinc && H < xMax ; TC += Tinc ) {
                const T = 273.15 + TC;
                H = gvs.H(T, 1);
                const xPix = gPix[0][0] + (( H - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
                const yPix = gPix[1][1] - (( TC - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );
                p.vertex(xPix, yPix);
            }
        p.endShape();
    p.pop();
};

function drawHorizontalLine() {
    p.push();
        const y = gvs.T - 273.15;
        const x0 = Math.min(xMax, gvs.H(gvs.T, 0));
        const x1 = Math.min(xMax, gvs.H(gvs.T, 1));
        const xPix0 = gPix[0][0] + (( x0 - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
        const xPix1 = gPix[0][0] + (( x1 - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
        const yPix = gPix[1][1] - (( y - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );
        p.line(xPix0, yPix, xPix1, yPix);
        p.noStroke();
        p.fill(0);
        if ( x0 > x1 ) {
            p.triangle(xPix1, yPix, xPix1 + 15, yPix + 4, xPix1 + 15, yPix - 4);
        } else {
            p.triangle(xPix1, yPix, xPix1 - 15, yPix + 4, xPix1 - 15, yPix - 4);
        };
        p.textSize(15);
        p.textAlign(p.LEFT, p.BOTTOM);
        const textLength = p.textWidth(`ΔH   = ${gvs.Hrxn.toFixed(0)} kJ/mol`);
        const deltaOffset = p.textWidth("ΔH");
        p.text(`ΔH    = ${gvs.Hrxn.toFixed(1)} kJ/mol`, (xPix0 + xPix1) / 2 - textLength / 2, yPix - 5);
        p.textSize(10);
        p.text("rxn", (xPix0 + xPix1) / 2 - textLength / 2 + deltaOffset, yPix - 3)
    p.pop();
};

function drawProductLabel() {
    p.push();
        p.noStroke();
        p.fill(productsColor);
        const y = (yMax + yMin) / 2;
        const x = gvs.H(y + 273.15, 1);
        const x2 = gvs.H(y + 280, 1);
        const y2 = y + (280 - 273.15);
        const xPix = gPix[0][0] + (( x - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
        const yPix = gPix[1][1] - (( y - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );
        const xPix2 = gPix[0][0] + (( x2 - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
        const yPix2 = gPix[1][1] - (( y2 - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );
        // const dx = xPix2 - xPix;
        // const dy = yPix2 - yPix;
        // const a = p.atan2(dx, dy);
        p.translate(xPix, yPix);
        p.textSize(18);
        p.textAlign(p.CENTER, p.CENTER);
        const offset = gvs.reaction !== "methane combustion" ? p.textWidth("products") - 10 : p.textWidth("products") - 25;
        if ( gvs.Hrxn < 0 ) {
            p.text("products", -offset, 0);
        } else {
            p.text("products", offset, 0);
        }
    p.pop();
};

function drawReactantsLabel() {
    p.push();
        p.noStroke();
        p.fill(reactantsColor);
        const y = (yMax + yMin) / 3;
        const x = gvs.H(y + 273.15, 0);
        const x2 = gvs.H(y + 280, 0);
        const y2 = y + (280 - 273.15);
        const xPix = gPix[0][0] + (( x - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
        const yPix = gPix[1][1] - (( y - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );
        const xPix2 = gPix[0][0] + (( x2 - xMin ) / ( xMax - xMin )) * ( gPix[0][1] - gPix[0][0] );
        const yPix2 = gPix[1][1] - (( y2 - yMin ) / ( yMax - yMin )) * ( gPix[1][1] - gPix[1][0] );
        const dx = xPix2 - xPix;
        const dy = yPix2 - yPix;
        // const a = p.atan2(dx, dy);
        p.translate(xPix, yPix);
        p.textSize(18);
        const offset = p.textWidth("reactants") - 10;
        p.textAlign(p.CENTER, p.CENTER);
        if ( gvs.Hrxn < 0 ) {
            p.text("reactants", offset, 0);
        } else {
            p.text("reactants", -offset, 0);
        }
    p.pop();
};

function drawAll(p5obj) {
    if ( typeof(p) === "undefined" ) { p = p5obj }
    xMin = gvs.xRange[0];
    xMax = gvs.xRange[1];
    yMin = 0;
    yMax = gvs.yRange[1];
    margins = [[75, 40], [36, 70]]; // margins of graph from edge of canvas
    gPix = [[margins[0][0], p.width - margins[0][1]], [margins[1][0], p.height - margins[1][1]]]; // Graph pixel values of the edges, i.e. [[pixels of left bound, pixels of right bound], [pixels of top bound, pixels of bottom bound]]
    drawAxes();
    drawH0();
    drawH1();
    drawHorizontalLine();
    drawProductLabel();
    drawReactantsLabel();
};

module.exports = { drawAll }