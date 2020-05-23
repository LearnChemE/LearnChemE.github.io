import '../style/style.scss';

const main = document.createElement("div");

const text = `
  <div id="jxgbox" class="jxgbox" style="width:600px; height:600px;"></div>
`;

main.innerHTML = text;

document.body.appendChild(main);

let coords = [
  [0, 0],
  [1, 1],
  [0, 2]
];

window.board = JXG.JSXGraph.initBoard('jxgbox', {
  axis: false,
  boundingbox: [-5, 5, 5, -0.5]
});

// Horizontal axis
var ax1 = board.create('axis', [[0,0], [1,0]], {
  ticks: {
      label: {
          offset:[0, -3], 
          anchorX: 'middle', 
          anchorY: 'top'
      },
      drawZero: true
  }
});

// Vertical axis with horizontal ticks
var ax2 = board.create('axis', [[-4,0], [-4,1]], {
  ticks: {
      tickEndings: [1, 0],   // Let the ticks point to the left
      label: {               // Position of the labels
          visible: true, 
          offset: [-6, 0], 
          anchorY: 'middle', 
          anchorX: 'right'
      },
      drawZero: true
  }
});