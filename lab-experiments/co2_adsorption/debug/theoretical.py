import numpy as np
import matplotlib.pyplot as plt

N = 40001
TIME_RANGE = 200 # s
T0 = 298 # K
BETA = 4 # K / s
Y0 = 0.1
TH0 = 1
P = 5 # bar
MAX_CAPAC = 100

KA0 = 25
EA = 1000
KD0 = 10**4
ED = 4209

def ka(T):
    return KA0 * np.exp(-EA/T)

def kd(T):
    return KD0 * np.exp(-ED/T)

def adsorb(p_co2, th, T, dt):
    # Calculate rate constants
    k_a = ka(T)
    k_d = kd(T)
    # Calculate amounts adsorbed and desorbed
    r_ads = k_a * p_co2 * (1 - th)
    r_des = k_d * th
    # Difference is rate of change...
    roc = r_des - r_ads
    # Calculate changes
    dpdt = roc
    dthdt = -roc / MAX_CAPAC
    # Lastly, calculate new stuffs
    p_co2 = p_co2 + dpdt * dt
    th = th + dthdt * dt
    return p_co2, th

if __name__ == "__main__":
    # Variables
    time_arr = np.linspace(0, TIME_RANGE, N)
    y  = np.zeros(N); y[0]  = Y0
    th = np.zeros(N); th[0] = TH0

    dt = TIME_RANGE / (N - 1)

    for i, t in enumerate(time_arr):
        if (i == 0): 
            continue
        # Calculate temperature by linear ramping
        T = T0 + t * BETA
        # Antoine's
        p = Y0 * P

        p, th[i] = adsorb(p, th[i-1], T, dt)
        y[i] = p / P

    fig, ax = plt.subplots()
    ax2 = ax.twinx()

    ax.plot(time_arr, y, 'k-')
    ax.set_ylabel('y CO2 out')
    ax2.plot(time_arr, th, 'r-')
    ax2.set_ylabel('theta')
    plt.show()
