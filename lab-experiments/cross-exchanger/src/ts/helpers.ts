/* *************************************************************************************************************** */
/* ********* This file should contain helper/convenience functions to make the rest of the code simpler. ********* */
/* ********* Do not put any imports here! These should ideally all be pure and self-contained. ******************* */
/* *************************************************************************************************************** */

import type { vec2 } from "../types";

/**
 * Initialize the hamburger menu and button
 * @returns Div containing button and menu with attached callbacks
 */
export function initHamburgerMenu() {
    // Create the button element
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-button';
    btn.innerHTML = `<div>☰</div>`;

    // Create the menu element
    const menu = document.createElement("menu");
    menu.className = "menu-content";
    menu.innerHTML = `
            <button id="dir-btn" type="button" class="btn btn-primary btn-wide" data-bs-toggle="modal" data-bs-target="#directions-modal"> Directions </div>
            <button id="wks-btn" type="button" class="btn btn-primary btn-wide"> Worksheet </div>
            <button id="abt-btn" type="button" class="btn btn-primary btn-wide" data-bs-toggle="modal" data-bs-target="#about-modal"> About </div>
            `;

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
export function findAngleFromDown(A: vec2, B: vec2) {
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
 * @param id Id to name the new elements from
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
    clippath.innerHTML = `<rect x="${bbox.x}" y="${bbox.y}" width="${bbox.width}" height="${0}">`;

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