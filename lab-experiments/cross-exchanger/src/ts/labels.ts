const svgNS = "http://www.w3.org/2000/svg";

export function initLabels() {
    const svg = document.getElementById("pumpBody")!;

    // Create label
    const flowLabel = document.createElementNS(svgNS, "text")!;
    flowLabel.id = "flow-label";
    flowLabel.classList.add("digital-label");
    flowLabel.classList.add("bitcount-prop-single-display");
    flowLabel.innerHTML = `0.00 mL/s`;
    flowLabel.setAttribute("text-anchor", "end");
    flowLabel.setAttribute("x", "625");
    flowLabel.setAttribute("y", "286");
    flowLabel.setAttribute("position", "absolute");
    flowLabel.setAttribute("fontSize", "16");
    flowLabel.setAttribute("fill", "#A8C64E");
    svg.appendChild(flowLabel);
}

export function updateFlowLabel(flowrate: number) {
    const label = document.getElementById("flow-label")!;
    label.innerHTML = `${flowrate.toFixed(2)} mL/s`;
}