import numpy as np
from numpy import exp
import matplotlib.pyplot as plt
from scipy.optimize import fsolve
from collections import deque

MAX_LEN = 1000
CALLS_PER_SEC = 60

residuals = deque(maxlen=MAX_LEN)
times = deque(maxlen=MAX_LEN)

import math

def crossflow_F_one_mixed(T_hi, T_ho, T_ci, T_co, mixed="cold"):
    """
    Estimate the correction factor F for a cross-flow heat exchanger
    where one fluid is mixed and the other is unmixed.

    Parameters:
        T_hi : float - hot fluid inlet temperature
        T_ho : float - hot fluid outlet temperature
        T_ci : float - cold fluid inlet temperature
        T_co : float - cold fluid outlet temperature

    Returns:
        F : float - correction factor (0 < F ≤ 1)
    """
    # Temperature differences
    dTh = T_hi - T_ho
    dTc = T_co - T_ci
    if (dTh == 0 or dTc == 0): return 1.0
    if abs(dTh) < 1e-9 or abs(T_hi - T_ci) < 1e-9:
        return 1.0

    # Define parameters
    R = dTh / dTc
    P = (T_co - T_ci) / (T_hi - T_ci)
    
    if P <= 0 or P >= 1 or R <= 0:
        return 1.0

    try:
        F = (1 - math.exp(-R * (1 - P))) / (R * (1 - math.exp(-R)))
    except (ValueError, ZeroDivisionError, OverflowError):
        print("error in computing F correction")
        F = 1.0

    return max(0.0, min(F, 1.0))


line = None
def init(ax):
    global line
    ax.set_title("test results")
    ax.set_xlabel("time (S)")
    ax.set_ylabel("UA value (W/K)")
    # ax.set_ylim([0,30])
    line, = ax.plot([],[])

def update(data, ax):
    """
    Exported testing function for server
    """
    # Get temps
    ts = data["timestamp"]
    thi = data["Thi"]
    tho = data["Tho"]
    tci = data["Tci"]
    tco = data["Tco"]
    # Get capacity rates
    ca = data["noplot"]["Ca"]
    cl = data["noplot"]["Cl"]

    # Calc Heat Rate
    # q = cl * (thi - tho)
    q = ca * (tco - tci)
    # residuals.append(ql - qa)
    # times.append(ts)

    # Calc LMTD
    dt1 = thi - tco
    dt2 = tho - tci
    if (dt1 == 0 or dt2 == 0): return

    # F correction method
    # lmtd = (dt1 - dt2) / np.log(dt1 / dt2)
    # f = crossflow_F_one_mixed(thi, tho, tci, tco)

    # NTU Method
    cmin = min(cl,ca)
    cmax = max(cl,ca)
    cr = cmin/cmax
    qmax = cmin * (thi - tci)
    if (qmax == 0): return
    ep = q / qmax
    # cross-flow, both sides unmixed: ep = 1 - exp((exp(-cr * NTU ** .78) - 1) / cr * NTU ** -.22)
    def fn(ntu):
        return 1 - exp((exp(-cr * ntu ** .78) - 1) / (cr * ntu ** -.22)) - ep
    ntu = fsolve(fn, .5)

    # Calc UA
    ua = ntu * cmin
    # ua = q / lmtd #/ f
    residuals.append(ua)
    times.append(ts)

    # Update the line's data
    ydata = list(residuals)
    xdata = list(times)
    line.set_data(xdata, ydata)
    ax.relim()
    ax.autoscale_view()

    