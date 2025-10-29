import numpy as np
import matplotlib.pyplot as plt

RHO = .998

def calcInnerHVal(flowrate):
    """
    Calculate the inner tube h value based on flowrate
    @param flowrate water flowrate in hex (g / s)
    @returns h_i (W / m2 / K)
    """
    Pr = 5.05 # Prandtl number
    asp = 3.105e-3 / .11054 # Tube aspect ratio
    u = flowrate / RHO / 23 / 6 # Fluid velocity, m / s
    Re = u * 4085.5 # Reynolds number
    print(u)

    # Calculate Nusselt number
    Nu = 0.36 * (Re ** .8) * (Pr ** (1/3)) * (asp ** .055)
    return Nu * 189.592 # W / m2 / K


def calcUA(flowrate):
    inv_hi = 1 / calcInnerHVal(flowrate)
    Ui = 1 / (4.8372e-4 + inv_hi); # U based on inner area (m2 K / W)
    return Ui * 3.017e-3 * 6 # W / K

N = 101
flow = np.linspace(0, 37.5, N)
ua = calcUA(flow)
plt.plot(flow, ua)
plt.show()