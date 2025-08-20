const svgNS = "http://www.w3.org/2000/svg";

export function initLabels() {
    const svg = document.getElementById("pumpBody")!;

    // Create flowrate label
    const flowLabel = document.createElementNS(svgNS, "text")!;
    flowLabel.id = "flow-label";
    flowLabel.classList.add("digital-label");
    flowLabel.classList.add("bitcount-prop-single-display");
    flowLabel.innerHTML = `0.0 mL/s`;
    flowLabel.setAttribute("text-anchor", "end");
    flowLabel.setAttribute("x", "627");
    flowLabel.setAttribute("y", "288");
    flowLabel.setAttribute("position", "absolute");
    flowLabel.setAttribute("fontSize", "16");
    flowLabel.setAttribute("fill", "#A8C64E");
    svg.appendChild(flowLabel);

    // Create thermometer
    const thermLabel = document.createElementNS(svgNS, "text")!;
    thermLabel.id = "therm-label";
    thermLabel.classList.add("digital-label");
    thermLabel.classList.add("bitcount-prop-single-display");
    thermLabel.innerHTML = `25.0 °C`;
    thermLabel.setAttribute("text-anchor", "middle");
    thermLabel.setAttribute("x", "857");
    thermLabel.setAttribute("y", "140");
    thermLabel.setAttribute("position", "absolute");
    thermLabel.setAttribute("fontSize", "28");
    thermLabel.setAttribute("fill", "#2A2A24");
    document.getElementById("thermoBody")!.appendChild(thermLabel);
}

export function updateFlowLabel(flowrate: number) {
    const label = document.getElementById("flow-label")!;
    label.innerHTML = `${flowrate.toFixed(1)} mL/s`;
}

export function updateThermLabel(temperature: number) {
    const label = document.getElementById("therm-label")!;
    label.innerHTML = `${temperature.toFixed(1)} mL/s`;
}