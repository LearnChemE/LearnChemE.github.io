export function clickUpdateButtons() {
  [
    'update-TC',
    'update-LC',
    'update-PC',
    'update-inlet'
  ].forEach(buttonID =>{
    const button = document.getElementById(buttonID);
    button.click();
  });
}

export function defineGlobals() {

  window.graphics = {
    y1Color: 'rgb(255, 0, 0)',
    y2Color: 'rgb(34, 139, 34)',
    y3Color: 'rgb(0, 80, 255)'
  }
  
}

export function elementsToBeResized() {
  const TGraphArea = document.getElementById("TemperatureGraphArea");
  const PGraphArea = document.getElementById("PressureGraphArea");
  const LGraphArea = document.getElementById("LevelGraphArea");
  const TInputArea = document.getElementById("TCInputArea");
  const PInputArea = document.getElementById("PCInputArea");
  const LInputArea = document.getElementById("LCInputArea");
  const InletInputArea = document.getElementById("InletInputArea");
  const SpeedInputArea = document.getElementById("SpeedInputArea");
  const CSVArea = document.getElementById("csvDownloadArea");
  const DirectionsArea = document.getElementById("directionsArea");
  
  const TGraph = document.getElementById("TPlot");
  const PGraph = document.getElementById("PPlot");
  const LGraph = document.getElementById("LPlot");
  const TInput = document.getElementById("TC-control");
  const PInput = document.getElementById("PC-control");
  const LInput = document.getElementById("LC-control");
  const InletInput = document.getElementById("inlet-control");
  const SpeedInput = document.getElementById("slider-wrapper");
  const CSVdownload = document.getElementById("csv-wrapper");
  const DirectionsButton = document.getElementById("directions-button-wrapper");

  return [
    [TGraph, TGraphArea],
    [PGraph, PGraphArea],
    [LGraph, LGraphArea],
    [TInput, TInputArea],
    [PInput, PInputArea],
    [LInput, LInputArea],
    [InletInput, InletInputArea],
    [SpeedInput, SpeedInputArea],
    [CSVdownload, CSVArea],
    [DirectionsButton, DirectionsArea]
  ]
};

export function flotInit(include_stpts) {
  require("flot");
  require("./flot.dashes.js");

  ['TPlot', 'LPlot', 'PPlot'].forEach((id) => {
    const div = document.createElement("div");
    div.id = `${id}`;
    document.body.appendChild(div);
    document.getElementById("main-application-wrapper").appendChild(document.getElementById(id));

    const colors = include_stpts ? [graphics.y1Color, graphics.y2Color, graphics.y3Color] : [graphics.y2Color, graphics.y3Color];

    graphics[`${id}`] = jQuery.plot($(`#${id}`), [ [[0, 0], [1, 1]] ], {
      series : { 
        shadowSize: 0
      },
      xaxes: [
        { position: 'bottom', axisLabel : 'time (s)', min: -10, max: 0 },
        { position: 'top', show: true, showTicks: false, showTickLabels: false, gridLines: false}
      ],
      yaxes: [
        { position: 'left', axisLabel : '', color: graphics.y2Color},
        { position: 'right', axisLabel: '', color: graphics.y3Color, show: true, showTicks: true, gridLines: false },
      ],
      colors: colors
    });
  });

  // Initialize Each Plot
  const TPlot = graphics.TPlot;
  const PPlot = graphics.PPlot;
  const LPlot = graphics.LPlot;

  const TOpts = TPlot.getOptions();
  const POpts = PPlot.getOptions();
  const LOpts = LPlot.getOptions();
  
  if(include_stpts) {
    TOpts.series.dashes.show = true;
    POpts.series.dashes.show = true;
    LOpts.series.dashes.show = true;
    TOpts.series.dashes.displayDashesOn = [0];
    POpts.series.dashes.displayDashesOn = [0];
    LOpts.series.dashes.displayDashesOn = [0];
  } else {
    TOpts.series.dashes.show = false;
    POpts.series.dashes.show = false;
    LOpts.series.dashes.show = false;
  }

  TOpts.yaxes[0].axisLabel = 'temperature (K)';
  TOpts.yaxes[1].axisLabel = 'heat duty (kW)';
  TOpts.xaxes[1].axisLabel = 'temperature and heat duty';
  TPlot.getAxes().yaxis.options.min = 400;
  TPlot.getAxes().yaxis.options.max = 500;
  TPlot.getAxes().y2axis.options.min = 450;
  TPlot.getAxes().y2axis.options.max = 550;

  POpts.yaxes[0].axisLabel = 'pressure (kPa)';
  POpts.yaxes[1].axisLabel = 'valve lift';
  POpts.xaxes[1].axisLabel = 'valve lift and pressure';
  PPlot.getAxes().yaxis.options.min = 50;
  PPlot.getAxes().yaxis.options.max = 100;
  PPlot.getAxes().y2axis.options.min = 0.3;
  PPlot.getAxes().y2axis.options.max = 0.7;

  LOpts.yaxes[0].axisLabel = 'level (%)';
  LOpts.yaxes[1].axisLabel = 'bottoms flow (L / s)';
  LOpts.xaxes[1].axisLabel = 'level and bottoms flow rate';
  LPlot.getAxes().yaxis.options.min = 15;
  LPlot.getAxes().yaxis.options.max = 20;
  LPlot.getAxes().y2axis.options.min = 0.5;
  LPlot.getAxes().y2axis.options.max = 0.72;


  [TPlot, PPlot, LPlot].forEach(plot => {
    plot.getAxes().yaxis.options.autoScale = "none";
    plot.getAxes().y2axis.options.autoScale = "none";
    plot.getAxes().xaxis.options.autoScale = "none";
  })
}

export function importDirections(text, directionsTitle) {
  const innerHTML = text;
  
  const modalBG = document.createElement("div");
  modalBG.id = "modal-bg";
  modalBG.style.display = "none";
  document.body.appendChild(modalBG);

  const modal = document.createElement("div");
  modal.id = "modal";
  modalBG.appendChild(modal);

  const modalTitle = document.createElement("div");
  modalTitle.id = "modal-title";
  modalTitle.innerHTML = directionsTitle;
  modal.appendChild(modalTitle);

  const exit = document.createElement("span");
  exit.id = "exit-modal";
  exit.innerHTML = "&times;";
  exit.addEventListener("click", () => {window.closeDirections()});
  modalTitle.appendChild(exit);

  const content = document.createElement("div");
  content.id = "modal-content";
  content.innerHTML = innerHTML;
  modal.appendChild(content);

  const clickOutsideModal = e => {
    const modalCoords = modal.getBoundingClientRect();
    const left = modalCoords.left;
    const top = modalCoords.top;
    const width = modalCoords.width;
    const height = modalCoords.height;
    const x = e.pageX;
    const y = e.pageY;
    if((x < left || x > left + width || y < top || y > top + height) && window.modalIsOpen) {
      window.closeDirections();
    }
  }

  document.body.addEventListener("click", e => clickOutsideModal(e));

  (function embedYouTubePlayers() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  
    window.onYouTubeIframeAPIReady = function() {
      window.directionsVideo = new YT.Player( 'directions-player', {
        height: '390',
        width: '640',
        videoId: 'NpEaa2P7qZI',
      });
    }
  
    window.onPlayerReady = function(event) {
      console.log(event.target);
    }
  })();
}

export function initialFrameRate(sk) {
  window.pauseSimulation = false;
  window.adjustSpeed = (sp) => {
    if(sp === 0) {
      window.pauseSimulation = true;
      sk.frameRate(1);
    } else {
      window.pauseSimulation = false;
      sk.frameRate(sp);
    }
  }
  sk.frameRate(60);
  sk.noCanvas();
}

export function initialResize(sk) {
  sk.windowResized();
  setTimeout(() => {sk.windowResized()}, 1000);
  setInterval(() => {sk.windowResized()}, 5000);
}

export function resizeElements(elms) {
  for(let i = 0; i < elms.length; i++) {
    const pair = elms[i];
    const rect = pair[1].getBoundingClientRect();
    const x = rect.x;
    const y = rect.y;
    const width = rect.width;
    const height = rect.height;

    pair[0].style.left = `${x}px`;
    pair[0].style.top = `${y}px`;
    pair[0].style.width = `${width}px`;
    pair[0].style.height = `${height}px`;
  }
}

export function resizePlots() {
  [graphics.TPlot, graphics.PPlot, graphics.LPlot].forEach(plot => {
    plot.resize();
    plot.setupGrid();
  });
  const titles = document.getElementsByClassName("x2Label axisLabels");
  if ( titles.length > 0 ) {
    for ( let i = 0; i < titles.length; i++ ) {
      switch(i) {
        case 0 : 
          titles[i].innerHTML = `<tspan class="pv-color">temperature</tspan> and <tspan class="mv-color">heat duty</tspan>`;
          break;

        case 1 : 
          titles[i].innerHTML = `<tspan class="pv-color">level</tspan> and <tspan class="mv-color">bottoms flow rate</tspan>`;
          break;

        case 2 : 
          titles[i].innerHTML = `<tspan class="pv-color">pressure</tspan> and <tspan class="mv-color">valve lift</tspan>`;
          break;
      }
    }
  }
}

export function rippleAnimation() {
  
  function ripple(t) {
    const ls = document.getElementById("liquidSquiggle");
    const width = 77.514;
    let lines = "";
    const resolution = 30;
    const dx = width / resolution;
    let x = 0;
    for(let i = 0; i < resolution; i++) {
      x += dx;
      const dy = 0.5 * Math.sin(x * 6 * Math.PI / width + t / 11) + 0.45 * Math.sin(x * 5 * Math.PI / width + t / 14) + 0.35 * Math.sin(x * 2.5 * Math.PI / width + t / 8);
      lines += `-${dx},${dy} `;
    }
    const path = `
    m 320.032,100.18395
    h 38.7568 38.7572
    v -9.532082
    l ${lines}
    z
    `;
    ls.setAttribute("d", path);
  }

  window["rippleTimer"] = 0;
  setInterval(() => { window["rippleTimer"] += 1; ripple(window["rippleTimer"])}, 50);
}

export function separatorInit(include_auto) {
  separator.createCoords(include_auto);
  separator.maxLiquidHeight = Number(document.getElementById("liquidRect").getAttribute("height"));
}
