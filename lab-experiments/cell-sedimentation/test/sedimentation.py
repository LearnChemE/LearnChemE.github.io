# Drew Smith
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp
import settlingVel as vel

# Spatial information
nz = 505 # Spatial info
lz = 505 # mm
z = np.linspace(0,lz,nz)
dz = z[1] - z[0]

# max velocities
vr_max, vw_max = vel.particle_velocities(0,0)
cr_max, cw_max = vel.concentration(1, vel.d_r), vel.concentration(1, vel.d_w)

# Initial conditions
xw0 = 0.05
xr0 = .4
cr0 = np.ones_like(z) * vel.concentration(xr0, vel.d_r)
cw0 = np.ones_like(z) * vel.concentration(xw0, vel.d_w)
y0 = np.concatenate((cr0, cw0))

def grad(y, dx):
    left = np.roll(y, 1)
    right = np.roll(y, -1)
    dydx = (right - left) / (2 * dx)
    dydx[0] = (right[0] - y[0]) / dx
    dydx[-1] = (y[-1] - left[-1]) / dx
    return dydx

def grad2(y, dx):
    deriv = (np.roll(y, 1) - 2 * y + np.roll(y, -1)) / dx
    return deriv

# Def rhs
def rhs(t, y):
    print("current t:", t)
    # Unpack y
    cr = y[:nz]; cw = y[nz:]
    # cr[0] = 0

    # Determine velocity
    vr, vw = vel.particle_velocities(cr, cw)
    vr[0] = 0; vw[0] = 0 # Top is free surface
    vr[-1] = 0; vw[-1] = 0 # Bottom stops flow

    # Diffusion
    dif_r = 1e0 * grad((1 - cr / cr_max)**2 * grad(cr, dz), dz)
    dif_w = 1e0 * grad((1 - cw / cw_max)**2 * grad(cw, dz), dz)
    dif_r[0] = dif_r[-1] = 0 # no flux
    dif_w[0] = dif_w[-1] = 0 # no flux
    # Advection
    adv_r = grad(cr * vr, dz)
    adv_w = grad(cw * vw, dz)

    drdt = dif_r - adv_r
    dwdt = dif_w - adv_w
    # drdt[0]  = 0; dwdt[0]  = 0 # Maintain sediment
    # drdt[-1] = 0; dwdt[-1] = 0 # Maintain free surface

    return np.concatenate((drdt, dwdt))

if __name__ == "__main__":

    # ivp args
    tmax = 112
    tspan = (0, tmax)
    # t_eval = np.logspace(0,2,3) * 2
    t_eval = np.linspace(0,tmax,7)
    sol = solve_ivp(rhs, tspan, y0, 'BDF', t_eval)

    y = sol.y
    print(y.shape)
    tot_r = np.sum(y[:nz,:])
    for i, t in enumerate(sol.t):
        cr = y[:nz,i]; cw = y[nz:,i]
        print(f"time {t:.3f} mass: {np.sum(cr):.1f}")
        # cr = cr / np.sum(cr) * tot_r
        xr = vel.vol_frac(cr, vel.d_r); xw = vel.vol_frac(cw, vel.d_w)
        vr, vw = vel.particle_velocities(cr, cw)
        plt.plot(z, xr, label=f'red t={t:.1f}')
        # plt.plot(z, vr, label=f'white t={t:.1f}')

    plt.ylabel('concentration')
    plt.ylim((0,1))
    plt.xlabel('height')
    plt.legend()
    plt.show()
    
    tot_r = np.sum(y[nz:,:])
    for i, t in enumerate(sol.t):
        cr = y[:nz,i]; cw = y[nz:,i]
        print(f"time {t:.3f} mass: {np.sum(cw):.1f}")
        # cr = cr / np.sum(cr) * tot_r
        xw = vel.vol_frac(cw, vel.d_w)
        vr, vw = vel.particle_velocities(cr, cw)
        plt.plot(z, xw, label=f'white t={t:.1f}')

    plt.ylabel('concentration')
    plt.ylim((0,1))
    plt.xlabel('height')
    plt.legend()
    plt.show()

    plt.plot(z, xr, 'r-', label=f'red final')
    plt.plot(z, xw, 'k-', label=f'white final')
    plt.show()