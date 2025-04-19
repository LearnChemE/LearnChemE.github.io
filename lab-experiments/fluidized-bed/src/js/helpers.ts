
// Constain x to the bounds [min, max]
export function constrain(x: number, min: number, max: number) {
    if (min > max) {
        throw new Error("Bad range for constrain: min must be less than max");
    }

    if (x < min) x = min;
    if (x > max) x = max;

    return x;
}

// Lerp function
export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

// Rescale x from scale of a to b to scale of c to d 
// 6th argument optionally sets whether to constrain to bounds
export function rescale(x: number, a: number, b: number, c: number, d: number, constrain: boolean=false) {
    if (a > b || c > d) throw new Error("Rescale bounds inverted");

    x = (x - a) / (b - a);
    x = x * (d - c) + c;

    if (constrain) {
        if (x > d) x = d;
        if (x < c) x = c;
    }

    return x;
}

/**
 * Smoothly interpolate from start to end over a given duration (in milliseconds)
 * @param duration Duration of animation
 * @param updateCallback Callback accepting interpolant to render animation
 * @param start Lowest t value accepted by callback (default 0)
 * @param end Highest t value accepted by callback (deault 1)
 */
export function smoothLerp(duration: number, updateCallback: (t: number) => void, start: number = 0, end: number = 1): Promise<void> {
    return new Promise((resolve) => {
        let startTime: number | null = null;

        // Function to update the value at each frame
        const animate = (time: number) => {
        if (!startTime) startTime = time; // Initialize the start time

        // Calculate elapsed time
        const elapsed = time - startTime;

        // Calculate the interpolation factor t (from 0 to 1)
        const t = Math.min(elapsed / duration, 1); // Ensure t doesn't go beyond 1

        // Interpolate between start and end
        const interpolatedValue = lerp(start, end, t);

        // Call the update callback with the interpolated value
        updateCallback(interpolatedValue);

        // If not at the end, continue the animation
        if (t < 1) {
            requestAnimationFrame(animate);
        }
        // If at the end, give the return callback
        else resolve();
        }

        // Start the animation
        requestAnimationFrame(animate);
    });
}
