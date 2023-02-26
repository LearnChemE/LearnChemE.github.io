const gamma_A = [0.098, 0.099, 0.218, 0.149, 0.173, 0.191, 0.205, 0.213, 0.146, 0.170, 0.134, 0.124, 0.144, 0.095, 0.093, 0.068, 0.050, 0.051, 0.008, -0.023];
const gamma_B = [-0.005, 0.025, -0.074, 0.049, 0.017, -0.013, -0.142, -0.180, 0.129, -0.054, 0.108, 0.112, -0.305, 0.199, -0.067, -0.123, -0.008, -0.469, 0.529, 1.666];
const xA = [0.055, 0.131, 0.205, 0.248, 0.279, 0.352, 0.424, 0.424, 0.434, 0.494, 0.524, 0.564, 0.623, 0.633, 0.701, 0.768, 0.806, 0.834, 0.899, 0.964];
const xB = [0.945, 0.869, 0.795, 0.752, 0.721, 0.648, 0.576, 0.576, 0.566, 0.506, 0.476, 0.436, 0.377, 0.367, 0.299, 0.232, 0.194, 0.166, 0.101, 0.036];

let A12_list = [];
let A21_list = [];

for(let i = 0; i < xA.length; i++) {
  const g_A = gamma_A[i];
  const g_B = gamma_B[i];
  const xA_i = xA[i];
  const xB_i = xB[i];
  let diff = 1e6;
  let candidate_A12 = null;
  let candidate_A21 = null;
  for(let A12 = 0; A12 <= 2.00; A12 += 0.01) {
    A12 = Math.round(A12 * 100) / 100;
    for(let A21 = 0; A21 <= 2.00; A21 += 0.01) {
      A21 = Math.round(A21 * 100) / 100;
      const RHS_A = xB_i * (A12 + 2 * (A21 - A12) * xA_i);
      const d = Math.abs(RHS_A - g_A);
      if(d < diff) {
        diff = d;
        candidate_A12 = A12;
        candidate_A21 = A21;
      }
    }
  }
  A12_list.push(candidate_A12);
  A21_list.push(candidate_A21);
  diff = 1e6;
  candidate_A12 = null;
  candidate_A21 = null;
  for(let A12 = 0; A12 <= 2.00; A12 += 0.01) {
    A12 = Math.round(A12 * 100) / 100;
    for(let A21 = 0; A21 <= 2.00; A21 += 0.01) {
      A21 = Math.round(A21 * 100) / 100;
      const RHS_B = xA_i * (A21 + 2 * (A12 - A21) * xB_i);
      const d = Math.abs(RHS_B - g_B);
      if(d < diff) {
        diff = d;
        candidate_A12 = A12;
        candidate_A21 = A21;
      }
    }
  }
  A12_list.push(candidate_A12);
  A21_list.push(candidate_A21);
}

let A12_sum = 0;
let A21_sum = 0;
const n = A12_list.length;
for(let i = 0; i < n; i++) {
  A12_sum += A12_list[i];
  A21_sum += A21_list[i];
}
const A12_mean = A12_sum / n;
const A21_mean = A21_sum / n;

console.log({A12_mean, A21_mean});

// It turns out that this does not yield the correct values for A12 and A21. Keeping this file in case it becomes useful at a future time.