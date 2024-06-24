// const { sqrt } = require("mathjs");


class P5_Graph {
    constructor(width, height, options) {
        // const graphNumber = document.getElementsByClassName("p5-plot");
        this.options = {
            title: '',
            titleFontSize: 20,
            padding:
                [[70, 20],
                [40, 50]],
            parent: document.body,
            fill: 250, // This is very slightly darker than the white of the page

            xTitle: '',
            yTitle: '',
            xLabelPrecision: 0,
            yLabelPrecision: 0,
        }
        this.options = {
            ...this.options,
            ...options,
        };

        this.width = width;
        this.height = height;

        this.setLabelRanges([0, 1], [0, 1]);
        this.setBounds(width, height)
    }

    setBounds(width, height) {
        this.lx = this.options.padding[0][0];
        this.ty = this.options.padding[0][1];
        this.rx = width - this.options.padding[1][0];
        this.by = height - this.options.padding[1][1];
    }

    setLabelRanges(xRange, yRange) {
        this.xRange = xRange
        this.yRange = yRange
    }

    /* ************************** */
    /* ******** METHODS ********* */
    /* ************************** */

    // Call this every draw loop to render the graph with p5
    on_draw() {
        this.clear();
        this.drawAxesAndBounds();
        this.drawGraphTicks();
    }

    clear() {
        push();
        noStroke(); fill(this.options.fill);
        rect(0, 0, this.width, this.height);
        pop();
    }

    drawAxesAndBounds() {
        push();
        fill(this.options.fill);
        stroke('black'); strokeWeight(2);
        rect(this.lx, this.ty, this.rx - this.lx, this.by - this.ty);
        pop();


    }

    drawGraphTicks() {
        // Graph axes ticks \\
        // x-axis
        let ticks, count, xPos;
        let lx = this.lx, rx = this.rx, ty = this.ty, by = this.by;
        let i;
        let xLabels = new Array(2), yLabels = new Array(2);

        // Generate graph labels
        let xSpacing = (this.xRange[1] - this.xRange[0]) / 5;
        let ySpacing = (this.yRange[1] - this.yRange[0]) / 5;
        for (i = 0; i < 6; i++) {
            xLabels[i] = this.xRange[0] + xSpacing * i;
            yLabels[i] = this.yRange[0] + ySpacing * i;
        }


        ticks = 5;
        count = 25;

        // X Axis ticks
        push();
        stroke('black'); strokeWeight(1);
        for (i = 0; i < count; i++) {
            xPos = lx + (rx - lx) / count * i;

            if (i % ticks == 0) {
                line(xPos, by, xPos, by - 5);
                line(xPos, ty, xPos, ty + 5);
                push();
                noStroke(); textSize(14);
                if (i == 0) {
                    text(xLabels[i / ticks].toFixed(this.options.xLabelPrecision), xPos - 10, by + 16);
                } else {
                    text(xLabels[i / ticks].toFixed(this.options.xLabelPrecision), xPos - 10, by + 15);
                }
                pop();
            } else {
                line(xPos, by, xPos, by - 3);
                line(xPos, ty, xPos, ty + 3);
            }
        }
        push();
        noStroke(); textSize(14);
        text(xLabels[5], rx - 10, by + 15);
        pop();

        ticks = 5;
        count = 25;

        // Y Axis ticks
        let yPos;
        for (i = 0; i < count; i++) {
            yPos = by - (by - ty) * i / count;

            if (i % ticks == 0) {
                line(lx, yPos, lx + 5, yPos);
                line(rx, yPos, rx - 5, yPos);

                push();
                noStroke(); textSize(14);
                text(yLabels[i / ticks].toFixed(this.options.yLabelPrecision), lx - 28, yPos + 3);
                pop();
            }
            else {
                line(lx, yPos, lx + 3, yPos);
                line(rx, yPos, rx - 3, yPos);
            }
        }

        pop();
        push();
        noStroke(); textSize(14);
        text(yLabels[5].toFixed(this.options.yLabelPrecision), lx - 28, ty + 3);
        pop();


        // Axis Labels
        push();
        textAlign(CENTER, CENTER);
        noStroke(); textSize(18);
        text(this.options.xTitle, (rx + lx) / 2, by + 36);

        push();
        translate(this.lx - 40, (by + ty) / 2);
        rotate(radians(-90));
        text(this.options.yTitle, 0, 0);
        pop();

        // TODO: Optional super title
        pop();
    }

    // Draw a line from lineEq arg where lineEq[0] is y-intercept, lineEq[1] is slope
    drawLine(lineEq, color = 'black', dottedTo = NaN) {
        let u1, v1, u2, v2;
        let yDot, uDot, vDot;

        let b = lineEq[0];
        let m = lineEq[1];

        let x1 = this.xRange[0];
        let x2 = this.xRange[1];

        let y1 = b + m * x1;
        let y2 = b + m * x2;

        if (dottedTo == dottedTo) {
            yDot = b + m * dottedTo;
            [uDot, vDot] = this.mapPoint(dottedTo, yDot);
        }

        // Fix line to box edges
        if (y1 < this.yRange[0]) {
            if (y2 <= this.yRange[0]) { console.log('Line below graph\n'); return } // Line is completely off screen

            y1 = this.yRange[0];
            x1 = (y1 - b) / m;

        }
        else if (y1 > this.yRange[1]) {
            if (y2 >= this.yRange[1]) return // Line is completely off screen

            y1 = this.yRange[1];
            x1 = (y1 - b) / m;
        }

        if (y2 > this.yRange[1]) {
            y2 = this.yRange[1];
            x2 = (y2 - b) / m;
        }
        else if (y2 < this.yRange[0]) {
            y2 = this.yRange[0];
            x2 = (y2 - b) / m;
        }

        [u1, v1] = this.mapPoint(x1, y1);
        [u2, v2] = this.mapPoint(x2, y2);

        push();
        stroke(color); strokeWeight(2);
        if (dottedTo == dottedTo) {
            push();
            drawingContext.setLineDash([10, 5]);
            line(uDot, vDot, u1, v1);
            pop();
            line(uDot, vDot, u2, v2);
        }
        else {
            line(u1, v1, u2, v2);
        }
        pop();
    }

    // Draw a function
    drawFunction(func, color, n = 100) {
        let i, x, y, u, v;
        let x0 = this.xRange[0];
        let dx = (this.xRange[1] - x0) / n;

        push();
        stroke(color); strokeWeight(2);
        noFill();

        beginShape();
        for (i = 0; i <= n; i++) {
            x = x0 + i * dx;
            y = func(x);
            if (y > this.yRange[1]) continue;
            [u, v] = this.mapPoint(x, y);
            vertex(u, v);
        }
        endShape();
        pop();
    }

    mapPoint(x, y) {
        let u = map(x, this.xRange[0], this.xRange[1], this.lx, this.rx);
        let v = map(y, this.yRange[0], this.yRange[1], this.by, this.ty);
        return [u, v]
    }

    // Returns unit vector pointing from p1 to p2
    getDirection(p1, p2) {
        let dx = p2[0] - p1[0], dy = p2[1] - p1[1];
        let magnitude = Math.sqrt(dx ** 2 + dy ** 2);
        let ihat = dx / magnitude, jhat = dy / magnitude;
        return [ihat, jhat];
    }

    drawArrow(tail, head, options = {
        color: 'black',
        arrowSize: 12,
        dashed: false,
    }) {
        let p1 = this.mapPoint(tail[0], tail[1]);
        let p2 = this.mapPoint(head[0], head[1]);
        let dir = this.getDirection(p2, p1);
        let perp = [dir[1], -dir[0]];
        let size = options.arrowSize;

        push();
        stroke(options.color); strokeWeight(2);
        if (options.dashed) drawingContext.setLineDash([8, 5]);

        line(p1[0], p1[1], p2[0], p2[1]);

        noStroke(); fill(options.color);
        triangle(p2[0], p2[1],
            p2[0] + size * (dir[0] + perp[0] / 3), p2[1] + size * (dir[1] + perp[1] / 3),
            p2[0] + size * (dir[0] - perp[0] / 3), p2[1] + size * (dir[1] - perp[1] / 3));

        pop();
    }

}