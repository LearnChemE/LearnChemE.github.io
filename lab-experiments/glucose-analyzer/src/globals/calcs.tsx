
export class Vec3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x; this.y = y; this.z = z;
    }

    protected create(x: number, y: number, z: number): this {
        const Ctor = this.constructor as new (x: number, y: number, z: number) => this;
        return new Ctor(x, y, z);
    }

    // RGB Aliases
    public get r(): number {
        return this.x;
    }
    public set r(value: number) {
        this.x = value;
    }
    public get g(): number {
        return this.y;
    }
    public set g(value: number) {
        this.y = value;
    }
    public get b(): number {
        return this.z;
    }
    public set b(value: number) {
        this.z = value;
    }

    mult(by: number) {
        return this.create(this.x * by, this.y * by, this.z * by);
    }

    dot(other: Vec3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other: Vec3) {
        return this.create(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    add(other: Vec3) {
        return this.create(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vec3) {
        return this.create(this.x - other.x, this.y - other.y, this.z - other.z);
    }
}

export class DyeEpsilon extends Vec3 { 
    static fromHex(col: string) {
        const [ r, g, b ] = hexToRBG(col);
        console.log(`r: ${r}, g: ${g}, b: ${b}`)

        return new DyeEpsilon(
            -Math.log10(r),
            -Math.log10(g),
            -Math.log10(b)
        );
    }

    mix(other: DyeEpsilon, ratio=1) {
        const volA = ratio;
        const volB = 1;
        const volTot = volA + volB;
        const diluteA =  this.mult(volA / volTot);
        const diluteB = other.mult(volB / volTot);

        return diluteA.add(diluteB) as DyeEpsilon;
    }

    toColorHex(conc=1, length=1) {
        const cl = conc * length;
        const toColFloat = (ep: number) => 10 ** -ep * cl;

        const rgb = [toColFloat(this.r), toColFloat(this.g), toColFloat(this.b)];
        return rgbToHex(rgb);
    }
}

const DyesRaw: Record<string, string> = {
    blue:   "#01FFFF",
    yellow: "#FFFF01",
    clear:  "#FFFFFF",
};

const Epsilon: Record<string, DyeEpsilon> = {
    "Quinoneimine": new DyeEpsilon(0.1, 1.0, 0.3)
};
for (let key in DyesRaw) {
    Epsilon[key] = DyeEpsilon.fromHex(DyesRaw[key]);
}

export function dyeLookup(name: string) {
    return Epsilon[name];
}

function hexToRBG(hex: string) {
    const normalized = hex.trim().replace(/^#/, "");
    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        throw new Error("hexToRBG requires a 6-character hex code without alpha");
    }
    return [
        parseInt(normalized.slice(0, 2), 16) / 0xFF,
        parseInt(normalized.slice(2, 4), 16) / 0xFF,
        parseInt(normalized.slice(4, 6), 16) / 0xFF
    ];
}

function rgbToHex(rgb: number[]) {
    return "#" + rgb.map(val => Math.floor(val * 0xFF).toString(16).padStart(2, "0").toUpperCase()).join("");
}


