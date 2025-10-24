import asyncio
import websockets
from websockets.server import serve
import websockets.exceptions
import json
from collections import defaultdict

# Keep track of connected clients
senders = set()
receivers_by_channel = defaultdict(set)

async def handler(websocket, path):
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
            print("Sender connected.")
        elif role == "receiver":
            # Subscribe the websocket to each channel it requests
            channels = info.get("channels", [])
            for ch in channels:
                receivers_by_channel[ch].add(websocket)
            print(f"Receiver connected, subscribed to: {channels}")
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
                    print("Recieved invalid JSON from sender:", message)
            else:
                print("Receiver sent message (ignored):", message)

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected.")
    finally:
        # Cleanup disconnected clients
        senders.discard(websocket)
        for ch_set in receivers_by_channel:
            ch_set.discard(websocket)
        print("Client disconnected.")
async def main():
    async with serve(handler, "localhost", 8765):
        print("Server running on ws://localhost:8765")
        await asyncio.Future() # run forever

if __name__ == "__main__":
    asyncio.run(main())
