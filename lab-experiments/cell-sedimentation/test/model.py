import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

rho_f = 0.868 # Fluid density (g/cc)
g = 981      # Gravitational acceleration (cm/s^2)
mu = 2.15    # Fluid viscosity (mPa.s)

rho_r = 1.08 # Red cell density (g/cc)
d_r = 275e-4 # Red cell diameter (cm)
# d_r = 7e-4 # Red cell actual diameter (cm)
rho_w = 1.00 # White cell density (g/cc)
d_w = 550e-4 # White cell diameter (cm)
# d_w = 12e-4 # White cell actual diameter (cm)

def concentration(phi, dp):
    """Convert volume fraction to number concentration (#/cc) for particles of diameter dp (cm)."""
    return 6 * phi / (np.pi * dp**3)

def volume_fraction(n, dp):
    """Convert number concentration (#/cc) to volume fraction for particles of diameter dp (cm)."""
    return n * (np.pi * dp**3) / 6

def settling_coeff_g(d_p, rho_p):
    """Calculate the settling velocity of an independant particle using Stokes' law."""
    vs = (rho_p - rho_f) * g * d_p**2 / (18 * mu)  # m/s
    return vs * 1000  # Convert to mm/s 

# Average void envelope thickness
def d_Ep(r_conc, w_conc):
    d_avg = (r_conc * d_r + w_conc * d_w) / (r_conc + w_conc)
    ep = 1.0 - (r_conc + w_conc) * (1 - .4) # Typical packed bed void fraction for spheres
    ep = np.where(ep >= 1, 1, ep) # Prevent negative porosity
    return d_avg * ((1 - ep)**(-1/3) - 1)  # Void envelope thickness

# Calculate settling velocities
Sr_g = settling_coeff_g(d_r, rho_r)
Sw_g = settling_coeff_g(d_w, rho_w)

# Calculate actual particle velocities given concentrations
def particle_velocities(conc_r, conc_w):
    """Calculate the effective settling velocity of a mixture of red and white cells."""
    # Convert to volume fractions
    ph_r = volume_fraction(conc_r, d_r)
    ph_w = volume_fraction(conc_w, d_w)
    if (ph_r + ph_w >= 1).any():
        return 0, 0 # Prevent unphysical concentrations
    conc_f = 1 - ph_r - ph_w  # volume fraction of fluid
    rho_susp = ph_r * rho_r + ph_w * rho_w + conc_f * rho_f # Suspension density (g/cc)
    d_ep = d_Ep(ph_r, ph_w) # Average void envelope thickness
    ep_r = 1 - (1 + d_ep / d_r) ** -3  # Red cell porosity
    ep_w = 1 - (1 + d_ep / d_w) ** -3  # White cell porosity
    vrs = Sr_g * (rho_r - rho_susp) / (rho_r - rho_f) * ep_r**4.6 # Red cells hindered settling
    vws = Sw_g * (rho_w - rho_susp) / (rho_w - rho_f) * ep_w**4.6 # White cells hindered settling
    vfc = -(ph_r * vrs + ph_w * vws) # Fluid counterflow
    vrc = vrs + vfc # Red cell velocity
    vwc = vws + vfc # White cell velocity
    return vrc, vwc # mm / s

def ddz_noflux(arr, dz):
    dz = z[1] - z[0]
    prev = (np.roll(arr, 1) - arr) / dz
    next = (np.roll(arr, -1) - arr) / dz
    # Enforce no-flux BCs
    ddz = (next - prev) / 2
    ddz[0] = (arr[1]) / dz
    ddz[-1] = (-arr[-2]) / dz
    return ddz

if __name__ == "__main__":
    # Example usage
    Nz = 1280
    ph_r0 = .3
    ph_w0 = .05
    tmax = 60 * 120 # minutes

    cw = np.ones(Nz) * concentration(ph_w0, d_w) # init vol frac white cells
    cr = np.ones(Nz) * concentration(ph_r0, d_r) # init vol frac red cells
    # cr[100] *= 1000
    # cr[101] *= 1000
    print(cr)
    z = np.linspace(0, 305, Nz) # mm height
    y0 = np.concatenate((cr, cw))
    
    def continuum(t, y, z):
        cr, cw = y[:Nz], y[Nz:]
        vr, vw = particle_velocities(cr, cw)
        crvr = cr * vr
        cwvw = cw * vw

        dz = z[1] - z[0]
        dcrdt = ddz_noflux(crvr, dz)
        dcwdt = ddz_noflux(cwvw, dz)

        # Add small diffuse term for numerical stability
        dcrdt += 1e-4 * np.gradient(np.gradient(cr, z), z)
        dcwdt += 1e-4 * np.gradient(np.gradient(cw, z), z)

        return np.concatenate([dcrdt, dcwdt])
        
    def rhs_wrapper(t, y):
        return continuum(t, y, z)
    
    sol = solve_ivp(rhs_wrapper, [0, tmax], y0, method='RK45', t_eval=np.linspace(0, tmax, 300))

    # Plot results
    cr = sol.y[:Nz]
    cw = sol.y[Nz:]
    print(cr.shape, cw.shape)
    # vr, vw = particle_velocities(cr, cw)
    plt.figure()
    plt.contourf(sol.t / 60, z, volume_fraction(cr, d_r), levels=50, cmap='Reds')
    plt.colorbar(label='Red cell concentration (vol frac)')
    plt.xlabel('Time (minutes)')
    plt.ylabel('Height (mm)')
    plt.title('Red Cell Concentration Over Time')
    plt.show()
    print(volume_fraction(cr, d_r))


    plt.figure()
    plt.contourf(sol.t / 60, z, volume_fraction(cw, d_w), levels=50, cmap='Greys')
    plt.colorbar(label='Red cell concentration (vol frac)')
    plt.xlabel('Time (minutes)')
    plt.ylabel('Height (mm)')
    plt.title('Red Cell Concentration Over Time')
    plt.show()

    # Plot settling velocities
    cr = np.linspace(0, 0.95, 100)
    cw = ph_w0 * np.ones_like(cr)
    vr, vw = particle_velocities(cr, cw)
    plt.figure()
    plt.plot(cr, vr, label="Red cells", color='red')
    plt.plot(cr, vw, label="White cells", color='gray')
    plt.xlabel("Red cell concentration (vol frac)")
    plt.ylabel("Settling velocity (mm/s)")
    plt.legend()
    plt.title(f"White cell concentration = {ph_w0:.2f} vol frac")
    plt.grid()
    plt.show()