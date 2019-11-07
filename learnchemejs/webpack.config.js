const path = require("path");

var harmonic = {
    entry: "./prb/harmonic.min.js",
    output: {
        filename: "bundleHarmonic.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var pib1 = {
    entry: "./prb/pib1.js",
    output: {
        filename: "bundlepib1.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var immiscibleP = {
    entry: "./prb/immiscibleP.js",
    output: {
        filename: "bundleImmiscibleP.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var immisciblePMobile = {
    entry: "./prb/immisciblePMobile.js",
    output: {
        filename: "bundleImmisciblePMobile.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var immiscibleT = {
    entry: "./prb/immiscibleT.js",
    output: {
        filename: "bundleImmiscibleT.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var immiscibleTMobile = {
    entry: "./prb/immiscibleTMobile.js",
    output: {
        filename: "bundleImmiscibleTMobile.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var Pxy = {
    entry: "./prb/Pxy.js",
    output: {
        filename: "bundlePxy.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var PxyMobile = {
    entry: "./prb/PxyMobile.js",
    output: {
        filename: "bundlePxyMobile.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var Txy = {
    entry: "./prb/Txy.js",
    output: {
        filename: "bundleTxy.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

var TxyMobile = {
    entry: "./prb/TxyMobile.js",
    output: {
        filename: "bundleTxyMobile.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader" }
        ]
    },
    mode: "development",
    stats: {
        colors: true
    }
};

module.exports = [
  immiscibleT, immiscibleP, Pxy, Txy, immiscibleTMobile, immisciblePMobile, PxyMobile, TxyMobile, pib1, harmonic
];
