const path = require("path");

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

var immicibleP = {
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

var immicibleT = {
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

module.exports = [
  immicibleT, immicibleP, Pxy, Txy, pib1
];
