import numpy as np
import matplotlib.pyplot as plt

def Cp(T, x):
    """
    Calculate sugar water solution's heat capacity (J/kg) based on temperature (K) and mole fraction.
    https://onlinelibrary.wiley.com/doi/pdf/10.1002/9781444320527.app1
    @param T temperature (K)
    @param x mole fraction sugar
    """
    # Equation for heat capacity of sugar solution
    Tc = T - 273.15
    cp = 1 - ( 0.6 - 0.0018 * Tc ) * x # heat capacity (kcal/kg)
    cp *= 4.1868 # heat capacity (kJ/kg)
    cp *= 1000 # heat capacity (J/kg)
    return cp

N = 100
y = np.linspace(0,1,N)#.2
T_range = [25, 120]
T = 100#np.linspace(T_range[0], T_range[1], N)
Tk = T + 273
cp = Cp(Tk, y)
plt.plot(y, cp)
plt.show()