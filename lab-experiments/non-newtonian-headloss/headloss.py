import numpy as np
import matplotlib.pyplot as plt

V = np.linspace(0, 35, 141)  # flow rate (mL/s)
r = 0.635 / 2  # tube radius (cm)
d = 2 * r  # tube diameter (cm)

tubeArea = np.pi * r ** 2
v = V / tubeArea  # cm/s velocity

# Water properties

# Ketchup
rho = 1.1  # g/cm^3
n = 0.228  # flow behavior index
K = 19.34  # Pa·s^n
t0 = 0.0  # Pa

# Cornstarch
# rho = 1.2  # g/cm^3
# n = 1.72  # flow behavior index
# K = 0.13  # Pa·s^n
# t0 = 0.0  # Pa

Re = rho * v ** (2 - n) * d ** n / K / ((3 * n + 1) / 4 / n) ** n / 8 ** (n - 1) + 1e-10 # Reynolds number
Re_crit = 2200 * n ** -0.15 + 100 * n ** -2 # critical Reynolds number for transition to turbulence

laminar = Re < Re_crit

# Calculate laminar pressure drop per unit length
shearRate = (3 * n + 1) / 4 / n * (8 * v) / d # s^-1
shearStress = t0 + K * np.power(shearRate, n) # Pa
dPdL_lam = 4 * shearStress / d # Pa/cm
# Calculate turbulent pressure drop per unit length
num = 42 * n ** 1.4 * (n ** 1.4 + 2) + 0.33
den = n ** 1.4 + 0.211
a = num / den
b = (1 + 413.6 * n) ** -0.23
print(a, b)
f = (a * Re) ** -b # friction factor
Pdyn = 0.5 * rho * v ** 2 # dynamic pressure (Pa)
dPdL_tur = f * Pdyn / d # Pa/cm

dPdL = np.where(laminar, dPdL_lam, dPdL_tur)
dhdL = dPdL / (rho * 9810) * 100 # head loss per unit length (cm/cm)

plt.plot(V, dhdL)
plt.show()

L4 = 10 / 3 # characteristic length (cm)
L3 = L4 + 7.62
L2 = L3 + 7.62
L1 = L2 + 7.62

P1 = dPdL * L1 # pressure drop (Pa)
P2 = dPdL * L2
P3 = dPdL * L3
P4 = dPdL * L4