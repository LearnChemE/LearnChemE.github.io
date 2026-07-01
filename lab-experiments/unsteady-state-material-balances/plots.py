import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

MW_PENT = 72.151
MW_HEX = 86.178
rho_p = .626
rho_h = .659
CM3_PER_MOL = 22414 # cm^3/mol for N2 at ~25 °C, 1 bar

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
    temps = [15, 20, 25]
    y0 = initialMolesFromVolumeEquimolar(V0)
    print(y0)

    tmax = 600
    t_eval = np.linspace(0, tmax, 101)

    pent = []
    hex = []
    for tc in temps:
        psat = getPsatBar(tc)
        def f(t, y):
            return rhs(y[0], y[1], psat[0], psat[1], ndot_N2)
        sol = solve_ivp(f, [0, tmax], y0, 'RK45', t_eval)
        pent.append(sol.y[0])
        hex.append(sol.y[1])

    fig, ax = plt.subplots(2, 1)
    t = t_eval / 60

    ax[0].plot(t, volumeFromMoles(pent[0], hex[0]), label='15 °C')
    ax[0].plot(t, volumeFromMoles(pent[1], hex[1]), label='20 °C')
    ax[0].plot(t, volumeFromMoles(pent[2], hex[2]), label='25 °C')
    ax[0].set_xlabel('time in hours')
    ax[0].set_ylabel(r'total volume of liquid in bubbler, cm$^3$')
    ax[0].set_title('total volume with time')
    ax[0].grid()
    ax[0].legend()

    ax[1].plot(t, pent[0] / (hex[0] + pent[0]), label='15 °C')
    ax[1].plot(t, pent[1] / (hex[1] + pent[1]), label='20 °C')
    ax[1].plot(t, pent[2] / (hex[2] + pent[2]), label='25 °C')
    ax[1].set_xlabel('time in hours')
    ax[1].set_ylabel('mole fraction of pentane in bubbler')
    ax[1].set_title('mole fraction of pentane with time')
    ax[1].grid()
    ax[1].legend()

    plt.show()

