/**
 * Solves for a root of a given function using the Secant method
 * @param fn - The function to find a root for
 * @param x0 - First initial guess
 * @param x1 - Second initial guess
 * @param tol - Tolerance (default: 1e-7)
 * @param maxIterations - Maximum number of iterations (default: 100)
 * @returns The approximate root or null if not found
 */
export function secantMethod(
    fn: (x: number) => number,
    x0: number,
    x1: number,
    tol: number = 1e-7,
    maxIterations: number = 100
): number | null {
    let iteration = 0;
    let f0 = fn(x0);
    let f1 = fn(x1);
    
    // Check if initial guesses are already solutions
    if (Math.abs(f0) < tol) return x0;
    if (Math.abs(f1) < tol) return x1;
    
    while (iteration < maxIterations) {
        iteration++;
        
        // Avoid division by zero
        if (Math.abs(f1 - f0) < tol) {
            console.warn('Secant method: possible division by zero');
            return x1;
        }
        
        // Calculate next approximation
        const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
        const f2 = fn(x2);
        
        // Check for convergence
        if (Math.abs(f2) < tol || Math.abs(x2 - x1) < tol) {
            return x2;
        }
        
        // Update values for next iteration
        x0 = x1;
        f0 = f1;
        x1 = x2;
        f1 = f2;
    }
    
    console.warn(`Secant method failed to converge after ${maxIterations} iterations`);
    return null;
}
