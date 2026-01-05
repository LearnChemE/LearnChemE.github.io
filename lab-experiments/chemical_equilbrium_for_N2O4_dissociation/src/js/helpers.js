
/**
 * Animate function to be called every frame.
 * @param {(dt: number, t: number) => boolean} fn Function to call every frame. dt is time since last call in seconds, t is total time in ms. Return true to continue, false to stop.
 * @param {() => void | undefined} then Optional function to call when animation ends.
 */
export function animate(fn, then) {
    let prevtime = null;

    const frame = (time) => {
        if (prevtime === null) prevtime = time;
        const dt = (time - prevtime) / 1000; // in ms
        prevtime = time;

        // Call the function
        const playing = fn(dt, time);

        // Request next frame
        if (playing) requestAnimationFrame(frame);
        else then?.();
    }
    return requestAnimationFrame(frame);
}