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

const l1 = Math.sqrt(40**2 + 50**2);
const l3 = Math.sqrt(40**2 + 50**2);
const hA = 100.0;
const D  = 1.0;
const g  = 32.17;
const f  = 0.02;

function solveFlowOutB(hB) {
    const l2 = Math.abs(hB - 50) / Math.sin(Math.PI/3); // l2 is a function of hB, as per the problem statement
    
    // Precompute K₁, K₂, K₃ (head‐loss coefficients):
    //   head_loss_i = K_i * U_i²  where  K_i = f·l_i / (2·g·D)
    const K1 = (f * l1) / (2 * g * D);
    const K2 = (f * l2) / (2 * g * D);
    const K3 = (f * l3) / (2 * g * D);

    //
    let U1 = hA*hA/(2*g);   // initial guess: hA^2/(2g)
    let U2 = hB*hB/(2*g);   // initial guess: hB^2/(2g)
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

function solveFlowInB(hB) {

    const l2 = Math.abs(hB - 50) / Math.sin(Math.PI/3);
    
    const K1 = (f * l1) / (2 * g * D);
    const K2 = (f * l2) / (2 * g * D);
    const K3 = (f * l3) / (2 * g * D);
    
    let U1 = hA*hA/(2*g);   // initial guess: hA^2/(2g)
    let U2 = hB*hB/(2*g);   // initial guess: hB^2/(2g)
    const maxIter = 50;
    const tol     = 1e-8;
    
    for (let iter = 0; iter < maxIter; iter++) {
        const U3 = U1 - U2;  // continuity for flow_in_B
        
        // Residuals matching Python flow_in_B
        const F1 = hA - K1 * U1 * U1 - K3 * U3 * U3;
        const F2 = (hA - hB) - K2 * U2 * U2 - K1 * U1 * U1;
        // (Equivalently: (hA – hB) – [K2 U2² + K1 U1²] = 0  →  K2 U2² + K1 U1² – (hA – hB) = 0)
        // But we’ll keep the same sign structure as above (so F2=0) for NR.
        //
        // Finally:  F3 = U1 – U2 – U3 = 0
        const F3 = U1 - U2 - U3;
        
        // Convergence check (only use F1 & F2 in the 2×2 Jacobian):
        const normF = Math.hypot(F1, F2);
        if (normF < tol) break;
        
        
        // Jacobian matching derivatives of Python residuals
        const J11 = -2 * K1 * U1 - 2 * K3 * U3;
        const J12 = 2 * K3 * U3;
        const J21 = -2 * K1 * U1;
        const J22 = -2 * K2 * U2;
        
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

export function solveThreeTanks(hB) {
  
    const solverIn = solveFlowInB(hB)
    const solverOut = solveFlowOutB(hB);
    
    console.log("hB:", hB);
    console.log("Solver In:", solverIn);
    console.log("Solver Out:", solverOut);
    if (hB >= 50) {
        if (solverOut.U1 >= 0 && solverOut.U2 >= 0 && solverOut.U3 >= 0) {
            // If both U1 and U2 are positive, we can use flow_in_B
            console.log(hB, solverOut);
            return solverOut;
        } else {
            // If both U1 and U2 are positive, we can use flow_out_B
            console.log(hB, solverIn);
            return solverIn;
        }
    } else {
        if (solverIn.U1 >= 0 && solverIn.U2 >= 0 && solverIn.U3 >= 0) {
            // If both U1 and U2 are positive, we can use flow_in_B
            console.log(hB, solverIn);
            return solverIn;
        } else {
            // If both U1 and U2 are positive, we can use flow_out_B
            
            console.log(hB, solverOut);
            return solverOut;
        }
    }
}