export function Antoine(T, A, B, C) {
    return Math.pow(10, A - B / (T + C))
}

export function InvAntoine(P, A, B, C) {
    return B / (A - Math.log10(P)) - C;
}

export function BubblePoint(x, Psat1, Psat2) {
    return x * Psat1 + (1 - x) * Psat2;
}

export function DewPoint(x, Psat1, Psat2) {
    return Math.pow(x / Psat1 + (1 - x) / Psat2, -1);
}

export function BubblePointT(x, Antoine1, Antoine2, Tmin, Tmax, precision) {
    return FindRoot({
        expression: '@x2@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x2@) * Antoine(T, @AO@, @BO@, @CO@) - @P@',
        variable: 'T',
        min: Tmin,
        max: Tmax,
        precision: precision
    })
}
