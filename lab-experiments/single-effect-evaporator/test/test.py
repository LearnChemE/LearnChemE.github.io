import asyncio
import numpy as np
import math
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from collections import deque
from receiver import WebSocketReceiver, ReceiverWarn
from typing import Dict, Callable, Any
from datetime import datetime, timezone

class GeneralReceiver(WebSocketReceiver):
    """
    GeneralReceiver(channels: Dict[str, Callable[..., Any]], maxlen: int = 1000)

    A simple WebSocketReceiver-based dispatcher that maps named channels to user-provided
    callback functions.

    Parameters
    ----------
    channels : Dict[str, Callable[..., Any]]
        Mapping from channel name (str) to a callable that will be invoked when data
        for that channel is received. Each callable is called with two positional
        arguments: (data, timestamp).
    maxlen : int, optional
        Maximum length for internal deques used to hold data and timestamps. Defaults
        to 1000. (Note: the implementation allocates these deques but does not
        automatically populate them in on_data; callbacks may choose to append to
        them if storage is desired.)

    Attributes
    ----------
    data : collections.deque
        Deque reserved for storing received data (max length = maxlen).
    timestamps : collections.deque
        Deque reserved for storing timestamps corresponding to received data.
    ch_calls : Dict[str, Callable[..., Any]]
        The mapping of channel names to callback callables supplied by the user.

    Behavior
    --------
    This class subclasses WebSocketReceiver and overrides the asynchronous method
    on_data(channel, data, timestamp). When on_data is called:
    - If the channel is present in ch_calls, the associated callback is invoked as:
      Callbacks are invoked directly (they are not awaited), so they should be plain
      synchronous callables or handle coroutine results themselves if asynchronous.
    - If the channel is not present in ch_calls, a ReceiverWarn is issued indicating
      the unknown channel.

    Notes
    -----
    - The constructor registers the list of known channel names with the parent
      WebSocketReceiver via super().__init__(channels=list(channels.keys())).
    - If you want received messages to be stored automatically, provide callbacks
      that append to self.data and self.timestamps or modify the on_data override.
    - Callbacks execute in the same async context as on_data; ensure they are safe
      to run there (avoid long blocking operations or offload to a worker thread).

    Example
    -------
    # channels = {"temp": handle_temp, "pressure": handle_pressure}
    # receiver = GeneralReceiver(channels)
    # where handle_temp(data, timestamp) is a callable that processes incoming data.
    """
    def __init__(self, channels: Dict[str, Callable[..., Any]], maxlen=1000):
        super().__init__(channels=list(channels.keys()))
        self.data = deque(maxlen=maxlen)
        self.timestamps = deque(maxlen=maxlen)
        self.ch_calls = channels

    async def on_data(self, channel, data, timestamp):
        if channel in self.ch_calls:
            callback = self.ch_calls[channel]
            callback(data, timestamp)
        else:
            ReceiverWarn(f"Channel {channel} not in receiver list")

# Types for descriptor logic
ChannelName = str
LineInfo = Dict[str, Any]
PlotDescriptor = Dict[str, LineInfo]
PlottingReceiverDescriptor = Dict[ChannelName, PlotDescriptor]

def createPlot(ax: plt.Axes, info: PlotDescriptor, maxlen=1000):
    """
    Create a plot using a PlotDescriptor and the correct axis
    
    Parameters
    ----------
    ax : plt Axes object that plot will use
    info : PlotDescriptor Object

    Returns
    ----------
    Plot object
    """
    ax.set_xlabel("time")
    utc_formatter = mdates.DateFormatter('%H:%M:%S', tz=timezone.utc)
    # Apply the formatter to the x-axis
    ax.xaxis.set_major_formatter(utc_formatter)
    ax.set_ylabel("value")
    plot: Dict[str, Any] = { "ax" : ax, "times" : deque(maxlen=maxlen) }
    for linename, lineinfo in info.items():
        # Options
        line_style = lineinfo["style"] if "style" in lineinfo.keys() else ""
        # Generate line
        line, = ax.plot([],[], line_style, label=linename)
        plot[linename] = { "line" : line, "data" : deque(maxlen=maxlen) }
    
    ax.legend()
        
    return plot

def updatePlot(plot: Dict[str, Any], data: Dict[str, float], timestamp: float):
    """
    Update a plot using new data from server
    
    Parameters
    ----------
    plot : plt Axes object that plot will use
    info : PlotDescriptor Object

    Returns
    ----------
    Plot object
    """
    ax = plot["ax"]
    times: deque = plot["times"]
    t = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    times.append(t)

    for name, value in data.items():
        if name in plot.keys():
            # Update
            ys = plot[name]["data"]
            line = plot[name]["line"]
            ys.append(value)
            line.set_xdata(times)
            line.set_ydata(ys)

        else:
            ReceiverWarn(f"{name} not found in plot lines")
        
    ax.relim()
    ax.autoscale_view()



class PlottingReceiver(WebSocketReceiver):
    """
    """
    def __init__(self, plots_descriptor: PlottingReceiverDescriptor, maxlen=1000):
        # Init super
        channel_names = list(plots_descriptor.keys())
        super().__init__(channels=channel_names)

        # Init plots
        num_channels = len(channel_names)
        nrows = min(num_channels, 3)
        ncols = math.ceil(num_channels / 3)
        fig, axes = plt.subplots(nrows, ncols)
        fig.autofmt_xdate()
        axes_flat = axes.flatten() if num_channels > 1 else np.array([axes])
        
        i = 0
        plots = {}
        for channel, info in plots_descriptor.items():
            ax = axes_flat[i]
            ax.set_title(channel)
            plots[channel] = createPlot(ax, info)
            i += 1

        self.plots = plots
        plt.ion()

    async def on_data(self, channel, data, timestamp):
        try:
            updatePlot(self.plots[channel], data, timestamp)
        except:
            ReceiverWarn(f"Channel {channel} not in receiver list")
        
        if (channel == "composition"):
            plt.draw()
            plt.pause(0.001)


if __name__ == "__main__":
    # List channels here with plotting information
    channels: PlottingReceiverDescriptor = {
        "temperature": {
            "thi": { "style" : "r-" },
            "tci": { "style" : "b-" },
            "tco": { "style" : "c-" }
        },
        "flowrates": {
            "steam" : { "style" : "r-" },
            "feed"  : { "style" : "g-" },
            "evap"  : { "style" : "c-" },
            "conc"  : { "style" : "b-" },
        },
        "composition": {
            "feed" : { "style" : "r-" },
            "conc" : { "style" : "b-" }
        }
    }
    
    receiver = PlottingReceiver(channels)
    asyncio.run(receiver.run())