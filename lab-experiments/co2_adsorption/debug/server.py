from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import numpy as np
import matplotlib.pyplot as plt
import threading

app = Flask(__name__)
CORS(app)

# Setup matplotlib in interactive mode
plt.ion()
fig, ax = plt.subplots()

num_axes = 0
def create_axis():
    global num_axes
    new_ax = ax.twinx()
    new_ax.spines['right'].set_position(('outward', 60 * num_axes))  # Offset rightward
    num_axes += 1
    return new_ax

class LineData:
    x: list
    y: list
    line: plt.Line2D
    ax: plt.Axes

    def __init__(self, x, y, line):
        self.x=x
        self.y=y
        self.line=line
        self.ax=None

class LineList:
    def __init__(self):
        self.data = {}
    
    def update(self, label, x_data, y_data):
        if label in self.data:
            self.data[label].x.extend(x_data)
            self.data[label].y.extend(y_data)
        
        else:
            line = None
            self.data[label] = LineData(x_data, y_data, line)
    
    def getList(self):
        return self.data

# Global data buffers
line_list = LineList()
# Mutex lock for the x and y buffers
data_lock = threading.Lock()

# Feel free to change these. You could also accept names in a separate POST request if you want to experiment
ax.set_title("Live data")
ax.set_xlabel("x axis")
ax.set_ylabel("y axis")

def update_plot():
    """
    Update the plot in a loop. 
    We will run this in a thread and make sure it uses the data only with it has the mutex to ensure behaviour is thread safe.
    """
    while True:
        # Aquire mutex
        with data_lock:
            list = line_list.getList()
            lines = []
            labels = []
            i = 0
            for label, line_item in list.items():
                # Generate a new axis if necessary
                if line_item.ax is None:
                    line_item.ax = create_axis()
                item_ax = line_item.ax

                # Initialize the line if this is a new item
                if (line_item.line is None):
                    newline, = item_ax.plot([], [], marker='', color=np.random.rand(3))
                    line_item.line = newline


                # Update data
                line_item.line.set_xdata(line_item.x)
                line_item.line.set_ydata(line_item.y)
                # Rescale
                item_ax.relim() # Resize
                item_ax.autoscale_view()
                # Collect for legend
                lines.append(line_item.line)
                labels.append(label)
            
            ax.legend(lines, labels)
            

        plt.pause(0.1) # Set a loose interval


# Flask uses decorators to give functionality to different endpoints and requests:
@app.route('/plot', methods=['POST'])
def append_data():
    # try:
        # This is the data sent in the POST request from the client
        data = request.get_json()

        # Retrieve data
        label = data.get('label')
        x = data.get('x')
        y = data.get('y')

        if label is None:
            label = ''

        # Validate
        if x is None or y is None:
            return jsonify({"error":"Missing 'x' or 'y' data"}), 400
        
        # Important: Acquire the mutex before updating
        with data_lock:
            line_list.update(label, x, y)
        return jsonify({"status":"success", "message":"Data plotted"})
    
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

@app.route('/reset', methods=['POST'])
def reset_data():
    with data_lock:
        lines = line_list.getList()
        for label, line_item in lines.items():
                # Initialize the line if this is a new item
                if (line_item.line is None):
                    continue

                # Update data
                line_item.line.set_xdata([])
                line_item.line.set_ydata([])
                line_item.x = []
                line_item.y = []

    return jsonify({"message": "Data reset successfully"})
    
# Normally you could do this in the main thread but since matplotlib blocks the main thread we will start it in a separate thread
def start_flask():
    app.run(debug=False, use_reloader=False)
        
if __name__ == "__main__":
    # Launch a separate thread to launch the flask server
    threading.Thread(target=start_flask, daemon=True).start()

    # Run the plot update loop continuously. This will block the main thread
    update_plot()