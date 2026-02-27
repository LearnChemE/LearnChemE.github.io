import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

def Ka(ka0, ea, T):
    return ka0 * np.exp(-ea / T)

# params
LENGTH_BED = 20 # cm
RHO_ZEOLITE = .75 # g/cc
MASS_ZEOLITE = 4 * 1000 # g; 1 kg
MM_CO2 = 44.009 # g/mol
MM_N2 = 14.01 # g/mol
R = 83.14 # bar cc / mol / K
BED_CAPAC = MASS_ZEOLITE / 1000 * 0.85 # moles
N = 201
TH = 15 # minutes
BETA = 4 # K/min
# Spatial info
x = np.linspace(0, LENGTH_BED, N)
dx = x[1] - x[0]

# Calculated geometry
VOL_BED = MASS_ZEOLITE / RHO_ZEOLITE # cc
AC_BED = VOL_BED / LENGTH_BED # cm2
RADIUS_BED = np.sqrt(AC_BED / np.pi) # cm
D = 1.8e-9 # m2/s

# Inlet information
P_in = 1 # bar
mdot_in = 5 # mg / min
T = 298 # K
x_co2 = .1

def TCD(t):
    t = np.atleast_1d(t)
    result = np.where(t < 10, 298, 298 + BETA * (t - 10))
    result = np.minimum(result, 673)
    return result[0] if np.isscalar(t) else result

# note: uses mole fractions
def molar_mass(x_co2):
    return x_co2 * MM_CO2 + (1 - x_co2) * MM_N2

# pv = nrt; Vdot = ndot * RT / P
def calc_velocity(mdot, x_co2, P):
    ndot = mdot / molar_mass(x_co2) # mol/s
    q = ndot * R * T / P # cc/s
    return q / AC_BED # cm/s

# @dataclass
# class BedParams:
#     pco2: float  # atm
#     theta: float   # fractional coverage
#     u: float # velocity [m/s]

BedParams_dtype = np.dtype([('pco2', 'f8'), ('th', 'f8'), ('u', 'f8')])

def make_padded_arr(y, left):
    y = y.copy().view(BedParams_dtype)
    return np.concatenate([[left], y, [y[N-1]]])

def unpad(arr):
    return arr[1:N+1].view('f8')

# Handle advection term () using upwinding
def advection(y, dx):
    inv_dx = 1/dx
    adv = np.array([(0.0, 0.0, 0.0) for _ in range(N)], dtype=BedParams_dtype)

    for i in range(1,N+1):
        # Upwinding, but velocity will always be positive
        dp  = y[i]['pco2'] - y[i-1]['pco2']
        adv[i-1]['pco2'] = - y[i]['u'] * dp * inv_dx
        du = y[i]['u'] - y[i-1]['u']
        adv[i-1]['u'] = - y[i]['u'] * du * inv_dx
    
    return adv.view('f8')

# Handle diffusion term () using central differences
def diffusion(y, dx):
    inv_dx2 = 1/dx/dx
    dif = np.array([(0.0, 0.0, 0.0) for _ in range(N)], dtype=BedParams_dtype)

    for i in range(1,N+1):
        d2p = (y[i+1]['pco2'] + y[i-1]['pco2'] - 2 * y[i]['pco2']) * inv_dx2
        dif[i-1]['pco2'] = d2p * D
        d2u = (y[i+1]['u'] + y[i-1]['u'] - 2 * y[i]['u']) * inv_dx2
        dif[i-1]['u'] = d2u * D
    
    return dif.view('f8')

# Handle diffusion term () using central differences
def reaction(y, ka, kd):
    rxn = np.array([(0.0, 0.0, 0.0) for _ in range(N)], dtype=BedParams_dtype)

    for i in range(1,N+1):
        p = y[i]['pco2']
        th = y[i]['th']
        th_star = 1 - th

        ads = ka * p * th_star
        des = kd * th

        rxn[i-1]['pco2'] = des - ads
        rxn[i-1]['th']   = (ads - des) / BED_CAPAC
    
    return rxn.view('f8')

# rhs
def rhs(t: float, y: np.ndarray, left: np.ndarray, dx: float, ka: float, kd: float):
    # Advection-diffusion with reaction:
    # dCdt = D d2Cdx2 - u dCdx + kd th - ka C (1 - th)
    y = make_padded_arr(y, left)

    adv = advection(y, dx)
    dif = diffusion(y, dx)
    rxn = reaction(y, ka, kd)

    return dif + adv + rxn

def flatten(arr: np.ndarray):
    return arr.view('f8')

def adsorption(tspan, t_eval=np.linspace(0, 60, 5), params=(1e4, 2000, 300, 5000)):
    # Time info
    # Set initial conditions
    bed = np.array([(0.0, 0.0, 0.0) for _ in range(N)], dtype=BedParams_dtype)

    bed =flatten(bed)
    # Left boundary determined by user input
    left = np.array((P_in * x_co2, 0, calc_velocity(mdot_in, x_co2, P_in)), dtype=BedParams_dtype)

    (ka0, ea, kd0, ed) = params
    ka = Ka(ka0, ea, 298)
    kd = Ka(kd0, ed, 298)

    def rhs_wrapper(t: float, y: np.ndarray):
        return rhs(t, y, left, dx, ka, kd)
    
    return solve_ivp(rhs_wrapper, tspan, bed, 'LSODA', t_eval)


def desorption(bed, tspan, t_eval=np.linspace(0, 60, 5), params=(1e4, 2000, 300, 5000)):
    # Left boundary determined by user input
    left = np.array((0, 0, calc_velocity(mdot_in, 0, P_in)), dtype=BedParams_dtype)

    (ka0, ea, kd0, ed) = params
    beta = 2 # K/min

    def rhs_wrapper(t: float, y: np.ndarray):
        T = TCD(t)
        ka = Ka(ka0, ea, T)
        kd = Ka(kd0, ed, T)
        return rhs(t, y, left, dx, ka, kd)
    
    return solve_ivp(rhs_wrapper, tspan, bed, 'LSODA', t_eval)

if __name__ == "__main__":

    # Kinetic parameters
    ka0 = 2.196e4 # min^-1
    ea = 2000 # convert from kJ/mol to K
    kd0 = 8e6
    ed = 6e3
    params = (ka0, ea, kd0, ed)

    tspan = (0, 60)  # minutes
    t_eval = np.linspace(tspan[0], tspan[1], 60)
    sol = adsorption(tspan, t_eval, params=params)

    fig, ax = plt.subplots(3, 1)
    breakthrough = []
    for i, t in enumerate(t_eval):
        y = sol.y[:,i].copy()
        y = y.view(BedParams_dtype)
        breakthrough.append(y['pco2'][-1])
        for j, var in enumerate(["pco2", "th", "u"]):
            field = y[var]
            ax[j].plot(x, field, label=f"t={t}")

    # for axis in ax:
        # axis.legend()

    ax[0].set_title("pressure co2")
    ax[0].set_xlabel("x (cm)")
    ax[0].set_ylabel("pressure co2 (bar)")
    ax[1].set_title("fractional coverage")
    ax[1].set_xlabel("x (cm)")
    ax[1].set_ylabel("theta")
    ax[2].set_title("velocity")
    ax[2].set_xlabel("x (cm)")
    ax[2].set_ylabel("velocity (cm/s)")
    plt.show()
    
    # print(sol.y)
    plt.plot(t_eval, breakthrough)
    plt.title("Breakthrough curve for adsorption of 10% CO2 @ 1 bar")
    plt.xlabel("time (min)")
    plt.ylabel("pressure (bar)")
    plt.show()

    bed = sol.y[:,-1].copy()
    tspan = (0, 120)
    t_eval = np.linspace(tspan[0], tspan[1], 60)
    print(bed)
    sol = desorption(bed, tspan, t_eval, params=params)

    fig, ax = plt.subplots(3, 1)
    breakthrough = []
    for i, t in enumerate(t_eval):
        y = sol.y[:,i].copy()
        y = y.view(BedParams_dtype)
        breakthrough.append(y['pco2'][-1] / P_in)
        for j, var in enumerate(["pco2", "th", "u"]):
            field = y[var]
            ax[j].plot(x, field, label=f"t={t}")
    breakthrough = np.array(breakthrough)
    # for axis in ax:
        # axis.legend()

    ax[0].set_title("pressure co2")
    ax[0].set_xlabel("x (cm)")
    ax[0].set_ylabel("pressure co2 (bar)")
    ax[1].set_title("fractional coverage")
    ax[1].set_xlabel("x (cm)")
    ax[1].set_ylabel("theta")
    ax[2].set_title("velocity")
    ax[2].set_xlabel("x (cm)")
    ax[2].set_ylabel("velocity (cm/s)")
    plt.show()
    
    # print(sol.y)
    plt.plot(t_eval, breakthrough / P_in, "b-", label="gas composition")
    plt.ylabel("outlet CO2 mole fraction")
    ax = plt.twinx()
    ax.plot(t_eval, TCD(t_eval), "r-", label="temperature")
    ax.set_ylabel("temperature (K)")
    plt.title("Temperature Controlled Desorption @ 1 bar")
    plt.xlabel("time (min)")
    plt.legend()
    plt.show()