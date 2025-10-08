# server.py
import asyncio
import json
import websockets
import matplotlib.pyplot as plt
import numpy as np
from collections import deque
import test

MAX_LEN = 1000
CALLS_PER_SEC = 60

# store recent data
window = deque(maxlen=MAX_LEN)
plt.ion()  # interactive mode on
fig, ax = plt.subplots(2,1)
legend = ax[0].legend(loc="upper left")
ax[0].set_title("Real-Time WebSocket Data")
ax[0].set_xlabel("Time (s)")
ax[0].set_ylabel("Value")
test.init(ax[1])

data_buffers = {}

async def handle_client(websocket):
    global legend, data_buffers
    print("Client connected")
    for key in data_buffers:
        data_buffers[key]["data"].clear()
        data_buffers[key]["times"].clear()
        data_buffers[key]["line"].remove()

    data_buffers = {}

    async for message in websocket:
        data = json.loads(message)

        # Run test module
        test.update(data, ax[1])

        # Get the timestamp
        timestamp = data["timestamp"] / 1000
        del data["timestamp"]
        
        # Update data
        for key in data:
            if key == "noplot": continue
            if not key in data_buffers:
                # Generate the line
                line, = ax[0].plot([], [], label=key)
                # Append object to buffer
                data_buffers[key] = { "line": line, "data": deque(maxlen=MAX_LEN), "times": deque(maxlen=MAX_LEN) }
            
            # Update the buffer
            data_buffers[key]["data"].append(data[key])
            data_buffers[key]["times"].append(timestamp)
            # Take the line
            line = data_buffers[key]["line"]
            ydata = list(data_buffers[key]["data"])
            xdata = list(data_buffers[key]["times"])
            line.set_data(xdata, ydata)

        # Update legend
        legend.remove()
        legend = ax[0].legend(
            [data_buffers[key]["line"] for key in data_buffers],
            [key for key in data_buffers],
            loc="upper left"
        )

        ax[0].relim()
        ax[0].autoscale_view()
        plt.draw()
        plt.pause(0.01)

async def main():
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Server running on ws://localhost:8765")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
