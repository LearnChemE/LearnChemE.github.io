import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

MW_PENT = 72.151
MW_HEX = 86.178
rho_p = .626
rho_h = .659
CM3_PER_MOL = 83.14 * 298 # 22414 # cm^3/mol for N2 at ~25 °C, 1 bar

P = 1.0
V0 = 61.5
QN2 = 35

Psat = {
    15: [.33, .12],
    20: [.42, .16],
    25: [.57, .20]
}

AntoineCoeffs = {
  "pentane":
    { "A": 3.9892,  "B": 1070.617, "C": -40.454}, # "TminK": 268.8,  "TmaxK": 341.37
  "hexane":
    { "A": 4.00266, "B": 1171.53,  "C": -48.784}, # "TminK": 286.18, "TmaxK": 342.69 
}

def sccmToMolPerMin(sccm):
    return sccm / CM3_PER_MOL

def psatBarFromAntoine(species, Tc):
    Tk = Tc + 273.15
    coeffs = AntoineCoeffs[species]

    log10P = coeffs["A"] - (coeffs["B"] / (Tk + coeffs["C"]))
    return 10 ** log10P

def getPsatBar(Tc):
    return [
        psatBarFromAntoine('pentane', Tc),
        psatBarFromAntoine('hexane',  Tc)
    ]

def initialMolesFromVolumeEquimolar(V0_cm3):
    """
    Compute initial moles for an equimolar (x=0.5/0.5) mixture given total volume (cm^3).
    Uses ideal mixing with component densities to back-calc moles.
    """
    vPerMolPent = MW_PENT / rho_p # cm^3/mol
    vPerMolHex  = MW_HEX  / rho_h  # cm^3/mol
    vBar = 0.5 * (vPerMolPent + vPerMolHex) # cm^3/mol of total mixture for x=0.5
    Ntot0 = V0_cm3 / vBar # total moles initially
    return [0.5 * Ntot0, 0.5 * Ntot0]

def rhs(Npent, Nhex, pPent, pHex, FN2_mol_min):
    """
    (Updated signature) Single Euler step for the mole balances.
    Pass in psat (bar) object {pentane, hexane} to avoid recomputing every step.
    dN_i/dt = -F_i,out, where F_i = FN2 * (x_i * P_i^sat) / P_N2
    """
    Ntot = np.max([Npent + Nhex, 1e-12])
    xPent = Npent / Ntot
    xHex  = 1 - xPent

    PN2 = P - (xPent * pPent + xHex * pHex)

    F_pent = FN2_mol_min * (xPent * pPent) / PN2 # mol/min out
    F_hex  = FN2_mol_min * (xHex  * pHex)  / PN2 # mol/min out
    return [-F_pent, -F_hex]

def volumeFromMoles(np, nh):
    vp = np * MW_PENT / rho_p
    vh = nh * MW_HEX / rho_h
    return vp + vh

if __name__ == "__main__":
    ndot_N2 = sccmToMolPerMin(QN2)
    print(ndot_N2)
    temps = [15, 20, 25]
    y00 = initialMolesFromVolumeEquimolar(V0)
    y00.append(0) # add noise state variable

    tmax = 600
    t_eval = np.linspace(0, tmax, 101)


    tau = 10
    stds = [0, 0.1, 0.25, 0.5] # standard deviations for noise

    for std in stds:
        pent = []
        hex = []
        y0 = y00.copy()

        psat = getPsatBar(15)
        print(f"psat: {psat}")
        
        dt = t_eval[1] - t_eval[0]
        for t in t_eval:
            dw = np.random.normal(0, std * np.sqrt(dt)) # Wiener process increment

            def f(t, y):
                yrhs = rhs(y[0], y[1], psat[0], psat[1], ndot_N2)
                noise = max(min(y[2], 1), -1) # Ensure noise is bounded
                dnoise = (-noise / tau) + dw / tau

                return [yrhs[0] * (1 + noise), yrhs[1] * (1 + noise), dnoise]

            sol = solve_ivp(f, [t, t + dt], y0, 'RK45', [t, t + dt])
            
            pent.append(sol.y[0][0])
            hex.append(sol.y[1][0])

            y0 = [sol.y[0][-1], sol.y[1][-1], sol.y[2][-1]] # update initial conditions for next step

        t = t_eval / 60

        pent = np.array(pent)
        hex = np.array(hex)
        print(pent)
        print(pent.shape, hex.shape, t.shape)

        plt.plot(t, volumeFromMoles(pent, hex), label='std=' + str(std))

    plt.xlabel('time in hours')
    plt.ylabel(r'total volume of liquid in bubbler, cm$^3$')
    plt.title('total volume with time')
    plt.grid()
    plt.legend()

    plt.show()

