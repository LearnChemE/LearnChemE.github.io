/**
 * Author: Drew Smith
 * Residual-based unit testing for learncheme.github.io simulations
 * The latest version of this file and the python app will be available on my GitHub eventually.
 */

/**
 * Code found in this file should be fully tree-shaken in any non-development build, or else it can be a security issue.
 * Do this by setting the __DEV__ variable in your environment. This is usually done in your bundler settings or package.json scripts.
 * Then, only use the file through dynamic imports in static guards:
 * 
 *     declare const __DEV__: boolean;
 *     if (__DEV__) {
 *         import("./debug").then(({ debug }) => {
 *             debug(State.getInfo());
 *         });
 *     }
 * 
 * During build, __DEV__ will be set to false, so the if (false) block will be removed.
 */

const URI = "ws://localhost:8765";
let ws!: WebSocket;

async function initWS() {
    return new Promise<void>((resolve) => {
        ws = new WebSocket(URI);
        // Tell the server we are a sender
        ws.onopen = () => {
            ws.send(JSON.stringify({ role: "sender" }));
            resolve();
        };
    });
}

export async function sendTestData(data: Object, channel: string) {
    if (!ws) await initWS();
    const msg = JSON.stringify({
        channel: channel,
        timestamp: Date.now(),
        data: data
    });
    ws.send(msg);
}

export default sendTestData