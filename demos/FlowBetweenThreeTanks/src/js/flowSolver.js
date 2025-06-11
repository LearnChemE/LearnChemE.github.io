// ─────────────────────────────────────────────────────────────────────────────
// solveThree Tanks: JavaScript translation of the Python “flow_out_B” & 
// “flow_in_B” routines.  It exports one function, solveThreeTanks(l2, hB), 
// which automatically picks the correct formulation.                         
// ─────────────────────────────────────────────────────────────────────────────

// ─── 1) flow_out_B (A & B each push into a common return) ─────────────────
//   Equations for “flow_out_B” (U₁ + U₂ = U₃):
//    F₁ ≡ hA – [f·l₁/D·U₁²/(2g) + f·l₃/D·U₃²/(2g)] = 0
//    F₂ ≡ hB – [f·l₂/D·U₂²/(2g) + f·l₃/D·U₃²/(2g)] = 0
//    F₃ ≡ U₁ + U₂ – U₃ = 0
//
//  We eliminate U₃ = U₁ + U₂, and solve two nonlinear equations in (U₁, U₂) by 
//  Newton–Raphson.  Once (U₁, U₂) are found, U₃ = U₁ + U₂.                   
//
//  Inputs: (l2, hB);  the other values are hard‐coded: l1=1000, l3=400, hA=100. 
//  Returns: {U1, U2, U3, dir1, dir2, dir3} where “dir#” is a string like 
//    "A → J" or "J → A" indicating flow direction in each pipe.               
//
function solveFlowOutB(l2, hB) {
  // ─── Fixed parameters ──────────────────────────────────────────────────────
  const l1 = 1000.0;  // ft (Pipe 1: A → J)
  const l3 = 400.0;   // ft (Pipe 3: J → Common)
  const hA = 100.0;   // ft (Tank A head)
  const D  = 1.0;     // ft (pipe diameter)
  const g  = 32.17;   // ft/s² (gravity)
  const f  = 0.02;    // Darcy–Weisbach friction factor

  // Precompute K₁, K₂, K₃ (head‐loss coefficients):
  //   head_loss_i = K_i * U_i²  where  K_i = f·l_i / (2·g·D)
  const K1 = (f * l1) / (2 * g * D);
  const K2 = (f * l2) / (2 * g * D);
  const K3 = (f * l3) / (2 * g * D);

  // ─── 2) Newton–Raphson to solve for (U1, U2) ──────────────────────────────────
  //   F1(U1,U2) = K1·U1² + K3·(U1+U2)² – hA = 0
  //   F2(U1,U2) = K2·U2² + K3·(U1+U2)² – hB = 0
  //
  //   J11 = ∂F1/∂U1 = 2·K1·U1 + 2·K3·(U1+U2)
  //   J12 = ∂F1/∂U2 = 2·K3·(U1+U2)
  //   J21 = ∂F2/∂U1 = 2·K3·(U1+U2)
  //   J22 = ∂F2/∂U2 = 2·K2·U2 + 2·K3·(U1+U2)
  //
  let U1 = 1.0;   // initial guess
  let U2 = 1.0;   // initial guess
  const maxIter = 50;
  const tol     = 1e-8;

  for (let iter = 0; iter < maxIter; iter++) {
    const U3 = U1 + U2;
    const F1 = K1 * U1 * U1 + K3 * U3 * U3 - hA;
    const F2 = K2 * U2 * U2 + K3 * U3 * U3 - hB;
    const normF = Math.hypot(F1, F2);
    if (normF < tol) break;

    // Jacobian entries:
    const J11 = 2 * K1 * U1 + 2 * K3 * U3;
    const J12 = 2 * K3 * U3;
    const J21 = 2 * K3 * U3;
    const J22 = 2 * K2 * U2 + 2 * K3 * U3;

    const detJ = J11 * J22 - J12 * J21;
    if (Math.abs(detJ) < 1e-16) {
      console.warn("Jacobian nearly singular in solveFlowOutB");
      break;
    }
    // Inverse of 2×2 Jacobian:
    const invJ11 =  J22 / detJ;
    const invJ12 = -J12 / detJ;
    const invJ21 = -J21 / detJ;
    const invJ22 =  J11 / detJ;

    const dU1 = -(invJ11 * F1 + invJ12 * F2);
    const dU2 = -(invJ21 * F1 + invJ22 * F2);

    U1 += dU1;
    U2 += dU2;
    if (!isFinite(U1) || !isFinite(U2)) {
      console.warn("Diverged in solveFlowOutB");
      break;
    }
  }

  const U3 = U1 + U2;
  // ─── 3) Determine flow directions based on the sign of each Uᵢ:
  //   Positive U1  ⇒ “A → J”   (if U1 < 0, then “J → A”)
  //   Positive U2  ⇒ “B → J”   (if U2 < 0, then “J → B”)
  //   Positive U3  ⇒ “J → Common” (if U3 < 0, then “Common → J”)

  const dir1 = U1 >= 0 ? 'up' : "up";
  const dir2 = U2 >= 0 ? 'up' : "down";
  const dir3 = U3 >= 0 ? 'down' : "up";


  return {
    U1: U1,
    U2: U2,
    U3: U3,
    dir1: dir1,
    dir2: dir2,
    dir3: dir3
  };
}


// ─── 2) flow_in_B (A pushes to B, then jointly to Common) ────────────────────
//   Now the junction is at B, and flows combine:  U₁ – U₂ = U₃
//   Equations become:
//
//     F₁ = hA – [ f·l₁/D·U₁²/(2g) + f·l₃/D·U₃²/(2g ) ]  = 0  
//     F₂ = (hA – hB) – [ f·l₂/D·U₂²/(2g) + f·l₁/D·U₁²/(2g ) ] = 0  
//     F₃ = U₁ – U₂ – U₃  = 0  
//
//   Again eliminate U₃ = U₁ – U₂.  Solve the two eqns in (U₁, U₂) via Newton–Raphson.
//

function solveFlowInB(l2, hB) {
  const l1 = 1000.0;
  const l3 = 400.0;
  const hA = 100.0;
  const D  = 1.0;
  const g  = 32.17;
  const f  = 0.02;

  const K1 = (f * l1) / (2 * g * D);
  const K2 = (f * l2) / (2 * g * D);
  const K3 = (f * l3) / (2 * g * D);

  let U1 = 1.0;
  let U2 = 1.0;
  const maxIter = 50;
  const tol     = 1e-8;

  for (let iter = 0; iter < maxIter; iter++) {
    const U3 = U1 - U2;  // continuity for flow_in_B

    const F1 = K1 * U1 * U1 + K3 * U3 * U3 - hA;
    // Note: F2 uses (hA – hB) on the LHS
    const F2 = K2 * U2 * U2 + K1 * U1 * U1 - (hA - hB);
    // (Equivalently: (hA – hB) – [K2 U2² + K1 U1²] = 0  →  K2 U2² + K1 U1² – (hA – hB) = 0)
    // But we’ll keep the same sign structure as above (so F2=0) for NR.
    //
    // Finally:  F3 = U1 – U2 – U3 = 0
    const F3 = U1 - U2 - U3;

    // Convergence check (only use F1 & F2 in the 2×2 Jacobian):
    const normF = Math.hypot(F1, F2);
    if (normF < tol) break;
    

    const J11 = 2 * K1 * U1 + 2 * K3 * (U1 - U2);
    const J12 = -2 * K3 * (U1 - U2);
    const J21 = 2 * K1 * U1;
    const J22 = 2 * K2 * U2;

    const detJ = J11 * J22 - J12 * J21;
    if (Math.abs(detJ) < 1e-16) {
      console.warn("Jacobian nearly singular in solveFlowInB");
      break;
    }

    const invJ11 =  J22 / detJ;
    const invJ12 = -J12 / detJ;
    const invJ21 = -J21 / detJ;
    const invJ22 =  J11 / detJ;

    const dU1 = -(invJ11 * F1 + invJ12 * F2);
    const dU2 = -(invJ21 * F1 + invJ22 * F2);

    U1 += dU1;
    U2 += dU2;
    if (!isFinite(U1) || !isFinite(U2)) {
      console.warn("Diverged in solveFlowInB");
      break;
    }
  }

  const U3 = U1 - U2;

  const dir1 = U1 >= 0 ? 'up' : "down";
  const dir2 = U2 >= 0 ? 'down' : "up";
  const dir3 = U3 >= 0 ? 'down' : "down";

  return {
    U1: U1,
    U2: U2,
    U3: U3,
    dir1: dir1,
    dir2: dir2,
    dir3: dir3
  };
}

export function solveThreeTanks(l2, hB) {
  const hA = 100.0; // same fixed Tank A head
  const solverIn = solveFlowInB(l2, hB)
  const solverOut = solveFlowOutB(l2, hB);

  if (solverIn.U1 >= 0 && solverIn.U2 >= 0 && solverIn.U3 >= 0) {
    // If both U1 and U2 are positive, we can use flow_in_B
    console.log(l2, hB, solverIn);
    return solverIn;
  } else {
    // If both U1 and U2 are positive, we can use flow_out_B
    console.log(l2, hB, solverOut);
    return solverOut;
  }
}


// ─── 4) Quick demo (Node.js or browser console) ───────────────────────────────
if (typeof module !== "undefined" && module.exports) {
  console.log("Case A: l2=500, hB=0  → ", solveThreeTanks(500, 0));
  console.log("Case B: l2=1000, hB=20 → ", solveThreeTanks(1000, 20));
}