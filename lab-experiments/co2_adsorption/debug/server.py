from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import matplotlib.pyplot as plt
import threading

app = Flask(__name__)
CORS(app)

# Global data buffers
x_data = []
y_data = []
# Mutex lock for the x and y buffers
data_lock = threading.Lock()

# Setup matplotlib in interactive mode
plt.ion()
fig, ax = plt.subplots()
line, = ax.plot([], [], marker='o')
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
            # Update data
            line.set_xdata(x_data)
            line.set_ydata(y_data)
            if x_data and y_data:
                ax.relim() # Resize
                ax.autoscale_view()
        plt.pause(0.1) # Set a loose interval


# Flask uses decorators to give functionality to different endpoints and requests:
@app.route('/plot', methods=['POST'])
def append_data():
    try:
        # This is the data sent in the POST request from the client
        data = request.get_json()

        # Retrieve data
        x = data.get('x')
        y = data.get('y')

        # Validate
        if x is None or y is None:
            return jsonify({"error":"Missing 'x' or 'y' data"}), 400
        
        # Important: Acquire the mutex before updating
        with data_lock:
            x_data.extend(x)
            y_data.extend(y)

        return jsonify({"status":"success", "message":"Data plotted"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/reset', methods=['POST'])
def reset_data():
    with data_lock:
        x_data.clear()
        y_data.clear()
    return jsonify({"message": "Data reset successfully"})
    
# Normally you could do this in the main thread but since matplotlib blocks the main thread we will start it in a separate thread
def start_flask():
    app.run(debug=False, use_reloader=False)
        
if __name__ == "__main__":
    # Launch a separate thread to launch the flask server
    threading.Thread(target=start_flask, daemon=True).start()

    # Run the plot update loop continuously. This will block the main thread
    update_plot()