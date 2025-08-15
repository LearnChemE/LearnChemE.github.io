/* *************************************************************************************************************** */
/* ********* This file should contain helper/convenience functions to make the rest of the code simpler. ********* */
/* ********* Do not put any imports here! These should ideally all be pure and self-contained. ******************* */
/* *************************************************************************************************************** */

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

/* ******************************************** */
/* *************** Drag and Zoom ************** */
/* ******************************************** */

// type Viewbox = {
//     maxViewBox: number[];
//     curViewBox: number[];
// }
// var viewState: Viewbox;

// function containsParentWithID(elem: HTMLElement, ids: string | Array<string>) {
//     if (!Array.isArray(ids)) {
//         ids = [ids];
//     }

//     // Compare the ids to the elements
//     const compare = (elem: HTMLElement, ids: Array<string>) => {
//         let eid = elem.id;
//         let compare = false;
//         for (let id of ids) compare = compare || (id === eid);
//         return compare;
//     }

//     // Check the parents of the target
//     for (let i=0;i<3;i++) {
//         // Compare
//         if (compare(elem, ids)) return true;
//         // Check parent next
//         if (elem.parentElement) {
//             elem = elem.parentElement;
//         }
//         else return false
//     }
    
//     return false;
// }

// export function enableSvgZoom() {
//     const wrapper = document.getElementById("apparatus-wrapper");
//     const svg = wrapper.childNodes[0] as unknown as SVGAElement;
//     const viewBox = svg.getAttribute("viewBox").split(" ").map(Number);
//     viewState = {
//         maxViewBox: viewBox,
//         curViewBox: viewBox
//     };

//   wrapper.addEventListener("wheel", (e) => {
//     e.preventDefault();
//     // set the scaling factor (and make sure it's at least 10%)
//     let scale = e.deltaY / 1000;
//     scale =
//       Math.abs(scale) < 0.1 ? (0.1 * e.deltaY) / Math.abs(e.deltaY) : scale;

//     // get point in SVG space
//     let pt = new DOMPoint(e.clientX, e.clientY);
//     pt = pt.matrixTransform(svg.getScreenCTM().inverse());

//     // get viewbox transform
//     let [x, y, width, height] = svg
//       .getAttribute("viewBox")
//       .split(" ")
//       .map(Number);
//     const amountZoomed =
//       width / (viewState.maxViewBox[2] - viewState.maxViewBox[0]);
//     scale *= Math.max(0.1, amountZoomed);

//     // get pt.x as a proportion of width and pt.y as proportion of height
//     let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

//     // calc new width and height, new x2, y2 (using proportions and new width and height)
//     let [width2, height2] = [
//       Math.min(viewState.maxViewBox[2], width + width * scale),
//       Math.min(viewState.maxViewBox[3], height + height * scale),
//     ];
//     let x2 = Math.max(0, pt.x - xPropW * width2);
//     let y2 = Math.max(0, pt.y - yPropH * height2);

//     [width2, height2] = [
//       Math.max(10, Math.min(viewState.maxViewBox[2] - x2, width2)),
//       Math.max(10, Math.min(viewState.maxViewBox[3] - y2, height2)),
//     ];

//     if (
//       Number.isNaN(x2) ||
//       Number.isNaN(y2) ||
//       Number.isNaN(width2) ||
//       Number.isNaN(height2)
//     ) {
//       return;
//     }

//     svg.setAttribute("viewBox", `${x2} ${y2} ${width2} ${height2}`);
//     updateCanvasPosition();
//   });
// }

// var mousedown = false;
// export function enableSvgDrag() {
//     // Get the svg context
//     const wrapper = document.getElementById("apparatus-wrapper");
//     const svg = wrapper.childNodes[0] as unknown as SVGAElement;
//     // Set defaults
//     let isDragging = false;
//     let prevX = 0;
//     let prevY = 0;

//     svg.addEventListener("mousedown", (e) => {
//         if (containsParentWithID(e.target as HTMLElement, ['Valve','Valve_2'])) return;
//         mousedown = true;
//         isDragging = true;
//         prevX = e.clientX;
//         prevY = e.clientY;
//     });

//     // Hold mouse to move the camera around
//     svg.addEventListener("mousemove", (e) => {
//         if (isDragging) {
//         const [x, y, width, height] = svg
//             .getAttribute("viewBox")
//             .split(" ")
//             .map(Number);
//         const dx = ((prevX - e.clientX) * width) / svg.clientWidth;
//         const dy = ((prevY - e.clientY) * height) / svg.clientHeight;
//         let viewX = Math.max(0, x + dx);
//         let viewY = Math.max(0, y + dy);
//         let viewWidth = Math.min(viewState.maxViewBox[2], width);
//         let viewHeight = Math.min(viewState.maxViewBox[3], height);
//         if (viewX + viewWidth >= viewState.maxViewBox[2]) {
//             viewX = viewState.maxViewBox[2] - viewWidth;
//         }
//         if (viewY + viewHeight >= viewState.maxViewBox[3]) {
//             viewY = viewState.maxViewBox[3] - viewHeight;
//         }
//         svg.setAttribute(
//             "viewBox",
//             `${viewX} ${viewY} ${viewWidth} ${viewHeight}`
//         );
//         prevX = e.clientX;
//         prevY = e.clientY;
//         updateCanvasPosition();
//         }
//     });

//     document.addEventListener("mouseup", () => {
//         isDragging = false;
//         mousedown = false;
//     });
// }

// enableSvgZoom();
// enableSvgDrag();