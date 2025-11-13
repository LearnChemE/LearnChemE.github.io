# Drew Smith
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp
import settlingVel as vel

# Spatial information
nz = 500 # Spatial info
lz = 305 # mm

# max velocities
vr_max, vw_max = vel.particle_velocities(0,0)
cr_max, cw_max = vel.concentration(1, vel.d_r), vel.concentration(1, vel.d_w)

# Initial conditions
xw0 = 0.05
xr0 = 0.05
cr0 = vel.concentration(xr0, vel.d_r)
cw0 = vel.concentration(xw0, vel.d_w)
print("settling vel", vel.particle_velocities(cr0, cw0))

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
def rhs(y, dz):
    # Unpack y
    cr = y[:nz]; cw = y[nz:]
    cr[0] = 0; cw[0] = 0
    cr[-1] = cr[-2]; cw[-1] = cw[-2]

    # Determine velocity
    vr, vw = vel.particle_velocities(cr, cw)
    vr[0] = 0; vw[0] = 0 # Top is free surface
    vr[-1] = 0; vw[-1] = 0 # Bottom stops flow

    # Diffusion
    dif_r = 5e0 * grad((1 - cr / cr_max)**10 * grad(cr, dz), dz)
    dif_w = 5e0 * grad((1 - cw / cw_max)**10 * grad(cw, dz), dz)
    dif_r[0] = dif_r[-1] = 0 # no flux
    dif_w[0] = dif_w[-1] = 0 # no flux
    # Advection
    adv_r = grad(cr * vr, dz)
    adv_w = grad(cw * vw, dz)

    drdt = dif_r - adv_r
    dwdt = dif_w - adv_w
    drdt[0]  = 0; dwdt[0]  = 0 # Maintain free surface
    # drdt[-1] = drdt[-2]; dwdt[-1] = dwdt[-2] #

    return np.concatenate((drdt, dwdt))

def resize(y, z_old, y_threshold, sed_threshold=.1):
    cr = vel.vol_frac(y[:nz], vel.d_r); cw = vel.vol_frac(y[nz:], vel.d_w)

    # Find the top of the concentration curve
    tot_conc = cr + cw
    clear = tot_conc < y_threshold
    top = np.max(clear * z_old)

    # # Find the sediment boundary (bottom of the region of interest)
    # sediment = tot_conc > 1 - sed_threshold
    # if sediment.any():
    #     # print("z_old:", z_old[sediment])
    #     bot = np.min(z_old[sediment])
    # else:
    #     bot = z_old[-1]
    #     print(tot_conc[-1])

    # Create a new z array
    z_new = np.linspace(top, lz, nz)
    # Interpolate for the old array
    cr_new = vel.concentration(np.interp(z_new, z_old, cr), vel.d_r)
    cw_new = vel.concentration(np.interp(z_new, z_old, cw), vel.d_w)
    y_new = np.concatenate((cr_new, cw_new))
    return y_new, z_new

def diffusion_smooth(y, alpha=0.25, steps=1):
    """
    Smooth y using a diffusion-like step that conserves total sum.
    alpha controls smoothing amount (0 < alpha <= 0.5).
    """
    y = y.astype(float).copy()
    for _ in range(steps):
        y_new = y.copy()
        y_new[1:-1] = y[1:-1] + alpha * (y[:-2] - 2*y[1:-1] + y[2:])
        y = y_new
    return y

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

    # ivp args
    t_max = 20
    dt = 20 # s
    tspan = (0, t_max)
    # t_eval = np.linspace(0,t_max,7)

    # Initial arrays
    z_cur = np.linspace(0,lz,nz)
    cr_cur = np.ones_like(z_cur) * cr0
    cw_cur = np.ones_like(z_cur) * cw0
    y0 = np.concatenate((cr_cur, cw_cur))
    t_cur = 0

    # Wrap the function
    dz = z_cur[1] - z_cur[0]
    def rhs_wrapper(t, y):
        return rhs(y, dz)
    
    ts = [t_cur]
    cr = [cr_cur]
    cw = [cw_cur]
    zs = [z_cur]
    # Solve

    # Saving the sediment profile
    sed_r = []
    sed_w = []
    sed_z = []

    # Solve
    y_cur = y0
    while (t_cur < t_max):
        # Figure out how long to solve the solver for
        tspan = (t_cur, t_cur + dt)     
        sol = solve_ivp(rhs_wrapper, tspan, y_cur, 'RK45')
        y_last = sol.y[:,-1]

        # Smooth the results
        fsize = 1#3
        cr_sm = smooth(y_last[:nz], fsize); cw_sm = smooth(y_last[nz:], fsize)
        # cr_sm = diffusion_smooth(y_last[:nz]); cw_sm = diffusion_smooth(y_last[nz:])
        y_last = np.concatenate((cr_sm, cw_sm))

        # Save results to current time
        t_cur = sol.t[-1]
        ts.append(t_cur)
        cr.append(y_last[:nz])
        cw.append(y_last[nz:])
        zs.append(z_cur)

        # Iterate time and resize y, z
        y_cur, z_cur = resize(y_last, z_cur, -1)#0.005)
        # y_cur, z_cur = y_last, z_cur
        print(f"cur t: {t_cur:.2f} min z: {z_cur[0]:.1f}")



    # y = sol.y
    # print(y.shape)
    # tot_r = np.sum(y[:nz,:])
    print("Red cells:")
    for i, t in enumerate(ts):
        cri = cr[i]
        print(f"time {t:.3f} mass: {np.sum(cri) * (np.max(zs[i]) - np.min(zs[i])) / lz / 38.5:.1f}")
        # cr = cr / np.sum(cr) * tot_r
        xr = vel.vol_frac(cri, vel.d_r)
        plt.plot(zs[i], xr, label=f'red t={t:.1f}')

    plt.ylabel('concentration')
    # plt.ylim((0,1))
    plt.xlabel('height')
    plt.legend()
    plt.show()
    
    # tot_r = np.sum(y[nz:,:])
    print("White cells:")
    for i, t in enumerate(ts):
        cri = cr[i]
        cwi = cw[i]
        print(f"time {t:.3f} mass: {np.sum(cwi) * (np.max(zs[i]) - np.min(zs[i])) / lz / 38.5:.1f}")
        # cr = cr / np.sum(cr) * tot_r
        xr = vel.vol_frac(cri, vel.d_r)
        xw = vel.vol_frac(cwi, vel.d_w)
        plt.plot(zs[i], xw, label=f'white t={t:.1f}')

    plt.ylabel('concentration')
    plt.ylim((0,1))
    plt.xlabel('height')
    plt.legend()
    plt.show()

    plt.plot(zs[i], xr, 'r-', label=f'red final')
    plt.plot(zs[i], xw, 'k-', label=f'white final')
    plt.plot(zs[i], xr+xw, 'b-', label=f'combined concentrations final')
    plt.show()