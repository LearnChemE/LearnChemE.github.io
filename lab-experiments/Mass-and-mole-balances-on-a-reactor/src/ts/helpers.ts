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
 * Initialize the hamburger menu and button
 * @returns Div containing button and menu with attached callbacks
 */
export function initHamburgerMenu(worksheet: string, worksheetDownload: string) {
    // Create the button element
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-button';
    btn.innerHTML = `<i class="fas fa-bars"></i>`;

    // Create download element
    const download = document.createElement("a");
    download.id="worksheet-download";
    download.download=worksheetDownload;
    download.innerHTML=`<button id="wks-btn" type="button" class="btn btn-primary btn-wide"> Worksheet </button>`;
    download.setAttribute("href", worksheet);

    // Create the menu element
    const menu = document.createElement("menu");
    menu.className = "menu-content";
    menu.innerHTML = `
            <button id="dir-btn" type="button" class="btn btn-primary btn-wide" data-bs-toggle="modal" data-bs-target="#directions-modal"> Directions </button>
            `;
    menu.appendChild(download);
    menu.insertAdjacentHTML("beforeend", `
            <button id="abt-btn" type="button" class="btn btn-primary btn-wide" data-bs-toggle="modal" data-bs-target="#about-modal"> About </button>
        `);

    // Give the button a callback to toggle the menu
    function toggleMenu(): void {
        menu.style.display = (menu.style.display === 'grid') ? 'none' : 'grid';
    }
    btn.onclick = () => toggleMenu();

    // Create a div to contain the button and menu
    const div = document.createElement('div');
    div.appendChild(btn);
    div.appendChild(menu);

    // Click outside to close
    document.addEventListener('click', e => {
        const trg = e.target as unknown as Node;
        if (!btn.contains(trg) && !menu.contains(trg)) {
            menu.style.display = 'none';
        }
    });

    // Return the wrapper
    return div;
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
export function findAngleFromDown(A: { x: number, y: number }, B: { x: number, y: number }) {
    var dx = B.x - A.x;
    var dy = B.y - A.y;
    var mag = Math.sqrt(dx*dx + dy*dy);
    return -Math.sign(dx) * Math.acos(dy / mag) * 180 / Math.PI;
}

/**
 * Determine if an element has a parent within n ancestors with a given ID or set of IDs.
 * @param elem Target element to check
 * @param ids List of ids to match against parents
 * @param n Number of levels to check
 * @returns true if matching ID is found in n levels; false if not.
 */
export function containsParentWithID(elem: HTMLElement, ids: string | Array<string>, n: number = 3) {
    if (!Array.isArray(ids)) {
        ids = [ids];
    }

    // Compare the ids to the elements
    const compare = (elem: HTMLElement, ids: Array<string>) => {
        let eid = elem.id;
        let compare = false;
        for (let id of ids) compare = compare || (id === eid);
        return compare;
    }

    // Check the parents of the target
    for (let i=0;i<n;i++) {
        // Compare
        if (compare(elem, ids)) return true;
        // Check parent next
        if (elem.parentElement) {
            elem = elem.parentElement;
        }
        else return false
    }
    
    return false;
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

/**
 * Initialize a button with the proper class and callback
 * @param id ID of the button's group element
 * @param onClick Callback for click event
 */
export function initButton(id: string, onClick: () => void) {
    const btn = document.getElementById(id)!;
    btn.classList.add("svg-btn");

    let isHolding = false;
    let timeoutId: number | null = null;
    const speedUpFactor = 0.5;

    const start = () => {
        if (isHolding) return;
        isHolding = true;

        // Perform action once
        onClick();
        
        scheduleNext(500);
    }

    const stop = () => {
        isHolding = false;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    const scheduleNext = (delay: number) => {
        timeoutId = window.setTimeout(() => {
            if (!isHolding) return;
            onClick();
            const nextSpeed = Math.max(100, delay * speedUpFactor);
            scheduleNext(nextSpeed);
        }, delay);
    }

    btn.addEventListener("mousedown", start);
    btn.addEventListener("touchstart", start);

    btn.addEventListener("mouseup", stop);
    btn.addEventListener("mouseleave", stop);
    btn.addEventListener("touchend", stop);
}

/**
 * Make a property of an object observable via a proxy
 * @param obj 
 * @param onChange 
 * @returns 
 */
export function makeObservable<T extends object>(obj: T, onChange: (prop: string | symbol, val: any) => void) {
    return new Proxy(obj, {
        set(target, prop, value) {
            target[prop as keyof T] = value;
            onChange(prop, value);
            return true;
        }
    });
}

/* ******************************************** */
/* *************** Drag and Zoom ************** */
/* ******************************************** */

type Viewbox = {
    maxViewBox: number[];
    curViewBox: number[];
}
var viewState: Viewbox;

export function initSvgZoom() {
    const wrapper = document.getElementById("apparatus-wrapper")!;
    const svg = wrapper.childNodes[0] as unknown as SVGAElement;
    const viewBox = svg.getAttribute("viewBox")!.split(" ").map(Number);
    viewState = {
        maxViewBox: viewBox,
        curViewBox: viewBox
    };

  wrapper.addEventListener("wheel", (e) => {
    e.preventDefault();
    // set the scaling factor (and make sure it's at least 10%)
    let scale = e.deltaY / 1000;
    scale =
      Math.abs(scale) < 0.1 ? (0.1 * e.deltaY) / Math.abs(e.deltaY) : scale;

    // get point in SVG space
    let pt = new DOMPoint(e.clientX, e.clientY);
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
  });
}

export function initSvgDrag() {
    // Get the svg context
    const wrapper = document.getElementById("apparatus-wrapper")!;
    const svg = wrapper.childNodes[0] as unknown as SVGAElement;
    // Set defaults
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    svg.addEventListener("mousedown", (e) => {
        if (containsParentWithID(e.target as HTMLElement, ['flowDial','Switch','fanSwitch','thermStick'])) return;
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    // Hold mouse to move the camera around
    svg.addEventListener("mousemove", (e) => {
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

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

// --- Resize Handling ---
export function enableWindowResize() {
    const e = document.getElementById("apparatus-wrapper")!.childNodes[0] as unknown as SVGAElement;
    const asp = e.clientWidth / e.clientHeight;
    // Attach event handler
    const resize = () => {
        let windowWidth = Math.max(Math.min(window.innerWidth * .8, 1800), 400);
        let windowHeight = window.innerHeight * .95 - 50;
        // Enforce asp
        windowWidth = Math.min(windowWidth, windowHeight * asp);
        windowHeight = windowWidth / asp;
        // Resize canvas
        e.setAttribute("width", `${windowWidth}`);
        e.setAttribute("height", `${windowHeight}`);
    };
    window.addEventListener('resize', resize);
    resize();
}
