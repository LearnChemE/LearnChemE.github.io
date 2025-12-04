import numpy as np
import matplotlib.pyplot as plt

def k(T):
    Ea =  33.40e3  # J/mol
    R = 8.314     # J/(mol*K)
    A = 5.8e5     # Pre-exponential factor (L / mol / s)
    return A * np.exp(-Ea / (R * T))

if __name__ == "__main__":
    # Plot 1: K vals
    T_values = np.linspace(25, 85, 100)  # Temperature range from 300K to 800K
    Tk_vals = T_values + 273.15
    k_values = k(Tk_vals)

    # Plot 2: Conversion
    Tk = 55 + 273.15
    max_flow = 60 * 2 / 1000 # L / s
    vol = 2 # L
    flow = np.linspace(0.01, 1, 100) * max_flow
    Ca0 = .15; Cb0 = .15
    residence_times = vol / flow # spacetime, s
    ka = k(Tk)

    xas = []
    for tau in residence_times:
        a = tau * ka * Ca0
        poly = [ a, -(1 + 2 * a), a ]
        sol = np.roots(poly)
        # print(sol)
        sol = sol[0] if sol[0] > 0 and sol[0] < 1 else sol[1]
        xas.append(sol)

    xa = np.array(xas)

    # Plot 3: Concentrations
    Ca = Ca0 * (1 - xa)
    Cc = Ca0 * xa

    # Plot
    fig, axes = plt.subplots(3, 1, figsize=(10, 10))

    axes[0].plot(T_values, k_values)
    axes[0].set_xlabel('Temperature (K)')
    axes[0].set_ylabel('Rate Constant k (L / mol / s)')
    axes[0].set_title('Arrhenius Equation: Rate Constant vs Temperature')

    axes[1].plot(residence_times, xa)
    axes[1].set_xlabel('Residence time (s)')
    axes[1].set_ylabel('Conversion NaOH')
    axes[1].set_title('Conversion NaOH for varying residence times at 55 C')

    axes[2].plot(flow / max_flow * 100, Ca, 'r-', label=r'$NaOH, CH_3COOCH_3$')
    axes[2].plot(flow / max_flow * 100, Cc, 'b-', label=r'$CH_3OH, CH_3COOCH_3$')
    axes[2].set_xlabel('Valve Open %')
    axes[2].set_ylabel('Concentration (M)')
    axes[2].set_title('Concentrations for varying valve settings at 55 C')
    axes[2].legend()
    plt.show()