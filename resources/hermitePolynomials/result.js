let vrb = 0.2;

let balls = {
    "0": `${1}`,
    "1": `${2*vrb}`,
    "2": `${-2 + 4*Math.pow(vrb, 2) }`,
    "3": `${-12*vrb + 8*Math.pow(vrb, 3) }`,
    "4": `${12 - 48*Math.pow(vrb, 2) + 16*Math.pow(vrb, 4) }`,
    "5": `${120*vrb - 160*Math.pow(vrb, 3) + 32*Math.pow(vrb, 5) }`,
    "6": `${-120 + 720*Math.pow(vrb, 2) - 480*Math.pow(vrb, 4) + 64*Math.pow(vrb, 6) }`,
    "7": `${-1680*vrb + 3360*Math.pow(vrb, 3) - 1344*Math.pow(vrb, 5) + 128*Math.pow(vrb, 7) }`,
    "8": `${1680 - 13440*Math.pow(vrb, 2) + 13440*Math.pow(vrb, 4) - 3584*Math.pow(vrb, 6) + 256*Math.pow(vrb, 8) }`,
    "9": `${30240*vrb - 80640*Math.pow(vrb, 3) + 48384*Math.pow(vrb, 5) - 9216*Math.pow(vrb, 7) + 512*Math.pow(vrb, 9) }`,
    "10": `${-30240 + 302400*Math.pow(vrb, 2) - 403200*Math.pow(vrb, 4) + 161280*Math.pow(vrb, 6) - 23040*Math.pow(vrb, 8) + 1024*Math.pow(vrb, 10) }`,
    "11": `${-665280*vrb + 2217600*Math.pow(vrb, 3) - 1774080*Math.pow(vrb, 5) + 506880*Math.pow(vrb, 7) - 56320*Math.pow(vrb, 9) + 2048*Math.pow(vrb, 11) }`,
    "12": `${665280 - 7983360*Math.pow(vrb, 2) + 13305600*Math.pow(vrb, 4) - 7096320*Math.pow(vrb, 6) + 1520640*Math.pow(vrb, 8) - 135168*Math.pow(vrb, 10) + 4096*Math.pow(vrb, 12) }`,
    "13": `${17297280*vrb - 69189120*Math.pow(vrb, 3) + 69189120*Math.pow(vrb, 5) - 26357760*Math.pow(vrb, 7) + 4392960*Math.pow(vrb, 9) - 319488*Math.pow(vrb, 11) + 8192*Math.pow(vrb, 13) }`,
    "14": `${-17297280 + 242161920*Math.pow(vrb, 2) - 484323840*Math.pow(vrb, 4) + 322882560*Math.pow(vrb, 6) - 92252160*Math.pow(vrb, 8) + 12300288*Math.pow(vrb, 10) - 745472*Math.pow(vrb, 12) + 16384*Math.pow(vrb, 14) }`,
    "15": `${-518918400*vrb + 2421619200*Math.pow(vrb, 3) - 2905943040*Math.pow(vrb, 5) + 1383782400*Math.pow(vrb, 7) - 307507200*Math.pow(vrb, 9) + 33546240*Math.pow(vrb, 11) - 1720320*Math.pow(vrb, 13) + 32768*Math.pow(vrb, 15) }`,
    "16": `${518918400 - 8302694400*Math.pow(vrb, 2) + 19372953600*Math.pow(vrb, 4) - 15498362880*Math.pow(vrb, 6) + 5535129600*Math.pow(vrb, 8) - 984023040*Math.pow(vrb, 10) + 89456640*Math.pow(vrb, 12) - 3932160*Math.pow(vrb, 14) + 65536*Math.pow(vrb, 16) }`,
    "17": `${17643225600*vrb - 94097203200*Math.pow(vrb, 3) + 131736084480*Math.pow(vrb, 5) - 75277762560*Math.pow(vrb, 7) + 20910489600*Math.pow(vrb, 9) - 3041525760*Math.pow(vrb, 11) + 233963520*Math.pow(vrb, 13) - 8912896*Math.pow(vrb, 15) + 131072*Math.pow(vrb, 17) }`,
    "18": `${-17643225600 + 317578060800*Math.pow(vrb, 2) - 846874828800*Math.pow(vrb, 4) + 790416506880*Math.pow(vrb, 6) - 338749931520*Math.pow(vrb, 8) + 75277762560*Math.pow(vrb, 10) - 9124577280*Math.pow(vrb, 12) + 601620480*Math.pow(vrb, 14) - 20054016*Math.pow(vrb, 16) + 262144*Math.pow(vrb, 18) }`,
    "19": `${-670442572800*vrb + 4022655436800*Math.pow(vrb, 3) - 6436248698880*Math.pow(vrb, 5) + 4290832465920*Math.pow(vrb, 7) - 1430277488640*Math.pow(vrb, 9) + 260050452480*Math.pow(vrb, 11) - 26671841280*Math.pow(vrb, 13) + 1524105216*Math.pow(vrb, 15) - 44826624*Math.pow(vrb, 17) + 524288*Math.pow(vrb, 19) }`,
    "20": `${670442572800 - 13408851456000*Math.pow(vrb, 2) + 40226554368000*Math.pow(vrb, 4) - 42908324659200*Math.pow(vrb, 6) + 21454162329600*Math.pow(vrb, 8) - 5721109954560*Math.pow(vrb, 10) + 866834841600*Math.pow(vrb, 12) - 76205260800*Math.pow(vrb, 14) + 3810263040*Math.pow(vrb, 16) - 99614720*Math.pow(vrb, 18) + 1048576*Math.pow(vrb, 20) }`
}

console.log(balls[10]);