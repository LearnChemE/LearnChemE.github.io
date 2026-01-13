
/* ******************************************** */
/* *************** Drag and Zoom ************** */
/* ******************************************** */

/**
 * Gets an element through document.getElementById and safely returns it after checking.
 * @param id Unique identifier
 * @returns Element
 */
export function GetElement(id) {
    const e = document.getElementById(id);
    // Check
    if (e === null) throw new Error(`getElementById: Could not get element ${id}`);
    // Cast and return
    return e;
}

/**
 * Constrain a number x to be at least min and at most max.
 * @param x Number to constrain
 * @param min minimum constraining value
 * @param max maximum constraining value
 * @returns Constrained value
 */
export function constrain(x, min, max) {
    if (x < min) x = min;
    if (x > max) x = max;
    return x;
}


var viewState;

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx*dx + dy*dy);
}

export function initSvgZoom() {
    // Get the svg context
    const svg = document.querySelector("svg");
    svg.setAttribute("viewBox",`0 0 ${svg.getAttribute("width")} ${svg.getAttribute("height")}`)
    const viewBox = svg.getAttribute("viewBox").split(" ").map(Number);
    viewState = {
        maxViewBox: viewBox,
        curViewBox: viewBox
    };

    const zoom = (scale, pt) => {
        // alert(scale)
        pt = pt.matrixTransform(svg.getScreenCTM().inverse());

        // get viewbox transform
        let [x, y, width, height] = svg
        .getAttribute("viewBox")
        .split(" ")
        .map(Number);
        const amountZoomed =
        width / (viewState.maxViewBox[2] - viewState.maxViewBox[0]);
        scale *= Math.max(0.1, amountZoomed);

        // get pt.x as a proportion of width and pt.y as proportion of height
        let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

        // calc new width and height, new x2, y2 (using proportions and new width and height)
        let [width2, height2] = [
        Math.min(viewState.maxViewBox[2], width + width * scale),
        Math.min(viewState.maxViewBox[3], height + height * scale),
        ];
        let x2 = Math.max(0, pt.x - xPropW * width2);
        let y2 = Math.max(0, pt.y - yPropH * height2);

        [width2, height2] = [
        Math.max(10, Math.min(viewState.maxViewBox[2] - x2, width2)),
        Math.max(10, Math.min(viewState.maxViewBox[3] - y2, height2)),
        ];

        if (
        Number.isNaN(x2) ||
        Number.isNaN(y2) ||
        Number.isNaN(width2) ||
        Number.isNaN(height2)
        ) {
        return;
        }

        svg.setAttribute("viewBox", `${x2} ${y2} ${width2} ${height2}`);
    }

    svg.addEventListener("wheel", (e) => {
        e.preventDefault();
        // set the scaling factor (and make sure it's at least 10%)
        let scale = e.deltaY / 1000;
        scale = Math.abs(scale) < 0.1 ? (0.1 * e.deltaY) / Math.abs(e.deltaY) : scale;
        // get point in SVG space
        let pt = new DOMPoint(e.clientX, e.clientY);
        // Zoom
        zoom(scale, pt);
    });

    let startDist = null;
    svg.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 2) return;
        e.preventDefault();
        const dist = getDistance(e.touches);
        startDist = dist;
    });

    svg.addEventListener("touchmove", (e) => {
        if (e.touches.length !== 2) return;
        if (startDist === null) return;
        e.preventDefault();
        // Get the distance between the two points
        const dist = getDistance(e.touches);
        const scale = constrain((startDist / dist - 1) * 2, -.1, .1);
        // alert(`scale = ${scale}`)
        startDist = dist;

        // Find the average point
        const pt = new DOMPoint((e.touches.item(0).clientX + e.touches.item(1).clientX) / 2,
                                    (e.touches.item(0).clientY + e.touches.item(1).clientY) / 2);

        zoom(scale, pt)
    });
    svg.addEventListener("touchend", e => {
        if (e.touches.length < 2) {
            startDist = null;
        }
    });
}

export function initSvgDrag(exemptIDs) {
    // Get exempt elements provided
    const exemptElements = [];
    if (exemptIDs !== undefined && exemptIDs.length > 0) {
        exemptIDs.forEach(id => exemptElements.push(GetElement(id)));
    }
    
    // Find exempt elements from class
    const classExempt = document.querySelectorAll(".drag-exempt");
    classExempt.forEach(el => {
        exemptElements.push(el);
    });

    // Get the svg context
    const svg = document.querySelector("svg");
    // Set defaults
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    // Begin dragging on pointer down
    svg.addEventListener("pointerdown", (e) => {
        // Check exemptions
        let exempt = false;
        let allExemptions = [...exemptElements, ...document.querySelectorAll(".drag-exempt-slippery")];
        allExemptions.forEach(el => {
            if (el.contains(e.target)) {
                exempt = true;
                return;
            }
        });
        if (exempt) return;
        
        // Start dragging
        e.preventDefault();
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    // Hold pointer to move the camera around
    svg.addEventListener("pointermove", (e) => {
        if (isDragging) {
        const [x, y, width, height] = svg
            .getAttribute("viewBox")
            .split(" ")
            .map(Number);
        // const dx = ((prevX - e.clientX) * width) / svg.clientWidth;
        const dx = ((prevX - e.clientX) * width) / svg.clientWidth;
        const dy = ((prevY - e.clientY) * height) / svg.clientHeight;
        let viewX = Math.max(0, x + dx);
        let viewY = Math.max(0, y + dy);
        let viewWidth = Math.min(viewState.maxViewBox[2], width);
        let viewHeight = Math.min(viewState.maxViewBox[3], height);
        if (viewX + viewWidth >= viewState.maxViewBox[2]) {
            viewX = viewState.maxViewBox[2] - viewWidth;
        }
        if (viewY + viewHeight >= viewState.maxViewBox[3]) {
            viewY = viewState.maxViewBox[3] - viewHeight;
        }
        svg.setAttribute(
            "viewBox",
            `${viewX} ${viewY} ${viewWidth} ${viewHeight}`
        );
        prevX = e.clientX;
        prevY = e.clientY;
        }
    });

    document.addEventListener("pointerup", () => {
        isDragging = false;
    });
}
