import builtins

builtins.MODE = "desorption"

import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

# Base model
from co2 import *

def createActual(tmax, beta):
    y0 = 1
    
    def rhs_actual(t, y):
        T = 298 + beta * t * 60
        kd = k_val(kd0, ed, T)
        dydt = - kd * y * VOL_BED / CAPACITY
        return dydt
    
    sol = solve_ivp(rhs_actual, [0, tmax], [y0], 'BDF', t_eval=np.linspace(0, tmax, 301))
    t = sol.t
    T = 298 + beta * t * 60
    kd = k_val(kd0, ed, T)
    rd = kd * sol.y[0]
    n = rd * VOL_BED

    tot = np.trapezoid(n, t)
    print("Ideal total moles adsorbed =", tot)

    return t, n

if __name__ == "__main__":
    P_l = 2 # bar
    y_l = 0.0 # mol fraction of CO2 in feed
    y0 = np.zeros(NE)
    for i in range(N):
        y0[i * E] = 0
        y0[i * E + 1] = P_l
        y0[i * E + 2] = 1

    beta = [.3, 3]

    sccms = [200, 2000]
    tf = 15

    for sccm in sccms:

        ln_peak = []
        inv_T_peak = []

        for b in beta:

            def rhs_wrapped(t, y):
                T = 298 + b * t * 60
                ka = k_val(ka0, ea, T)
                kd = k_val(kd0, ed, T)

                Q = sccm * (1 / P_l) * T / 273.15
                u = Q / AREA_BED # cm / min

                return rhs(t, y, y_l, P_l, u, ka, kd, 298) # for some reason the actual T makes this one too high?

            tstep = 1/60
            ts = np.arange(0, tf, tstep)
            y = []
            y_init = y0

            for t in ts:
                sol = solve_ivp(rhs_wrapped, [t, t + tstep], y_init, 'BDF')
                y.append(sol.y[BED_END_IDX * E, -1])
                y_init = sol.y[:,-1]

            # t = sol.t
            t = ts
            T = 298 + t * b * 60
            Q = sccm * (1 / P_l) * (T / 273.15)
            # y = sol.y[BED_END_IDX * E, :] * Q / R / 298
            y = np.array(y) * Q / R / 298
            tot = np.trapezoid(y, t)
            y = smooth(y, window_size=3) # smooth out numerical noise

            # Show plot integrated to breakthrough
            plt.plot(t, y, label=rf'{sccm:.0f} SCCM $\beta$={b:.1f}')
            print("For SCCM =", sccm, "and beta =", b, "total moles adsorbed =", tot)

            # Find peak and time to peak
            peak = np.max(y)
            time_to_peak = t[np.argmax(y)]
            temp_at_peak = 298 + b * time_to_peak * 60

            # ln_peak.append(np.log(peak))
            ln_peak.append(np.log(b / temp_at_peak**2))
            inv_T_peak.append(1 / temp_at_peak)

        dlnp = ln_peak[1] - ln_peak[0]
        dinvT = inv_T_peak[1] - inv_T_peak[0]
        slope = dlnp / dinvT
        Ea = -slope
        print(f"SCCM: {sccm:.0f}, Ea: {Ea:.2f} K")

    ln_peak = []
    inv_T_peak = []

    for b in beta:
        t_actual, y_actual = createActual(tf, b)
        plt.plot(t_actual, y_actual, label=rf'ideal, $\beta$={b:.1f}')

        # Find peak and time to peak
        time_to_peak = t_actual[np.argmax(y_actual)]
        temp_at_peak = 298 + b * time_to_peak * 60

        ln_peak.append(np.log(b / temp_at_peak**2))
        inv_T_peak.append(1 / temp_at_peak)

    dlnp = ln_peak[1] - ln_peak[0]
    dinvT = inv_T_peak[1] - inv_T_peak[0]

    slope = dlnp / dinvT
    Ea = -slope
    print(f"Ideal, Ea: {Ea:.2f} K")


    plt.xlabel('time (min)')
    plt.ylabel(r'outlet $CO_2$ flowrate (mol/min)')
    plt.legend()
    plt.show()
