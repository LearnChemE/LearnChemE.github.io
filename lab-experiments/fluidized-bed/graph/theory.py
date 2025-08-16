import numpy as np
import matplotlib.pyplot as plt

hl_r = np.array([2.84e-5,-5.94e-3, 7.58, 7.31])
hr_r = np.array([2.41e-5,-3.99e-3, 2.86, 2.78])
hl_m = np.array([2.06e-5, 3.06e-3, 3.42, 4.27])
hr_m = np.array([1.45e-5, 6.93e-3,-1.60, 0.00])

def readMan(which, flow):
    [a, b, c, d] = which
    low_flow = flow < 142
    res = np.where(low_flow, flow * d / 142,
            a * flow**2 + b * flow + c)

    return res

if __name__ == '__main__':
    x = np.linspace(0, 1000, 1001)
    y = readMan(hl_m, x) - readMan(hr_m, x)

    plt.plot(x, y)
    plt.xlabel('flowrate (mL/min)')
    plt.ylabel('manometer height difference')
    plt.show()
