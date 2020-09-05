(function insert() {
  const svg = document.getElementById("graphic");
  const container = document.getElementById("graphic-container");
  [
    ["above_inlet1", "textBox-1", `<div><span id="fuelLabel">C<sub>2</sub>H<sub>4</sub></span></div>`],
    ["below_inlet1", "textBox-2", `<div><span id="fuelFlowRate">100</span> mol/hr at <span id="fuelTemp">25</span>°C</div>`],
    ["above_inlet2", "textBox-3", `<div><span id="oxidizerLabel">air</span></div>`],
    ["below_inlet2", "textBox-4", `<div><span id="oxidizerFlowRate">376</span> mol/hr at <span id="oxidizerTemp">25</span>°C</div>`],
    ["above_outlet", "textBox-5", `<div style="justify-self:center;font-size:1.25em;">T<sub>flame</sub> = <span id="flameTemp"></span>°C</div>`],
    ["below_outlet", "textBox-6", `
      <div class="left">O<sub>2</sub></div>
      <div class="right"><span id="oxygenOutletFlowRate">0</span> mol/hr</div>
      <div class="left">N<sub>2</sub></div>
      <div class="right"><span id="nitrogenOutletFlowRate">276.2</span> mol/hr</div>
      <div class="left">H<sub>2</sub>O</div>
      <div class="right"><span id="waterOutletFlowRate">200</span> mol/hr</div>
      <div class="left">CO<sub>2</sub></div>
      <div class="right"><span id="carbonDioxideOutletFlowRate">100</span> mol/hr</div>
      `],
  ].forEach((id, i) => {
    const ref = document.getElementById(id[0]);
    const div = document.createElement("div");
    div.id = id[1];
    div.innerHTML = id[2];
    div.classList.add("textBox");
    if(i % 2 === 0) {
      div.classList.add("above")
    } else {
      div.classList.add("below");
    }
    const rect = ref.getBoundingClientRect();
    div.style.left = `${rect.left}px`;
    div.style.top = `${rect.top}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;
    container.appendChild(div);
  });


})()