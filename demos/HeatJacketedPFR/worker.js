// worker.js

// 1. Load the Emscripten-generated JS glue code
// In a worker, importScripts brings the Emscripten Module into scope
importScripts('main.js');

// 2. Wait for the module to initialize before accepting tasks
Module.onRuntimeInitialized = () => {
    // Notify the main thread that the worker is ready
    postMessage({ type: 'READY' });
};

// 3. Listen for commands from the main thread
self.onmessage = (event) => {
    const { command, data } = event.data;

    if (command === 'CALCULATE') {
        // Instantiate the C++ class
        const calc = new Module.Calculator(data.baseValue);
        
        // Execute the heavy Wasm function
        const result = calc.add(data.addValue);
        
        // Delete the C++ instance to free WebAssembly memory
        calc.delete();
        
        // Send the result back to the main UI thread
        postMessage({ 
            type: 'RESULT', 
            payload: result 
        });
    }
};