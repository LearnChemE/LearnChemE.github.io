export type GlobalState = {
    aparatusDiv: SVGAElement;
}

export type vec2 = {
    x: number;
    y: number;
}

export const vec2 = (x: number, y: number): vec2 => {
    return {x: x, y: y};
}