const AH = [-156.51, -159.854, -171.764, -250.812, -153.027, -105.9768, -125.939, -338.217, -181.587, -171.2542];
const BH = [8160.2, 8741.68, 8296.9, 12695.6, 7965.2, 4259.62, 5528.45, 13282.1, 8632.12, 8319.24];
const CH = [21.403, 21.6694, 23.3376, 34.7413, 20.5248, 14.0094, 16.8893, 51.9144, 24.7981, 23.24323];
const DH = [0, -0.00110261, 0, 0, 0, 0, 0, -0.0425831, 0, 0];


function calculateOutput(T, P) {
  T = T + 273;
  const H = AH.map((ah, i) => 1 / Math.exp(ah + (BH[i] / T) + CH[i] * Math.log(T) + DH[i] * (T)));
  const x = H.map(h => (P / h).toFixed(6));
  return x;
}

function calculateContinousOutput(T, P) {
  let result = [];
  let element_1 = [];
  let element_2 = [];
  let element_3 = [];
  let element_4 = [];
  let element_5 = [];
  let element_6 = [];
  let element_7 = [];
  let element_8 = [];
  let element_9 = [];
  let element_10 = [];

  for (let i = 0; i < 251; i = i + 0.5) {
    result.push(calculateOutput(i, P))
  }
  for (let i = 0; i < result.length; i++) {
    element_1.push(result[i][0]);
    element_2.push(result[i][1]);
    element_3.push(result[i][2]);
    element_4.push(result[i][3]);
    element_5.push(result[i][4]);
    element_6.push(result[i][5]);
    element_7.push(result[i][6]);
    element_8.push(result[i][7]);
    element_9.push(result[i][8]);
    element_10.push(result[i][9]);
  }

  result =
    [element_1,
      element_2,
      element_3,
      element_4,
      element_5,
      element_6,
      element_7,
      element_8,
      element_9,
      element_10
    ]

  return result;

}

export { calculateOutput, calculateContinousOutput };