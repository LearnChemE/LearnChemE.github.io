import numpy as np
import sedimentationFrame as calcs
import settlingVel as vel
import matplotlib.pyplot as plt

# Spatial information
nz = 500 # Spatial info
lz = 305 # mm

# Initial conditions
xw0 = 0.05
xr0 = 0.05
cr0 = vel.concentration(xr0, vel.d_r)
cw0 = vel.concentration(xw0, vel.d_w)

if __name__ == "__main__":
    z_cur = np.linspace(0,lz,nz)
    def init_cr(i, _):
        return (.5 + .5 * np.sin(i * np.pi / 90)) * cr0
    def init_cw(i, _):
        return (.5 + .5 * np.cos(i * np.pi / 90)) * cw0
    cr_cur = np.fromfunction(init_cr, (nz, 1))[:,0]
    cw_cur = np.fromfunction(init_cw, (nz, 1))[:,0]
    # print(cr_cur, cw_cur)
    y0 = np.concatenate((cr_cur, cw_cur))
    y1 = calcs.rhs(y0, z_cur[1] - z_cur[0])
    cr1 = y1[:nz]
    cw1 = y1[nz:]
    np.savetxt('pySinRhs.csv', y1, delimiter=',')

    plt.plot(z_cur, cr1,'r-')
    plt.plot(z_cur, cw1,'k-')
    plt.show()