

class P5_Graph {
    constructor(options) {
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
        rect(0, 0, 700, 420);
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
        count = 24;

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
        count = 24;

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
        noStroke(); textSize(18);
        text(this.options.xTitle, (rx - lx) / 2, by + 36);

        push();
        translate(this.lx - 40, (2 * by + ty) / 3);
        rotate(radians(-90));
        text(this.options.yTitle, 0, 0);
        pop();

        // TODO: Optional super title
        pop();
    }
}