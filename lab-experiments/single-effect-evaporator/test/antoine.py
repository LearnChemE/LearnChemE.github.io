import numpy as np
import matplotlib.pyplot as plt

def antoines(T):
    if (T < 399.94):
        A = 4.6543
        B = 1435.264
        C = -64.848
        return 10 ** (A - B / (T + C))
    else:
        A = 3.55959
        B = 643.748
        C = -198.043
        return 10 ** (A - B / (T + C))
    
def inv_antoines(P):
    logP = np.log10(P)
    if (P > 2.35):
        A = 3.55959
        B = 643.748
        C = -198.043
    else:
        A = 4.6543
        B = 1435.264
        C = -64.848
        
    return B / (A - logP) - C

Ts = np.linspace(100, 400, 301)
Tk = Ts + 273
T_res = []

for T in Tk:
    P = antoines(T)
    T_res.append(inv_antoines(P) - T)

print(antoines(399.94))
plt.plot(Ts, T_res, 'k-')

plt.show()