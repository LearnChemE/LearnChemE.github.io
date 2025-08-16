import numpy as np
import matplotlib.pyplot as plt

hl_r = np.array([2.84e-5,-5.94e-3, 7.58, 7.31])
hr_r = np.array([2.41e-5,-3.99e-3, 2.86, 2.78])
hl_m = np.array([2.06e-5, 3.06e-3, 3.42, 4.27])
hr_m = np.array([1.45e-5, 6.93e-3,-1.60, 0.00])

def readCSV(filename, label):
    data = np.loadtxt(filename, delimiter=',')

    x = data[0,:]
    y = data[1,:]

    return { "label": label, "x": x, "y": y  }

def readMan(which, flow):
    [a, b, c, d] = which
    low_flow = flow < 142
    res = np.where(low_flow, flow * d / 142,
            a * flow**2 + b * flow + c)

    return res

def generate_from_polyfit(left, right, label):
    flow = np.arange(0, 701, 50)
    l_reading = readMan(left, flow)
    r_reading = readMan(right, flow)

    return { "label": label, "x": flow, "y": l_reading - r_reading }

def plotAll(ax, data):
    ax.set_title("Flowrate vs pressure drop for all plots")
    ax.set_xlabel("Flowrate (mL/min)")
    ax.set_ylabel("Pressure Drop (cm water)")

    for set in data:
        ax.plot(set["x"], set["y"], label=set["label"], marker='.')
    
    ax.legend()

def plotRes(ax, base, reg):
    x = base["x"]
    y = reg["y"] - base["y"]
    title = "Residuals for " + reg["label"] + " vs " + base["label"]
    ax.set_xlabel("Flowrate (mL/min)")
    ax.set_ylabel("Pressure Drop (cm water)")
    ax.set_title(title)

    ax.axhline(0, color='r')

    # Calculate r squared
    sst = np.sum(np.square(base["y"]))
    ssr = np.sum(np.square(y))
    r2 = 1 - ssr / sst

    text = f"r squared = {r2:.5f}"
    ax.plot(x, y, 'ko')
    ax.annotate(text, xy=(450, 100), xycoords='axes points',
            size=14, ha='right', va='top',
            bbox=dict(boxstyle='round', fc='w'))



if __name__ == '__main__':
    # Use real data for reference
    real_data = readCSV('zeynep-data-4a.csv', 'Zeynep Data')
    sim_data = readCSV('sim_pdrop_2025-08-16.csv', 'Simulation Calculated Data')

    # Generate data from polynomial regressions
    recycle_fit = generate_from_polyfit(hl_r, hr_r, "Recycle Mode Polyfit")
    measure_fit = generate_from_polyfit(hl_m, hr_m, "Measure Mode Polyfit")
    
    # Create subplots
    fig, ax = plt.subplots(2, 2)
    
    plotAll(ax[0,0], [ real_data, sim_data, recycle_fit, measure_fit ])
    plotRes(ax[0,1], real_data, sim_data)
    plotRes(ax[1,0], real_data, recycle_fit)
    plotRes(ax[1,1], real_data, measure_fit)
    plt.show()
