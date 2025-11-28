
cstr_calc = require("./cstr_calc");

test("runs the calcs", () => {
    const args = {
        t: 30.5,
        T: 328.15,
        CAf: 0.3,
        CBf: 0.3,
        vA: 0.0375,
        vB: 0.0597
    };

    console.log(cstr_calc(args))
    expect(true)
});