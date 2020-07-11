const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.js")({production: false});

const compiler = Webpack(webpackConfig);

const devServerOptions = Object.assign({}, webpackConfig.devServer);

const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(8080, '127.0.0.1');
