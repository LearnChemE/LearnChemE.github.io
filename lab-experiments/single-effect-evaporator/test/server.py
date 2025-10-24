import asyncio
import websockets
from websockets.server import serve
import websockets.exceptions
import json
from collections import defaultdict

# Keep track of connected clients
senders = set()
receivers_by_channel = defaultdict(set)

RED = "\033[91m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
RESET = "\033[0m"

def ServerPrint(msg):
    print(f"{BLUE}[Server]{RESET} {msg}")

def ServerWarn(msg):
    print(f"{BLUE}[Server]{RESET} {YELLOW}{msg}{RESET}")

async def handler(websocket, path):
    role = "unkown"
    channels = []
    """
    Simple websocket server for residual testing. Recieves data from senders, unpacks json, and sends to recievers
    """
    try:
        # Expect client to identify itself on connect
        init_message = await websocket.recv()
        info = json.loads(init_message)

        role = info.get("role")
        if role == "sender":
            senders.add(websocket)
            ServerPrint("Sender connected.")
        elif role == "receiver":
            # Subscribe the websocket to each channel it requests
            channels = info.get("channels", [])
            for ch in channels:
                receivers_by_channel[ch].add(websocket)
            ServerPrint(f"Receiver connected, subscribed to: {channels}")
        else:
            await websocket.send(json.dumps({"error": "Missing or invalid role"}))
            return

        # Listen for data from senders and broadcast to receivers
        async for message in websocket:
            if websocket in senders:
                try:
                    msg = json.loads(message)
                    channel = msg.get("channel")
                    if not channel:
                        continue

                    # Send to all receivers
                    targets = list(receivers_by_channel[channel])
                    for r in targets:
                        try:
                            # Send data
                            await r.send(json.dumps(msg))
                        except websockets.exceptions.ConnectionClosed:
                            # If channel got closed, discard it
                            receivers_by_channel[channel].discard(r)
                
                except json.JSONDecodeError:
                    ServerWarn(f"Recieved invalid JSON from sender: {message}")
            else:
                ServerPrint(f"Receiver sent message (ignored): {message}")

    except websockets.exceptions.ConnectionClosed:
        ServerPrint(f"Client disconnected: {role}")
    finally:
        # Cleanup disconnected clients
        senders.discard(websocket)
        for _,ch_set in receivers_by_channel.items():
            ch_set.discard(websocket)
        cleanupChannels = f" (subscribed to {channels})" if (role == "receiver") else ""
        ServerPrint(f"Cleaning up {role} client" + cleanupChannels)
async def main():
    async with serve(handler, "localhost", 8765):
        ServerPrint("Server running on ws://localhost:8765")
        await asyncio.Future() # run forever

if __name__ == "__main__":
    asyncio.run(main())
