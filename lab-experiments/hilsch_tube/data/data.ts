type DataCoord = [psi: number, z: number];
type DataPoint = [coord: DataCoord, temp: number];

// [[psi, z], Tc]
// Sorted in ascending z
// then ascending psi with stride of 7.
// So for bilinear interpolation, interpolate with points i, i+1, i+7, and i+8
// And for heavens sake, use some sort of annotation if you do stuff like this
// All you really need is a 2D array
const TDropData: DataPoint[] = [
  [
    [20, 20], 63.1
  ],
  [
    [20, 30], 61.3
  ],
  [
    [20, 40],
    56.1
  ],
  [
    [20, 50], 51.3
  ],
  [
    [20, 60], 44.5
  ],
  [
    [20, 70],
    37
  ],
  [
    [20, 80], 28.8
  ],
  [
    [40, 20], 89.2
  ],
  [
    [40, 30],
    85.8
  ],
  [
    [40, 40], 81.1
  ],
  [
    [40, 50], 73.2
  ],
  [
    [40, 60],
    63.1
  ],
  [
    [40, 70], 52.5
  ],
  [
    [40, 80], 39.1
  ],
  [
    [60, 20],
    104.3
  ],
  [
    [60, 30], 101.7
  ],
  [
    [60, 40], 93.7
  ],
  [
    [60, 50],
    84.1
  ],
  [
    [60, 60], 73.5
  ],
  [
    [60, 70], 60.9
  ],
  [
    [60, 80],
    45.4
  ],
  [
    [80, 20], 117.1
  ],
  [
    [80, 30], 111.2
  ],
  [
    [80, 40],
    102.3
  ],
  [
    [80, 50], 92.2
  ],
  [
    [80, 60], 81.3
  ],
  [
    [80, 70],
    66.2
  ],
  [
    [80, 80], 50.1
  ],
  [
    [100, 20], 128.3
  ],
  [
    [100, 30],
    119.5
  ],
  [
    [100, 40], 111.1
  ],
  [
    [100, 50], 100.3
  ],
  [
    [100, 60],
    86.5
  ],
  [
    [100, 70], 71.9
  ],
  [
    [100, 80], 53.5
  ]
];

const TRiseData: DataPoint[] = [
  [
    [20, 20], 15.1
  ],
  [
    [20, 30], 24.4
  ],
  [
    [20, 40],
    37.8
  ],
  [
    [20, 50], 51.3
  ],
  [
    [20, 60], 65.1
  ],
  [
    [20, 70],
    82.5
  ],
  [
    [20, 80], 108.1
  ],
  [
    [40, 20], 23.4
  ],
  [
    [40, 30],
    35.2
  ],
  [
    [40, 40], 52.1
  ],
  [
    [40, 50], 73.2
  ],
  [
    [40, 60],
    92.8
  ],
  [
    [40, 70], 116.9
  ],
  [
    [40, 80], 148.1
  ],
  [
    [60, 20],
    25.6
  ],
  [
    [60, 30], 39.9
  ],
  [
    [60, 40], 59.1
  ],
  [
    [60, 50],
    84.1
  ],
  [
    [60, 60], 104.1
  ],
  [
    [60, 70], 133.1
  ],
  [
    [60, 80],
    169.1
  ],
  [
    [80, 20], 26.1
  ],
  [
    [80, 30], 44.1
  ],
  [
    [80, 40],
    64.1
  ],
  [
    [80, 50], 92.2
  ],
  [
    [80, 60], 114.1
  ],
  [
    [80, 70],
    144.3
  ],
  [
    [80, 80], 181.1
  ],
  [
    [100, 20], 27.8
  ],
  [
    [100, 30],
    46.1
  ],
  [
    [100, 40], 67.3
  ],
  [
    [100, 50], 100.3
  ],
  [
    [100, 60],
    119.9
  ],
  [
    [100, 70], 151.1
  ],
  [
    [100, 80], 192.1
  ]
];

function psiToBar(psi) {
  return psi / 14.5038;
}

// [20, 20] to [100, 80]
// steps of [20, 10]
// Helpers for this conversion:
const prow = (psi: number) => Math.floor((psi - 20) / 20)
const zcol = (z: number) => Math.floor((z - 20) / 10)
const convertCoords = (coords: DataCoord) => {
  const r = prow(coords[0]);
  const c = zcol(coords[1]);
  return [r, c];
}
const pressureAtRow = (row: number) => psiToBar(row * 20 + 20); // pressure (bar)
const zAtCol = (col: number) => col * 10 + 20;

const rows = prow(100) + 1;
const cols = zcol(80) + 1;

function to2Darr(data: DataPoint[]): number[][] {
  const arr = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  data.forEach(collection => {
      const coords = collection[0];
      const value = collection[1];
      const [r, c] = convertCoords(coords);
      arr[r][c] = value;
  });

  return arr;
}

/**
 * Calculate the inlet flow rate [mL/s]
 * @param P Feed pressure [bar]
 * @returns Feed volumetric flowrate [mL/s]
 */
function calcInletFlowRate(P: number) {
  const frac = (P - 1) / 7;
  return 50 * frac ** 0.4;
}

const Tfall = to2Darr(TDropData);
const Trise = to2Darr(TRiseData);

// Calculate with real conditions
const Tf = 22;
const R = .08314
const Cp = 29.19; // L bar / mol / K

const residuals = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

for (let i=0;i<rows;i++) {
  const Pf = pressureAtRow(i);
  const Qf = calcInletFlowRate(Pf);
  for (let j=0;j<cols;j++) {
    const z = zAtCol(j) / 100;
    // Convert to temperatures
    const Tc = Tf - Tfall[i][j] * 5 / 9;
    const Th = Tf + Trise[i][j] * 5 / 9;

    // Calculate molar flowrates
    const nf = Pf * Qf / 1000 / R / (Tf + 273);
    const nc = z * nf;
    const nh = (1 - z) * nf;

    // // Energy balance
    // const hot = nh * Cp * (Th - Tf);
    // const cold = nc * Cp * (Tc - Tf);
    residuals[i][j] = Trise[i][j] - Tfall[i][j] * z / (1 - z);
  }
}

console.log("Energy balance results:", residuals)