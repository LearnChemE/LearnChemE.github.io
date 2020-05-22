const webpack = require("webpack");
const liveServer = require("live-server");
const path = require('path');

const configuration = require("./webpack.config.js");

let compiler = webpack(configuration);

compiler.watch({
  // 50 ms delay before re-compiling after save
  aggregateTimeout: 50
}, (err, stats) => {
  console.log("front-end built sucessfully");
});

let liveServerParams = {
  port: 8000, // Set the server port. Defaults to 8080.
  host: "localhost", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  root: path.resolve(__dirname, "../dist/"), // Set root directory that's being served. Defaults to cwd.
  open: true, // When false, it won't load your browser by default.
  file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
  wait: 300, // Waits for all changes, before reloading. Defaults to 0 sec.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  noCssInject: true
};

liveServer.start(liveServerParams);