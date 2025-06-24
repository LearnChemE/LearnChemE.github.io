import { vec2 } from "./globals";

/**
 * Bend Direction given by the pivot point.
 */
export const enum BendDirection {
    UpperLeft    = 0,
    LowerLeft    = 1,
    LowerRight   = 2,
    UpperRight   = 3,
    UpperLeftCW  = 4,
    LowerLeftCW  = 5,
    LowerRightCW = 6,
    UpperRightCW = 7
}

export class PointsList {
    private list: [ pivot: vec2, from: vec2, to: vec2 ];

    constructor (bounds: DOMRect, direction: BendDirection) {
        // Generate coordinates
        let top = bounds.y;
        let lft = bounds.x;
        let bot = bounds.y + bounds.height;
        let rgt = bounds.x + bounds.width;

        // Check if clockwise
        let cw = Math.floor(direction / 4);
        direction %= 4;

        var pivot: vec2;
        var from: vec2;
        var to: vec2;
        // Switch to figure out order
        switch (direction) {
            case BendDirection.UpperLeft:
                pivot = vec2(lft, top);
                from  = vec2(lft, bot);
                to    = vec2(rgt, top);
                break;
            case BendDirection.LowerLeft:
                pivot = vec2(lft, bot);
                from  = vec2(rgt, bot);
                to    = vec2(lft, top);
                break;
            case BendDirection.UpperRight:
                pivot = vec2(rgt, top);
                from  = vec2(lft, top);
                to    = vec2(rgt, bot);
                break;
            case BendDirection.LowerRight:
                pivot = vec2(rgt, bot);
                from  = vec2(rgt, top);
                to    = vec2(lft, bot);
                break;
        }

        // Expand from pivot for graphics to show properly
        const ExpandCoeff = .5;
        from.x += ExpandCoeff * (from.x - pivot.x);
        from.y += ExpandCoeff * (from.y - pivot.y);
        to.x   += ExpandCoeff * (to.x   - pivot.x);
        to.y   += ExpandCoeff * (to.y   - pivot.y);

        // If clockwise, swap from and to
        if (cw) {
            let temp = from;
            from = to;
            to = temp;
        }

        // Construct the list
        this.list = [ pivot, from, to ];
    }

    /**
     * Use the list to generate the SVG XML for the polygon which is displayed in the window.
     * @param t Interpolant. Assumed to be between 0 and 1.
     */
    public toHTML = (t: number): string => {
        let list = this.list;
        let to = vec2( list[1].x + (list[2].x - list[1].x) * t,
                       list[1].y + (list[2].y - list[1].y) * t );

        if (t >= 0) { // Filling
            return `<polygon points="${list[0].x},${list[0].y} ${list[1].x},${list[1].y} ${to.x},${to.y}"></polygon>`;
        }
        else { // Emptying
            return `<polygon points="${list[0].x},${list[0].y} ${to.x},${to.y} ${list[2].x},${list[2].y}"></polygon>`;
        }
    }
}