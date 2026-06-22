import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp
import math as m
import builtins

MODE = getattr(builtins, 'MODE', 'adsorption')
print(MODE)

PERMEABILITY = 1e0 # permeability (cm2)
MU = 1.8e-5 # viscosity of CO2 (kg/m/s)
T = 298 # temperature (K)

LENGTH_BED = 20 # cm
EXTENDED_LENGTH = 0.125 * LENGTH_BED if (MODE == "adsorption") else 0 # cm, for numerical stability
TOTAL_LENGTH = LENGTH_BED + EXTENDED_LENGTH
RHO_ZEOLITE = 0.75 # g/cc
MASS_ZEOLITE = 10 if (MODE == "adsorption") else 1 # g
MM_CO2 = 44.009 # g/mol
MM_N2 = 14.041 # g/mol
R = 83.14 # bar cc / mol / K
CAPACITY = MASS_ZEOLITE / 1000 * 2.5 # mols, 2.5 mol/kg is common
DIFFUSIVITY = 1.8e-2 * 60 # m^2/s, diffusivity of CO2 in zeolite
inv_RT = 1 / R / T # 1 / (R * T) in mol / bar / cc

# Per element scheme:
# [ pco2, Ptot, theta_co2 ], referred to as [p, P, th]

# Spatial info
N = 50 if (MODE == "adsorption") else 1 # number of points in spatial discretization
E = 3 # number of equations per point (tot pressure, co2 pressure, theta, velocity) stride
NE = N * E # number of equations in the system
NT = NE + 2 * E # Size of arrays including padding
dx = TOTAL_LENGTH / N # cm, spatial step size
x = np.linspace(0, TOTAL_LENGTH - dx, N) # spatial points
centroids = x + dx / 2

BED_END_IDX = centroids.searchsorted(LENGTH_BED) - 1
print("Bed end index: ", BED_END_IDX, " at position ", centroids[BED_END_IDX])

# Geometry
VOL_BED = MASS_ZEOLITE / RHO_ZEOLITE # cc
AREA_BED = VOL_BED / LENGTH_BED # cm^2
BED_RADIUS = np.sqrt(AREA_BED / np.pi) # cm
PRESSURE_CAPACITY_EQUIV = CAPACITY * R * T / VOL_BED # bar, should be mol/m3
print("Radius: ", BED_RADIUS)

# note: uses mole fractions
def molar_mass(x_co2):
    return x_co2 * MM_CO2 + (1 - x_co2) * MM_N2

# Kinetic parameters
ka0 = 2.0e-1 # bar^-1 min^-1
ea = 1000 # convert from kJ/mol to K
kd0 = 1e7 # 
ed = 1e4
def k_val(k0, ea, T):
    return k0 * np.exp(-ea / T)

TVD_METHOD = "SuperBee" # "MinMod", "VanLeer", or "SuperBee"

def fluxLimiter(r, method):
    if method == "SuperBee":
        return max(0, min(2 * r, 1), min(r, 2))
    elif method == "MinMod":
        return max(0, min(1, r))
    elif method == "VanLeer":
        return (r + abs(r)) / (1 + abs(r))
    else: # upwind only
        return 0

# 1D linear coordinates
# V d(ph)/dt = -adv + dif + src

def rhs(t, y, y_l, P_l, u_l, ka, kd, T):
    S = AREA_BED
    V = VOL_BED
    dydt = np.zeros_like(y)

    # u_l = -PERMEABILITY * (y[1] - P_l) / dx
    if y[1] != 0 and P_l != 0:
        p_cm = (y[0] + y_l * P_l) / 2
        P_cm = (y[1] + P_l) / 2
        y_cm = p_cm / P_cm
        # Use chain rule to separate gradient
        dyP = (y[0] - y_l * P_l) / dx
        ydP = y_cm * (y[1] - P_l) / dx
        Pdy = dyP - ydP
        dif_p = -DIFFUSIVITY * Pdy
    else:
        dif_p = 0

    pf = [ 
        (P_l) * (u_l) * y_l,
        (P_l) * (u_l),
        dif_p
    ] # [ adv_p, adv_P, dif_p ] for the first face (inlet)
    # print(P_l * inv_RT)
    # print(P_l, u_l)
    
    for i in range(N):
        # indices
        ip = i * E
        iP = ip + 1
        it = ip + 2

        # Values at relevant centroids
        p_n = y[ip + E] if i < N-1 else y[ip]
        p_p = y[ip]
        p_pp= y[ip - E] if i > 0 else y_l * P_l
        P_n = y[iP + E] if i < N-1 else y[iP]
        P_p = y[iP]
        P_pp= y[iP - E] if i > 0 else P_l
        u = u_l #-PERMEABILITY * (P_n - P_p) / dx
        
        # TVD
        # Assume forward flow for upwinding
        rp = (p_n - p_p) / (p_p - p_pp) if (p_p - p_pp) else 0
        rP = (P_n - P_p) / (P_p - P_pp) if (P_p - P_pp) else 0
        # Use for flux limiting
        rhph_p = p_p + 1/2 * fluxLimiter(rp, TVD_METHOD) * (p_p - p_pp) # * inv_RT
        rh_p   = P_p + 1/2 * fluxLimiter(rP, TVD_METHOD) * (P_p - P_pp) # * inv_RT

        # calc next face
        # adv = sum [ S * rh * u * ph ] for each face
        adv_p = rhph_p * u # * S
        adv_P = rh_p * u # * S

        # Diffusion for pco2
        # dif_face = S * rh * DIFFUSIVITY * (p_n - p_p)
        if (P_n != 0 and P_p != 0):
            p_cm = (p_n + p_p) / 2
            P_cm = (P_n + P_p) / 2
            y_cm = p_cm / P_cm
            # Use chain rule to separate gradient
            dyP = (p_n - p_p) / dx
            ydP = y_cm * (P_n - P_p) / dx
            Pdy = dyP - ydP
            dif_p = -DIFFUSIVITY * Pdy
        else:
            dif_p = 0

        # Reaction
        th = y[it]
        th_star = 1 - th

        ads = ka * y[ip] * th_star
        des = kd * th

        rxn_p = (des - ads) * R * T # Pressure changes: mol/cm3/min to bar/min
        rxn_t = (ads - des) * VOL_BED / CAPACITY # Theta changes: mol/cm3/min to min^-1
        # if (i == N-1):
        #     rxn_p = 0
        #     rxn_t = 0
        
        
        # in - out
        dydt[ip] = (pf[0] - adv_p) / dx + (pf[2] - dif_p) / dx + rxn_p
        dydt[iP] = (pf[1] - adv_P) / dx + rxn_p
        dydt[it] = rxn_t

        pf = [ adv_p, adv_P, dif_p ] # for the next face

    # dif = sum [ S * rh * Ga * del ph ] for each face
    return dydt

def smooth(y, window_size):
    """
    Convolve a 1D numpy array y with a moving average filter of given size.
    Pads the edges with the first and last values in y to maintain size.
    
    Parameters
    ----------
    y : np.ndarray
        Input array (1D)
    window_size : int
        Size of the moving average window (must be positive)
    
    Returns
    -------
    np.ndarray
        Smoothed array of the same length as y
    """
    if window_size < 1:
        raise ValueError("window_size must be at least 1")
    if window_size == 1:
        return y.copy()

    # Pad edges with first/last value to handle boundary effects
    pad_width = window_size // 2
    y_padded = np.pad(y, pad_width, mode='edge')

    # Create the normalized moving average kernel
    kernel = np.ones(window_size) / window_size

    # Perform convolution
    smoothed = np.convolve(y_padded, kernel, mode='valid')

    # Ensure output is the same size as input
    smoothed = smoothed[:len(y)] if len(smoothed) > len(y) else smoothed

    return smoothed

if __name__ == "__main__":
    P_l = 2 # bar
    y_l = 0.1 # mol fraction of CO2 in feed
    sccm = 100
    y0 = np.zeros(NE)

    ka = k_val(ka0, ea, T)
    kd = k_val(kd0, ed, T)

    Q = sccm * (1 / P_l) * T / 273.15
    u_l = Q / AREA_BED # cm / min

    ndot = P_l * Q / R / T
    mdot = molar_mass(y_l) * ndot
    print("Inlet velocity (cm/min): ", u_l)
    print("CO2 inlet mole flowrate (mol/min): ", ndot * y_l)
    print("Time scale of stoicheometric adsorption (min): ", CAPACITY / (ndot * y_l))
    print("Time scale of flow through bed (min): ", VOL_BED / Q)

    def rhs_wrapped(t, y):
        # print("solving at time", t)
        return rhs(t, y, y_l, P_l, u_l, ka, kd, T)

    sol = solve_ivp(rhs_wrapped, [0, 80], y0, 'RK45')

    yf = sol.y[:, -1]
    
    p = []
    P = []
    th = []

    for i in range(N):
        ip = i * E
        iP = ip + 1
        it = ip + 2

        p.append(yf[ip])
        P.append(yf[iP])
        th.append(yf[it])
    
    p = np.array(p)
    P = np.array(P)
    th = np.array(th)
    y = p / (P * inv_RT)

    plt.plot(x, p, label='p')
    plt.plot(x, P, label='P')
    plt.plot(x, th, label='theta')
    plt.xlabel('Position (cm)')
    plt.ylabel('Concentration')
    plt.legend()
    plt.show()

    t = sol.t
    y = smooth(sol.y[BED_END_IDX * E, :], window_size=13)

    y_initial = y[0]
    y_final = y[-1]
    y_breakthrough = y_initial + 0.01 * (y_final - y_initial) # 5% breakthrough
    y_saturation = y_final - 0.01 * (y_final - y_initial) # 95% saturation
    idx_breakthrough = None
    idx_saturation = None
    for i, yi in enumerate(y):
        if yi >= y_breakthrough and idx_breakthrough is None:
            idx_breakthrough = i

        if yi >= y_saturation and idx_saturation is None:
            idx_saturation = i
        elif yi >= y_saturation: # and idx_saturation is not None:
            break

    if idx_breakthrough is None or idx_saturation is None:
        print("Warning: Breakthrough or saturation point not found in data.")
        exit(1)
    
    n = y * Q / R / T * 1000 # mmol/min
    n_final = n[-1]
    # m = n * molar_mass(y_l) * 1000 # mg/min
    # m_final = m[-1]

    area_under = np.trapezoid(n, t) / 1000
    area_total = n_final * (t[-1] - t[0]) / 1000
    n_over = y_l * P_l * VOL_BED / R / T # number of moles in the bed in gas phase
    n_adsorbed = area_total - area_under
    
    print(f"Breakthrough time: {t[idx_breakthrough]:.2f} min, Saturation time: {t[idx_saturation]:.2f} min")
    print(f"mols adsorbed: {n_adsorbed} mols (capacity of {CAPACITY} mols)")
    print(f"Accounting for {n_over} moles in gas phase in bed, {n_adsorbed - n_over} moles adsorbed")
    
    # Show plot integrated to breakthrough
    plt.plot(t, n, 'k-', label=r'outlet $CO_2$ pressure')
    plt.vlines(t[idx_breakthrough], 0, n_final, color='k', linewidth=1, linestyle='--', label='breakthrough time')
    plt.fill_between(t[:idx_breakthrough+1], n[:idx_breakthrough+1], n_final, color="purple", alpha=0.3, label=r"$CO_2$ adsorbed")
    # plt.legend()
    plt.xlabel('time (min)')
    plt.ylabel(r'outlet $CO_2$ flowrate (mmol/min)')
    plt.show()

    # ndot = PQ/RT
    # mdot = MM ndot
    # mdot = MM * PQ/RT
    
    # Show plot integrated to saturation
    plt.plot(t, n, 'k-', label='outlet $CO_2$ pressure')
    plt.fill_between(t[:idx_breakthrough+1], n[:idx_breakthrough+1], n_final, color="purple", alpha=0.3, label=r"$CO_2$ adsorbed")
    plt.vlines(t[idx_breakthrough], 0, n_final, color='k', linewidth=1, linestyle='--', label='breakthrough time')
    plt.vlines(t[idx_saturation], 0, n_final, color='k', linewidth=1, linestyle=':', label='saturation time')

    line_t = np.array([t[idx_breakthrough], t[idx_saturation]])
    line_y = np.array([n[idx_breakthrough], n[idx_saturation]])

    plt.plot(line_t, line_y, color='purple', linestyle='-', label='integration symmetry line')
    plt.fill_between(line_t, line_y, n_final, color="purple", alpha=0.3)

    # plt.legend()
    plt.xlabel('time (min)')
    plt.ylabel(r'outlet $CO_2$ flowrate (mmol/min)')
    plt.show()