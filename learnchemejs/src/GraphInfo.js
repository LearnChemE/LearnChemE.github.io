/**
    Container class for graph/calibration data
    @param {object} args Object of input arguments.
    @param {int} args.graphheight Height (in px) of the vertical (y) axes
    @param {int} args.graphwidth Width (in px) of the horizontal (x) axes
    @param {string} args.graphbackground Color of the area within the axes
    @param {string} args.axesbackground Color of the area around the graph
    @param {object} args.padding Container for padding size around the plot
        @param {int} args.padding.top Height (in px) of the region above the plot
        @param {int} args.padding.left Width (in px) of the region to the left of the plot
        @param {int} args.padding.bottom Height (in px) of the region below the plot
        @param {int} args.padding.right Width (in px) of the region to the right of the plot
    @param {object} args.x Container for information about the primary x axis
        @param {string} args.x.label Text to label the axis
        @param {float} args.x.min Left/bottom value on the axis
        @param {float} args.x.max Right/top value on the axis
        @param {float} args.x.majortick Increment to draw major tick marks on the axis
        @param {float} args.x.minortick Increment to draw minor tick marks on the axis
        @param {float} args.x.gridline Increent to draw gridlines across the plot
    @param {object} args.y Container for information about the primary y axis (same arguments as {@link x})
    @param {object} args.x2 Container for information about the secondary x axis (same arguments as {@link x})
    @param {object} args.y2 Container for information about the secondary y axis (same arguments as {@link x})
*/
export class GraphInfo {
    constructor(args) {
        for (let key of Object.keys(args)) {
            this[key] = args[key];
        }
        this.height = this.graphheight + this.padding.bottom + this.padding.top;
        this.width = this.graphwidth + this.padding.left + this.padding.right;
        this.graphleft = this.padding.left;
        this.graphright = this.padding.left + this.graphwidth;
        this.graphtop = this.padding.top;
        this.graphbottom = this.padding.top + this.graphheight;

        // Generate calibration values/functions
        if (this.x != undefined) {
            this.setupAxis(this.x, this.padding.left, this.graphwidth, this.x.min, this.x.max);
        }
        if (this.y != undefined) {
            this.setupAxis(this.y, this.padding.top, this.graphheight, this.y.max, this.y.min);
        }
        if (this.x2 != undefined) {
            this.setupAxis(this.x2, this.padding.left, this.graphwidth, this.x2.min, this.x2.max);
        }
        if (this.y2 != undefined) {
            this.setupAxis(this.y2, this.padding.top, this.graphheight, this.y2.max, this.y2.min);
        }
    }
    /**
    * TODO
    */
    setupAxis(axis, padding, graphsize, axismin, axismax) {
        axis.scale = graphsize / (axismax - axismin);
        axis.CalToRaw = function(cal) {
            return (cal - axismin) * axis.scale + padding;
        };
        axis.RawToCal = function(raw) {
            return (raw - padding) / axis.scale + axismin;
        };
    }
}
