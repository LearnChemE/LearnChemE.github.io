import asyncio
from websockets import client, exceptions
import json
import matplotlib.pyplot as plt
from collections import deque
from typing import List, Dict, Any, Optional

class WebSocketReceiver:
    """
    Base class for subscribing to data channels via WebSocket.
    Subclass this and override `on_message` or `on_data` to implement custom behavior.
    """

    def __init__(self, uri: str = "ws://localhost:8765", channels: Optional[List[str]] = None):
        self.uri = uri
        self.channels = channels or []
        self.websocket = None
        self.running = False

    async def connect(self):
        """Connect to the WebSocket server and send initial subscription info."""
        self.websocket = await client.connect(self.uri)
        await self.websocket.send(json.dumps({
            "role": "receiver",
            "channels": self.channels
        }))
        self.running = True
        print(f"[Receiver] Connected to {self.uri} (channels: {self.channels})")

    async def listen(self):
        """Main receive loop."""
        while not self.websocket:
            await self.connect()

        try:
            async for msg in self.websocket:
                try:
                    packet = json.loads(msg)
                    await self.on_message(packet)
                except json.JSONDecodeError:
                    print("[Receiver] Warning: invalid JSON message.")
        except exceptions.ConnectionClosed:
            print("[Receiver] Connection closed.")
        finally:
            self.running = False

    async def on_message(self, message: Dict[str, Any]):
        """Default handler for raw incoming message."""
        channel = message.get("channel")
        data = message.get("data")
        if channel is None or data is None:
            return
        await self.on_data(channel, data)

    async def on_data(self, channel: str, data: Any):
        """Handle a parsed data payload. Override this for custom logic."""
        print(f"[Receiver] ({channel}) {data}")

    async def run(self):
        """Convenience wrapper for quick startup."""
        await self.connect()
        await self.listen()

    async def close(self):
        """Graceful shutdown."""
        if self.websocket and not self.websocket.closed:
            await self.websocket.close()
        self.running = False

class PlottingReceiver(WebSocketReceiver):
    """
    Simple plotting receiver for quick data checks
    """
    def __init__(self, channels):
        super().__init__(channels=channels)
        self.data = deque(maxlen=1000)
        self.fig, self.ax = plt.subplots()
        self.line, = self.ax.plot([],[],'r-')
        self.ax.set_title(f"Channel: {channels[0]}")
        plt.ion()

    async def on_data(self, channel: str, data: Any):
        self.data.append((data["timestamp"], data["value"]))
        xs = [d[0] for d in self.data]
        ys = [d[1] for d in self.data]
        self.line.set_xdata(xs)
        self.line.set_ydata(ys)
        self.ax.relim()
        self.ax.autoscale_view()
        plt.draw()
        plt.pause(0.01)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python3 receiver.py [channel]")
        exit(1)
    
    ch = sys.argv[1]
    receiver = PlottingReceiver(channels=[ch])
    asyncio.run(receiver.run())