/* *************************************************************************************************************** */
/* ********* This file should contain helper/convenience functions to make the rest of the code simpler. ********* */
/* ********* Do not put any imports here! These should ideally all be pure and self-contained. ******************* */
/* *************************************************************************************************************** */

/**
 * Initialize the hamburger menu and button
 * @returns Div containing button and menu with attached callbacks
 */
export function initHamburgerMenu(worksheet: string, worksheetDownload: string) {
    // Create the button element
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-button';
    btn.innerHTML = `<i class="fa-solid fa-bars" ></i>`;

    // Create download element
    const download = document.createElement("a");
    download.id="worksheet-download";
    download.download=worksheetDownload;
    download.innerHTML=`
<button class="menu-item">
    <i class="fas fa-paperclip"></i>
    <span>Worksheet</span> 
</button>`;
    download.setAttribute("href", worksheet);

    // Create the menu element
    const menu = document.createElement("menu");
    menu.className = "menu-content";

    // Create directions button
    const directions = document.createElement("div");
    directions.setAttribute("id", "dir-btn");
    directions.classList.add("menu-item");
    directions.setAttribute("data-modal", "directions-modal");
    directions.innerHTML=`
    <i class="fas fa-book"></i>
    <span>Directions</span> 
    `;

    // Create the About button
    const about = document.createElement("div");
    about.setAttribute("id", "abt-btn");
    about.classList.add("menu-item");
    about.setAttribute("data-modal", "about-modal");
    about.innerHTML=`
    <i class="fas fa-info-circle"></i>
    <span>About</span> 
    `;

    // Append items to menu
    menu.appendChild(directions);
    menu.appendChild(download);
    menu.appendChild(about);

    // Give the hamburger button a callback to toggle the menu
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

    // Buttons open modals
    [directions, about].forEach(btn => {
        btn.addEventListener("click", () => {
            const modalID = btn.getAttribute("data-modal")!;
            const modal = document.getElementById(modalID);
            if (modal) {
                modal.style.display = "block";
                modal.style.opacity = "1";
            }
            menu.style.display = 'none';
        });
    });

    // Close modals buttons
    const closeBtns = document.querySelectorAll('.close-btn')!;
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.closest('.modal')! as HTMLElement;
            target.style.display = 'none';
            target.style.opacity = '0';
        });
    });


    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                (modal as HTMLElement).style.display = 'none';
                (modal as HTMLElement).style.opacity = '0';
            }
        });
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

    btn.addEventListener("pointerdown", start);

    btn.addEventListener("pointerup", stop);
    btn.addEventListener("pointerleave", stop);
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

/**
 * Animate function to be called every frame.
 * @param fn Function to call every frame. dt is time since last call in seconds, t is total time in ms. Return true to continue, false to stop.
 * @param then Optional function to call when animation ends.
 */
export function animate(fn: (dt: number, t: number) => boolean, then?: () => void) {
    let prevtime: number | null = null;

    const frame = (time: number) => {
        if (prevtime === null) prevtime = time;
        const dt = (time - prevtime) / 1000; // in ms
        prevtime = time;

        // Call the function
        const playing = fn(dt, time);

        // Request next frame
        if (playing) requestAnimationFrame(frame);
        else then?.();
    }
    requestAnimationFrame(frame);
}

/**
 * Smoothly lerp x towards targ using a framerate independant exponential decay function
 * @param x number to lerp
 * @param targ lerp target
 * @param r lerping constant. Use form Math.exp(-1/tau) where tau is the time constant with same units as dt
 * @param dt deltaTime. Same units as tau, as used in r.
 * @returns x, but now lerped towards targ
 */
export function smoothLerp(x: number, targ: number, r: number, dt: number) {
    return (x - targ) * r ** dt + targ;
}