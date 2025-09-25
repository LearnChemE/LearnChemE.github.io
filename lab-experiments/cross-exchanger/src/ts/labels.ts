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

    // Create thermometer labels
    const thermLabel1 = document.createElementNS(svgNS, "text")!;
    thermLabel1.id = "therm-label-left";
    thermLabel1.classList.add("digital-label");
    thermLabel1.classList.add("bitcount-prop-single-display");
    thermLabel1.innerHTML = `25.0 °C`;
    thermLabel1.setAttribute("text-anchor", "middle");
    thermLabel1.setAttribute("x", "844");
    thermLabel1.setAttribute("y", "140");
    thermLabel1.setAttribute("position", "absolute");
    thermLabel1.setAttribute("fontSize", "28");
    thermLabel1.setAttribute("fill", "#2A2A24");
    document.getElementById("thermoBody")!.appendChild(thermLabel1);

    const thermLabel2 = document.createElementNS(svgNS, "text")!;
    thermLabel2.id = "therm-label";
    thermLabel2.classList.add("digital-label");
    thermLabel2.classList.add("bitcount-prop-single-display");
    thermLabel2.innerHTML = `25.0 °C`;
    thermLabel2.setAttribute("text-anchor", "middle");
    thermLabel2.setAttribute("x", "844");
    thermLabel2.setAttribute("y", "170");
    thermLabel2.setAttribute("position", "absolute");
    thermLabel2.setAttribute("fontSize", "28");
    thermLabel2.setAttribute("fill", "#2A2A24");
    document.getElementById("thermoBody")!.appendChild(thermLabel2);

    // Info labels
    const thermInfo1 = document.createElementNS(svgNS, "text")!;
    thermInfo1.id = "therm-info-label2";
    thermInfo1.classList.add("digital-label");
    thermInfo1.classList.add("bitcount-prop-single-display");
    thermInfo1.innerHTML = `Therm. 1:`;
    thermInfo1.setAttribute("text-anchor", "middle");
    thermInfo1.setAttribute("x", "830");
    thermInfo1.setAttribute("y", "122");
    thermInfo1.setAttribute("position", "absolute");
    thermInfo1.setAttribute("fontSize", "28");
    thermInfo1.setAttribute("fill", "#2A2A24");
    document.getElementById("thermoBody")!.appendChild(thermInfo1);

    const thermInfo2 = document.createElementNS(svgNS, "text")!;
    thermInfo2.id = "therm-info-label2";
    thermInfo2.classList.add("digital-label");
    thermInfo2.classList.add("bitcount-prop-single-display");
    thermInfo2.innerHTML = `Therm. 2:`;
    thermInfo2.setAttribute("text-anchor", "middle");
    thermInfo2.setAttribute("x", "830");
    thermInfo2.setAttribute("y", "155");
    thermInfo2.setAttribute("position", "absolute");
    thermInfo2.setAttribute("fontSize", "28");
    thermInfo2.setAttribute("fill", "#2A2A24");
    document.getElementById("thermoBody")!.appendChild(thermInfo2);
}

export function updateFlowLabel(flowrate: number) {
    const label = document.getElementById("flow-label")!;
    label.innerHTML = `${flowrate.toFixed(1)} mL/s`;
}

export function updateThermLabel(temperature: number) {
    const label = document.getElementById("therm-label")!;
    label.innerHTML = `${temperature.toFixed(1)} °C`;
}

export function updateThermLabelLeft(temperature: number) {
    const label = document.getElementById("therm-label-left")!;
    label.innerHTML = `${temperature.toFixed(1)} °C`;
}