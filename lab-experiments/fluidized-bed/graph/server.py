from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib.pyplot as plt
import threading
import queue

# Initialize flask
app = Flask(__name__)
CORS(app)

# Mutex lock for shared data
data_lock = threading.Lock()
plot_title = 'Data from Fluidized Bed Simulation'
plot_xlabel = ''
plot_ylabel = ''
x_data = []
y_data = []
# data_was_updated = False
# save_fig = False
fig_name = ''
main_queue = queue.Queue()


def update_plot(ax, line):
    print("Updating plot")
    with data_lock:
        ax.set_title(plot_title)
        ax.set_xlabel(plot_xlabel)
        ax.set_ylabel(plot_ylabel)
        line.set_xdata(x_data)
        line.set_ydata(y_data)
    # Resize
    ax.relim()
    ax.autoscale_view()

def save_plot(ax, line):
    print(f"saving figure {fig_name}")
    plt.savefig(fig_name)

def reset_plot(ax, line):
    print("Resetting")
    with data_lock:
        x_data.clear()
        y_data.clear()
        line.set_xdata(x_data)
        line.set_ydata(y_data)


@app.route('/data', methods=['POST'])
def handle_data():
    global plot_title, plot_xlabel, plot_ylabel, data_was_updated
    global x_data, y_data
    # Get data in json
    content = request.get_json()
    print(f"Received data: {content}")
    
    # Get string variables
    xlabel = content.get('xlabel')
    ylabel = content.get('ylabel')
    title = content.get('title')

    # Get data point
    x = content.get('lift', [])
    y = content.get('deltaP', [])

    # Sanity checks
    if (x is None or y is None):
        print("Error: incomplete data")
        return jsonify({"status":"error", "message":"data for x and y must both be provided"})
    if (len(x) != len(y)):
        print("Error: bad sizes")
        return jsonify({"status":"error", "message":"x and y sizes must be equal"})
    
    # Critical section
    with (data_lock):
        # Set if these are not None
        if (xlabel is not None):
            plot_xlabel = xlabel
        if (ylabel is not None):
            plot_ylabel = ylabel
        if (title is not None):
            plot_title = title
        
        # Extend these
        x_data.extend(x)
        y_data.extend(y)

    main_queue.put(update_plot)
    return jsonify({"status":"success", "message":"Data plotted"})

@app.route('/reset', methods=['DELETE'])
def reset_data():
    main_queue.put(reset_plot)
    print("Reset request made")
    return jsonify({"message": "Data reset successfully"})

@app.route('/save', methods=['POST'])
def request_save():
    global save_fig, fig_name
    # Get data in json
    content = request.get_json()
    filename = content.get('filename', [])
    print(f"Received save request: {filename}")
    # Add request for figure
    with data_lock:
        fig_name = filename

    main_queue.put(save_plot)
    return jsonify({"message": "Data save queued"})

def live_plot():
    # Plot setup
    plt.ion()
    fig, ax = plt.subplots()
    line, = ax.plot([], [], marker='o')
    plt.grid(True)
    plt.show()

    # Update loop
    while(True):
        try:
            func = main_queue.get(timeout=.1)
            print("calling func")
            func(ax, line)
            main_queue.task_done()

        except queue.Empty:
            pass

        plt.pause(0.1) # Set a loose interval

def start_flask():
    app.run(debug=False, use_reloader=False)

if __name__ == '__main__':
    # Start the server in a separate thread
    threading.Thread(target=start_flask, daemon=True).start()
    # Run an update task in this thread
    live_plot()