const tooltip_container = document.getElementById("tooltip-container");
const tooltip_show_delay = 500;
const blue_color = "rgb(0, 0, 255)";
const red_color = "rgb(255, 0, 0)";
const green_color = "rgb(20, 165, 20)";
const black_color = "rgb(0, 0, 0)";

/****** VAPOR STREAM FROM FIRST EVAPORATOR *******/

gvs.tooltips.V1_is_over = false;
const V1_tooltips = [
  document.getElementById("V1-tooltip-1"),
  document.getElementById("V1-tooltip-2"),
  document.getElementById("V1-tooltip-3"),
  document.getElementById("V1-tooltip-4"),
];

V1_tooltips.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.V1_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.V1_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `V<sub>1</sub> = ${gvs.V1.toFixed(1)} kg/s (saturated steam)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = blue_color;
      }
    }, tooltip_show_delay);
  });
});

/****** LIQUID STREAM FROM FIRST EVAPORATOR, BEFORE VALVE *******/

gvs.tooltips.L1_is_over_pre_valve = false;
const L1_tooltips_pre_valve = [
  document.getElementById("L1-tooltip-1"),
  document.getElementById("L1-tooltip-2"),
];

L1_tooltips_pre_valve.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.L1_is_over_pre_valve = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.L1_is_over_pre_valve) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `L<sub>1</sub> = ${gvs.L1.toFixed(1)} kg/s (saturated liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = green_color;
      }
    }, tooltip_show_delay);
  });
})

/****** LIQUID STREAM FROM FIRST EVAPORATOR, AFTER VALVE *******/

gvs.tooltips.L1_is_over_post_valve = false;
const L1_tooltips_post_valve = [
  document.getElementById("L1-tooltip-3"),
  document.getElementById("L1-tooltip-4"),
  document.getElementById("L1-tooltip-5"),
];

L1_tooltips_post_valve.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.L1_is_over_post_valve = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.L1_is_over_post_valve) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `L<sub>1</sub> = ${gvs.L1.toFixed(1)} kg/s (${(gvs.q1 * 100).toFixed(0)}% liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = green_color;
      }
    }, tooltip_show_delay);
  });
});

/****** VAPOR STREAM FROM SECOND EVAPORATOR *******/

gvs.tooltips.V2_is_over = false;
const V2_tooltips = [
  document.getElementById("V2-tooltip-1"),
  document.getElementById("V2-tooltip-2"),
  document.getElementById("V2-tooltip-3"),
  document.getElementById("V2-tooltip-4"),
];

V2_tooltips.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.V2_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.V2_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `V<sub>1</sub> = ${gvs.V2.toFixed(1)} kg/s (saturated steam)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = red_color;
      }
    }, tooltip_show_delay);
  });
});

/****** LIQUID STREAM FROM SECOND EVAPORATOR, BEFORE VALVE *******/

gvs.tooltips.L2_is_over_pre_valve = false;
const L2_tooltips_pre_valve = [
  document.getElementById("L2-tooltip-1"),
  document.getElementById("L2-tooltip-2"),
];

L2_tooltips_pre_valve.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.L2_is_over_pre_valve = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.L2_is_over_pre_valve) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `L<sub>1</sub> = ${gvs.L2.toFixed(1)} kg/s (saturated liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = green_color;
      }
    }, tooltip_show_delay);
  });
})

/****** LIQUID STREAM FROM SECOND EVAPORATOR, AFTER VALVE *******/

gvs.tooltips.L2_is_over_post_valve = false;
const L2_tooltips_post_valve = [
  document.getElementById("L2-tooltip-3"),
  document.getElementById("L2-tooltip-4"),
  document.getElementById("L2-tooltip-5"),
];

L2_tooltips_post_valve.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.L2_is_over_post_valve = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.L2_is_over_post_valve) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `L<sub>1</sub> = ${gvs.L2.toFixed(1)} kg/s (${(gvs.q1 * 100).toFixed(0)}% liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = green_color;
      }
    }, tooltip_show_delay);
  });
});

/****** LIQUID STREAM FROM FIRST HEAT EXCHANGER ******/

gvs.tooltips.cond1_is_over = false;
const cond1_tooltips = [
  document.getElementById("cond1-tooltip-1"),
  document.getElementById("cond1-tooltip-2"),
];

cond1_tooltips.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.cond1_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.cond1_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `cond<sub>1</sub> = ${gvs.s_inlet.toFixed(1)} kg/s (saturated liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = red_color;
      }
    }, tooltip_show_delay);
  });
});

/****** LIQUID STREAM FROM SECOND HEAT EXCHANGER ******/

gvs.tooltips.cond2_is_over = false;
const cond2_tooltips = [
  document.getElementById("cond2-tooltip-1"),
  document.getElementById("cond2-tooltip-2"),
];

cond2_tooltips.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.cond2_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.cond2_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `cond<sub>2</sub> = ${gvs.V1.toFixed(1)} kg/s (${(gvs.q_cond_2 * 100).toFixed(0)}% liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = blue_color;
      }
    }, tooltip_show_delay);
  });
});

/****** LIQUID STREAM FROM THIRD HEAT EXCHANGER ******/

gvs.tooltips.cond3_is_over = false;
const cond3_tooltips = [
  document.getElementById("cond3-tooltip-1"),
  document.getElementById("cond3-tooltip-2"),
];

cond3_tooltips.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.cond3_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.cond3_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `cond<sub>3</sub> = ${gvs.V2.toFixed(1)} kg/s (${(gvs.q_cond_3 * 100).toFixed(0)}% liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = red_color;
      }
    }, tooltip_show_delay);
  });
});

/****** FIRST VALVE ******/

gvs.tooltips.valve1_is_over = false;
const valve1_tooltip = [
  document.getElementById("valve1-tooltip")
];

valve1_tooltip.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.valve1_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.valve1_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `This valve has a pressure drop of ${Math.abs(gvs.P2 - gvs.P1).toFixed(2)} MPa.`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = black_color;
      }
    }, tooltip_show_delay);
  });
});

/****** SECOND VALVE ******/

gvs.tooltips.valve2_is_over = false;
const valve2_tooltip = [
  document.getElementById("valve2-tooltip")
];

valve2_tooltip.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.valve2_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.valve2_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `This valve has a pressure drop of ${Math.abs(gvs.P3 - gvs.P2).toFixed(3)} MPa.`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = black_color;
      }
    }, tooltip_show_delay);
  });
});

/****** VAPOR FROM THIRD EVAPORATOR ******/

gvs.tooltips.V3_is_over = false;
const V3_tooltip = [
  document.getElementById("V3-tooltip")
];

V3_tooltip.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.V3_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.V3_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `V<sub>3</sub> = ${(gvs.V3).toFixed(1)} kg/s (saturated steam)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = blue_color;
      }
    }, tooltip_show_delay);
  });
});

/****** LIQUID FROM THIRD EVAPORATOR ******/

gvs.tooltips.L3_is_over = false;
const L3_tooltip = [
  document.getElementById("L3-tooltip")
];

L3_tooltip.forEach(elt => {
  elt.addEventListener("mouseover", (e) => {
    setTimeout(() => { gvs.tooltips.L3_is_over = true }, 50);
    clearTimeout(gvs.tooltip_timeout);
    gvs.tooltip_timeout = setTimeout(() => {
      if(gvs.tooltips.L3_is_over) {
        tooltip_container.style.display = "block";
        tooltip_container.innerHTML = `L<sub>3</sub> = ${(gvs.L3).toFixed(1)} kg/s (saturated liquid)`;
        const width = tooltip_container.getBoundingClientRect().width;
        const height = tooltip_container.getBoundingClientRect().height;
        tooltip_container.style.left = `${gvs.clientX - width / 2}px`;
        tooltip_container.style.top = `${gvs.clientY - height - 10}px`;
        tooltip_container.style.color = green_color;
      }
    }, tooltip_show_delay);
  });
});

const all_hover_elts = [
  ...V1_tooltips,
  ...L1_tooltips_pre_valve,
  ...L1_tooltips_post_valve,
  ...V2_tooltips,
  ...L2_tooltips_pre_valve,
  ...L2_tooltips_post_valve,
  ...V3_tooltip,
  ...L3_tooltip,
  ...cond1_tooltips,
  ...cond2_tooltips,
  ...cond3_tooltips,
  ...valve1_tooltip,
  ...valve2_tooltip,
];

document.addEventListener('mousemove', function (e) {
  let is_over = false;
  gvs.clientX = e.clientX;
  gvs.clientY = e.clientY;
  all_hover_elts.forEach(elt => {
    const rect = elt.getBoundingClientRect();
    if(gvs.clientX > rect.left && gvs.clientX < (rect.left + rect.width) && gvs.clientY > rect.top && gvs.clientY < (rect.top + rect.height)) {
      is_over = true;
    }
  });
  if(!is_over) {
    tooltip_container.style.display = "none";
  }
}, false);