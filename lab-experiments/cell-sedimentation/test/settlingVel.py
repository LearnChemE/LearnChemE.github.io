# Drew Smith
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

rho_f = 0.868 # Fluid density (g/cc)
g = 981 # Gravitational acceleration (cm/s^2)
mu = 2.15 # Fluid viscosity (mPa.s)

rho_r = 1.08 # Red cell density (g/cc)
d_r = 275e-4 # Red cell diameter (cm)
# d_r = 7e-4 # Red cell actual diameter (cm)
rho_w = 1.00 # White cell density (g/cc)
d_w = 550e-4 # White cell diameter (cm)
# d_w = 12e-4 # White cell actual diameter (cm)

def concentration(phi, dp):
    """Convert volume fraction to number concentration (#/cc) for particles of diameter dp (cm)."""
    return 6 * phi / (np.pi * dp**3)

def vol_frac(conc, dp):
    return conc * np.pi * dp**3 / 6

def volume_fraction(n, dp):
    """Convert number concentration (#/cc) to volume fraction for particles of diameter dp (cm)."""
    return n * (np.pi * dp**3) / 6

def settling_coeff_g(d_p, rho_p):
    """Calculate the settling velocity of an independant particle using Stokes' law."""
    vs = (rho_p - rho_f) * g * d_p**2 / (18 * mu) # m/s
    return vs * 1000 # Convert to mm/s

# Average void envelope thickness
def d_Ep(r_conc, w_conc):
    mask = (r_conc + w_conc != 0)

    # (r_conc * d_r + w_conc * d_w)  / (r_conc + w_conc)
    d_avg = np.zeros_like(r_conc)
    np.divide(r_conc * d_r + w_conc * d_w,  r_conc + w_conc, d_avg, where=mask)
    ep = 1.0 - (r_conc + w_conc) * (1 - .4) # Typical packed bed void fraction for spheres

    # (1 - ep) ** (-1/3)
    mask = ep < 1
    pow = np.zeros_like(ep)
    np.pow(1 - ep, -1/3, pow, where=mask)
    return d_avg * (pow - 1) # Void envelope thickness

# Calculate settling velocities
Sr_g = settling_coeff_g(d_r, rho_r)
Sw_g = settling_coeff_g(d_w, rho_w)

# Calculate actual particle velocities given concentrations
def particle_velocities(conc_r, conc_w):
    """Calculate the effective settling velocity (mm/s) of a mixture of red and white cells."""
    # Convert to volume fractions
    ph_r = volume_fraction(conc_r, d_r)
    ph_w = volume_fraction(conc_w, d_w)
    # if (ph_r + ph_w >= 1).any():
    #     return 0, 0 # Prevent unphysical concentrations
    conc_f = 1 - ph_r - ph_w # volume fraction of fluid
    rho_susp = ph_r * rho_r + ph_w * rho_w + conc_f * rho_f # Suspension density (g/cc)
    d_ep = d_Ep(ph_r, ph_w) # Average void envelope thickness
    ep_r = np.where(d_ep > 0, 1 - (1 + d_ep / d_r) ** -3, 1) # Red cell porosity
    ep_w = np.where(d_ep > 0, 1 - (1 + d_ep / d_w) ** -3, 1) # White cell porosity
    vrs = Sr_g * (rho_r - rho_susp) / (rho_r - rho_f) * ep_r**4.6 # Red cells hindered settling
    vws = Sw_g * (rho_w - rho_susp) / (rho_w - rho_f) * ep_w**4.6 # White cells hindered settling
    vfc = -(ph_r * vrs + ph_w * vws) # Fluid counterflow
    vrc = vrs + vfc # Red cell velocity
    vwc = vws + vfc # White cell velocity
    return vrc, vwc # mm / s

if __name__ == "__main__":
    N = 101
    xw = np.linspace(0,1,N)
    xr = np.linspace(0,1,N)
    XR, XW = np.meshgrid(xr, xw)

    cr = concentration(XR, d_r)
    cw = concentration(XW, d_w)
    vr, vw = particle_velocities(cr, cw)
    print(vr)

    VR_filt = np.copy(vr); VW_filt = np.copy(vw)
    VR_filt[XR + XW > 1] = np.nan; VW_filt[XR + XW > 1] = np.nan

    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(XR, XW, VR_filt, cmap='hot')
    ax.plot_surface(XR, XW, VW_filt, cmap='cool')

    # Config
    ax.set_xlabel('red cell concentration')
    ax.set_ylabel('white cell concentration')
    ax.set_zlabel('velocity (mm/s)')
    plt.show()

    # plt.plot(xr, vr, 'r-', label='red')
    # plt.plot(xr, vw, 'k-', label='white')
    # plt.xlabel('concentration red cells')
    # plt.ylabel('settling velocity')
    # plt.show()
