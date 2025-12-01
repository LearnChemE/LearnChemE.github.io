import numpy as np
import matplotlib.pyplot as plt

def antoines(T):
    """
    Calculate saturated temperature from pressure
    @param T Temperature (K)
    @returns Saturated Pressure (bar absolute)
    """
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
    """
    Calculate saturated temperature from pressure
    @param P Saturated Pressure (bar absolute)
    @returns Temperature (K)
    """
    logP = np.log10(P)
    mask = (P > 2.35)
    A = np.where(mask, 3.55959, 4.6543)
    B = np.where(mask, 643.748, 1435.264)
    C = np.where(mask, -198.043, -64.848)

    return B / (A - logP) - C

MW_SUCROSE = 342.2965
MW_WATER = 18

# Calculate the mole fraction of sucrose in a sucrose-water solution given weight fraction sucrose
def mole_frac(xw):
    ns = xw / MW_SUCROSE
    nw = (1 - xw) / MW_WATER
    return ns / (ns + nw)

# Calculate the mass fraction of sucrose in a sucrose-water solution given mole fraction sucrose
def mass_frac(ys):
    ms = ys * MW_SUCROSE
    mw = (1 - ys) * MW_WATER
    return ms / (ms + mw)

if __name__ == "__main__":

    N = 100 # number of points for plotting
    P = 1 # bar pressure
    xw = np.linspace(0, 0.99, N) # mass fraction sucrose
    xn = mole_frac(xw) # mole fraction sucrose

    # From the fugacity equation:
    # xi * fi(*) = yi * P * phi
    # xi * gamma_i * Pvap_i = yi * P
    # Assume activity coefficient is 1 (ideal solution) and fugacity coefficient is 1 (ideal gas above solution)
    yiP = P # gas phase fugacity of water
    Pvap = yiP / (1 - xn) # corresponding pure water vapor pressure
    Tb = inv_antoines(Pvap) - 273.15 # boiling temperatures

    # Solve for the mass fraction when boiling temperature Tb=101.4:
    Pvap = antoines(101.4 + 273.15)
    yb = 1 - P / Pvap
    xb = mass_frac(yb)
    print(f"Mass percent sucrose at 101.4 C: {xb*100:.1f}%")

    # Plot
    plt.plot(xw, Tb, 'k-', label='ideal')
    plt.title('boiling point for sucrose-water mixture (ideal solution)')
    plt.xlabel("weight fraction sucrose")
    plt.ylabel("boiling point (°C)")
    plt.show()