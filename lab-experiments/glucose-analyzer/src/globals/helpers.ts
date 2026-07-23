/* *************************************************************************************************************** */
/* ********* This file should contain helper/convenience functions to make the rest of the code simpler. ********* */
/* ********* Do not put any imports here! These should ideally all be pure and self-contained. ******************* */
/* *************************************************************************************************************** */

/**
 * Namespace for certain SVG calls
 */
export const svgNS = "http://www.w3.org/2000/svg";

/**
 * Helper type for 2-component vectors
 */
export type vec2 = {
    x: number,
    y: number
};

/**
 * Alias to help initialize a vec2
 * @param x default 0
 * @param y default 0
 * @returns vec2 object
 */
export const vec2 = (x: number = 0, y: number = 0): vec2 => {
    return {x: x, y: y};
}

/**
 * Gets an element through document.getElementById and safely returns it after checking.
 * @param id Unique identifier
 * @returns Element
 */
export function GetElement<T = HTMLElement>(id: string): T {
    const e = document.getElementById(id);
    // Check
    if (e === null) throw new Error(`getElementById: Could not get element ${id}`);
    // Cast and return
    return e as unknown as T;
}

/**
 * Parse and insert SVG into a div
 * @param {string} svg SVG source to be inserted
 * @returns {HTMLDivElement} Div containing svg
 */
export function insertSVG(svg: string): HTMLDivElement {
    const div = document.createElement("div");
  
    // Set basic attributes
    div.id = "apparatus-wrapper";
    div.innerHTML = svg;
    return div;
}

/**
 * Constrain a number x to be at least min and at most max.
 * @param x Number to constrain
 * @param min minimum constraining value
 * @param max maximum constraining value
 * @returns Constrained value
 */
export function constrain(x: number, min: number, max: number) {
    if (x < min) x = min;
    if (x > max) x = max;
    return x;
}

/**
 * Find the angle between A->B and down (0,1).
 * @param A 
 * @param B 
 * @returns 
 */
export function getAngleFromDown(A: { x: number, y: number }, B: { x: number, y: number }) {
    var dx = B.x - A.x;
    var dy = B.y - A.y;
    var mag = Math.sqrt(dx*dx + dy*dy);
    return -Math.sign(dx) * Math.acos(dy / mag) * 180 / Math.PI;
}

/**
 * Check an element for a child defs element. If none are found, append a new defs element.
 * @param parent Node to be searched for defs children. Note if none are found, a new defs element will be inserted to this node.
 * @returns Reference to new defs element.
 */
const checkForDefs = (parent: HTMLElement): SVGDefsElement => {
    // Start with null defs
    let defs: SVGDefsElement | null = null;

    // Search each child node for a defs element
    parent.childNodes.forEach((value) => {
        if (value.nodeName === "defs")
            defs = value as unknown as SVGDefsElement;
    });

    // If defs were not found, append a new defs element to parent
    if (defs === null) {
        defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
        parent.appendChild(defs);
    }
    // Return the defs element
    return defs;
}

/**
 * Insert a new clip path to the child of the corresponding element.
 * @param e Element to attach clip path to
 * @param clippathID ID to name clippath from
 * @param bbox bounding box of element to create rect
 * @returns Clippath inserted by function
 */
export function insertClipPath(e: HTMLElement | SVGAElement | SVGPathElement, clippathID: string, bbox: DOMRect) {
    // Get the parent element
    const parent = e.parentElement!;
    const defs = checkForDefs(parent);
    // Create a clip path div
    const clippath = document.createElementNS("http://www.w3.org/2000/svg","clipPath");
    clippath.setAttribute("id", clippathID + "-clip");

    // Create rect for clip path
    const rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x",`${bbox.x}`);
    rect.setAttribute("y",`${bbox.y}`);
    rect.setAttribute("width",`${bbox.width}`);
    rect.setAttribute("height",`${0}`);
    clippath.appendChild(rect);

    // Insert the new clip path
    parent.appendChild(defs);
    defs.appendChild(clippath);
    // Apply the clip path styling
    var child = e.childNodes[0] as unknown as SVGAElement;
    if (child === undefined)
        child = e as unknown as SVGAElement;
    child.setAttribute("clip-path",`url(#${clippathID + "-clip"})`);

    // Return the polygon element
    return clippath;
}

/**
 * Check if two SVG Elements are overlapping
 * @param el1 Element 1
 * @param el2 Element 2
 * @returns True if bboxes are overlapping; false if not.
 */
export function isOverlapping(el1: SVGGElement, el2: SVGRectElement) {
    console.log(el1, el2)
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  console.log(r1, r2)

  return !(
    r1.x + r1.width  < r2.x ||
    r1.x > r2.x + r2.width ||
    r1.y + r1.height < r2.y ||
    r1.y > r2.y + r2.height
  );
}

/* ******************************************** */
/* *************** Drag and Zoom ************** */
/* ******************************************** */

type Viewbox = {
    maxViewBox: number[];
    curViewBox: number[];
}
var viewState: Viewbox;

function getDistance(touches: TouchList) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx*dx + dy*dy);
}

export function initSvgZoom() {
    // Get the svg context
    const svg = document.querySelector("svg")!;
    const viewBox = svg.getAttribute("viewBox")!.split(" ").map(Number);
    viewState = {
        maxViewBox: viewBox,
        curViewBox: viewBox
    };

    const zoom = (scale: number, pt: DOMPoint) => {
        // alert(scale)
        pt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

        // get viewbox transform
        let [x, y, width, height] = svg
        .getAttribute("viewBox")!
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

    let startDist: number | null = null;
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
        const pt = new DOMPoint((e.touches.item(0)!.clientX + e.touches.item(1)!.clientX) / 2,
                                    (e.touches.item(0)!.clientY + e.touches.item(1)!.clientY) / 2);

        zoom(scale, pt)
    });
    svg.addEventListener("touchend", e => {
        if (e.touches.length < 2) {
            startDist = null;
        }
    });
}

export function initSvgDrag(exemptIDs?: string[]) {
    // Get exempt elements provided
    const exemptElements: HTMLElement[] = [];
    if (exemptIDs !== undefined && exemptIDs.length > 0) {
        exemptIDs!.forEach(id => exemptElements.push(GetElement(id)));
    }
    
    // Find exempt elements from class
    const classExempt = document.querySelectorAll(".drag-exempt");
    classExempt.forEach(el => {
        exemptElements.push(el as unknown as HTMLElement);
    });

    // Get the svg context
    const svg = document.querySelector("svg")!;
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
            if (el.contains(e.target as Node)) {
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
            .getAttribute("viewBox")!
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

// --- Resize Handling ---
export function enableWindowResize() {
    const e = document.querySelector("svg")!;
    const asp = e.clientWidth / e.clientHeight;
    if (e.clientWidth === 0 || e.clientHeight === 0) {
        console.warn("svg resized before initial loading. Retrying.");
        window.setTimeout(enableWindowResize, 10);
        return;
    }
    // Attach event handler
    const resize = () => {
        let windowWidth = Math.max(Math.min(window.innerWidth * .8, 1800), 400);
        let windowHeight = Math.max(window.innerHeight * .95 - 50, 400 * asp);
        if (windowHeight < 0) throw new Error(`${windowWidth}, ${windowHeight}`)
        // Enforce asp
        windowWidth = Math.min(windowWidth, windowHeight * asp);
        if (windowWidth !== windowWidth) throw new Error(`e: ${e.clientWidth}, ${e.clientHeight}`)
        windowHeight = windowWidth / asp;
        // Resize canvas
        e.setAttribute("width", `${windowWidth}`);
        e.setAttribute("height", `${windowHeight}`);
    };
    window.addEventListener('resize', resize);
    resize();
}

/**
 * Get SVG coordinates from a mouse or touch event
 * @param evt Mouse or touch event
 * @returns SVG coordinates as a point
 */
export function getSVGCoords(evt: MouseEvent | Touch) {
    const svg = document.querySelector("svg")!;
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}

/**
 * Animate function to be called every frame.
 * @param fn Function to call every frame. dt is time since last call in seconds, t is total time in s. Return true to continue, false to stop.
 * @param then Optional function to call when animation ends.
 */
export function animate(fn: (dt: number, t: number) => boolean, then?: () => void) {
    let prevtime: number | null = null;
    let startTime: number | null = null;

    const frame = (time: number) => {
        if (prevtime === null) prevtime = time;
        if (startTime === null) startTime = time;
        const dt = Math.min((time - prevtime) / 1000, .3); // in ms
        prevtime = time;

        // Call the function
        const playing = fn(dt, (time - startTime) / 1000);

        // Request next frame
        if (playing) requestAnimationFrame(frame);
        else then?.();
    }
    requestAnimationFrame(frame);
}

// Helper to accept either a value or an accessor to a value
export function resolveProperty<T>(val: T | (() => T) | undefined, fallback?: T): () => T {
    if (val === undefined) {
        if (fallback === undefined) {
            throw new Error("resolveValue: both value and fallback are undefined");
        }
        return () => fallback;
    }
    return (typeof val === "function" ? val : () => val) as () => T;
}

/**
 * Transpose a 2x2 array
 * @param arr array to transpose with dimension [m, n]
 * @returns transposed array with dimension [n, m]
 */
export function transpose(arr: number[][]) {
    const rows = arr.length, cols = arr[0].length;
    const grid = [];
    for (let j = 0; j<cols; j++) {
        grid[j] = Array(rows);
    }
    for (let i=0;i<rows;i++) {
        for (let j=0;j<cols;j++) {
            grid[j][i] = arr[i][j];
        }
    }
    return grid;
}

export function repeatClick(fn: () => void, initialDelay: number = 600, successiveDelay: number = 200) {
    let playing = true;

    // Cleanup when pointer is released
    const clean = () => {
        playing = false;
        document.removeEventListener("pointerup", clean);
    }
    document.addEventListener("pointerup", clean);

    // Wrapper for successive presses
    const fnCaller = () => {
        if (!playing) return;
        fn();
        // Set next delay
        window.setTimeout(fnCaller, successiveDelay);
    };
    // Initial Press
    fn();
    // Next press
    window.setTimeout(fnCaller, initialDelay);
}

/**
 * Decay x towards targ using a framerate independant exponential decay function
 * @param x number to lerp
 * @param targ lerp target
 * @param tau time constant. Tau must have same units as dt
 * @param dt deltaTime. Same units as tau, as used in r.
 * @returns x, but now lerped towards targ
 */
export function expDecay(x: number, targ: number, tau: number, dt: number) {
    return (x - targ) * Math.exp(-dt / tau) + targ;
}

// Returns num with added noise following a gauss distribution with given stdev
export function gaussNoise(mean: number, stdev: number, p?: number) {
  // Get probability from uniform dist
  if (!p) p = Math.random();
  // Lookup z value
  var z = invNorm(p);
  // calculate x using mean and stdev and return
  return z * stdev + mean;
};

// Inverse Z lookup, code by DeepSpace101
// https://stackoverflow.com/questions/8816729/javascript-equivalent-for-inverse-normal-function-eg-excels-normsinv-or-nor
function invNorm(p: number) {
  var a1 = -39.6968302866538,
    a2 = 220.946098424521,
    a3 = -275.928510446969;
  var a4 = 138.357751867269,
    a5 = -30.6647980661472,
    a6 = 2.50662827745924;
  var b1 = -54.4760987982241,
    b2 = 161.585836858041,
    b3 = -155.698979859887;
  var b4 = 66.8013118877197,
    b5 = -13.2806815528857,
    c1 = -7.78489400243029e-3;
  var c2 = -0.322396458041136,
    c3 = -2.40075827716184,
    c4 = -2.54973253934373;
  var c5 = 4.37466414146497,
    c6 = 2.93816398269878,
    d1 = 7.78469570904146e-3;
  var d2 = 0.32246712907004,
    d3 = 2.445134137143,
    d4 = 3.75440866190742;
  var p_low = 0.02425,
    p_high = 1 - p_low;
  var q, r;
  var retVal;

  if (p < 0 || p > 1) {
    alert("NormSInv: Argument out of range.");
    retVal = 0;
  } else if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    retVal =
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    retVal =
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    retVal =
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  return retVal;
}

// export function addOUNoise(x: number, dt: number, tau: number, sigma: number, prevNoise: number) {
//     // Calculate the new noise value using the Ornstein-Uhlenbeck process
//     const newNoise = prevNoise + (-(prevNoise / tau) * dt) + (sigma * Math.sqrt(dt) * gaussNoise(0, 1));
//     // Return the new value with noise added
//     return x + newNoise;
// }

export function getCanvasColorAt(svgElement: SVGElement, clickX: number, clickY: number) {
  return new Promise((resolve) => {
    // 1. Convert SVG DOM element to a string Data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // 2. Draw SVG to canvas matching dimensions
      const canvas = document.createElement('canvas');
      canvas.width = svgElement.clientWidth;
      canvas.height = svgElement.clientHeight;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 3. Extract the RGBA values of the target pixel
      const pixel = ctx.getImageData(clickX, clickY, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;

      URL.revokeObjectURL(url);
      resolve(hex);
    };

    img.src = url;
  });
}