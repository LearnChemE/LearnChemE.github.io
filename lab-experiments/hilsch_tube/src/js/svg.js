import Graphic from "../assets/graphic.svg";

const svgContainer = document.getElementById("svg-container");

export function importSVG() {
  let graphic_xml = Graphic;
  graphic_xml = graphic_xml.replace(/width=".*?"/, "");
  graphic_xml = graphic_xml.replace(/height=".*?"/, "");
  svgContainer.innerHTML = graphic_xml;
  state.svg = svgContainer.querySelector("svg");
}

export function enableSvgZoom() {
  const svg = document.getElementsByTagName("svg")[0];
  const viewBox = svg.getAttribute("viewBox").split(" ").map(Number);
  state.maxViewBox = viewBox;
  state.viewBox = viewBox;

  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    // set the scaling factor (and make sure it's at least 10%)
    let scale = e.deltaY / 1000;
    scale =
      Math.abs(scale) < 0.1 ? (0.1 * e.deltaY) / Math.abs(e.deltaY) : scale;

    // get point in SVG space
    let pt = new DOMPoint(e.clientX, e.clientY);
    pt = pt.matrixTransform(svg.getScreenCTM().inverse());

    // get viewbox transform
    let [x, y, width, height] = svg
      .getAttribute("viewBox")
      .split(" ")
      .map(Number);
    const amountZoomed =
      width / (state.maxViewBox[2] - state.maxViewBox[0]);
    scale *= Math.max(0.1, amountZoomed);

    // get pt.x as a proportion of width and pt.y as proportion of height
    let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

    // calc new width and height, new x2, y2 (using proportions and new width and height)
    let [width2, height2] = [
      Math.min(state.maxViewBox[2], width + width * scale),
      Math.min(state.maxViewBox[3], height + height * scale),
    ];
    let x2 = Math.max(-130, pt.x - xPropW * width2);
    let y2 = Math.max(10, pt.y - yPropH * height2);

    [width2, height2] = [
      Math.max(-130, Math.min(state.maxViewBox[2] + state.maxViewBox[0] - x2, width2)),
      Math.max(10, Math.min(state.maxViewBox[3] + state.maxViewBox[1] - y2, height2)),
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

export function enableSvgDrag(elts) {
  const svg = document.getElementsByTagName("svg")[0];
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  svg.addEventListener("mousedown", (e) => {
    state.mousedown = true;
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  // Hold mouse to move the camera around
  svg.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const [x, y, width, height] = svg
        .getAttribute("viewBox")
        .split(" ")
        .map(Number);
      const dx = ((prevX - e.clientX) * width) / svg.clientWidth;
      const dy = ((prevY - e.clientY) * height) / svg.clientHeight;
      let viewX = Math.max(-130, x + dx);
      let viewY = Math.max(10, y + dy);
      let viewWidth = Math.min(state.maxViewBox[2], width);
      let viewHeight = Math.min(state.maxViewBox[3], height);
      if (viewX + viewWidth >= state.maxViewBox[2] + state.maxViewBox[0]) {
        viewX = state.maxViewBox[2] + state.maxViewBox[0] - viewWidth;
      }
      if (viewY + viewHeight >= state.maxViewBox[3] + state.maxViewBox[1]) {
        viewY = state.maxViewBox[3] + state.maxViewBox[1] - viewHeight;
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
    state.mousedown = false;
  });
}