const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const rules = [
  {
    test: /\.js?$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"]
      }
    }
  },
  {
    test: /\.css$/i,
    use: ["style-loader", "css-loader"]
  },
  { 
    test: /\.s[ac]ss$/i,
    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
  },
  {
    test: /\.html$/i,
    use: ["to-string-loader", "html-loader"]
  },
  {
    test: /\.svg$/i,
    use: ["to-string-loader", "html-loader"]
  }
];

const stats = "errors-only";

const htmlOptions = {
  filename: "index.html",
  template: path.resolve(__dirname, "../src/html/index.html"),
  meta: {
    "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no",
    "keywords": "LearnChemE, Chemical Engineering, Engineering, Education, Simulation, Simulated Laboratory Experiment",
    "author": "Neil Hendren and Scott Rowe",
    "application-name": "Simulated Lab Flash Distillation Experiment",
    "description": "An Online Lab Experiment for Chemical Engineering undergraduate students"
  },
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true
  }
};

const jsOptions = {
  filename: "main.[contentHash].js"
};

const styleOptions = {
  filename: "[name].[contentHash].css"
};

const terserOptions = {
  parallel: true
}

module.exports = env => {
  let mode, minimize;

  if(env.production) {minimize = true; mode = "production";} else {minimize = false; mode = "development";}

  return {
    mode: mode,
    entry: { app: [path.resolve(__dirname, "../src/index.js")] },
    output: {
      ...jsOptions,
      path: path.resolve(__dirname, "../dist/"),
    },
    module: { rules: rules },
    stats: stats,
    optimization: {
      minimize: minimize,
      minimizer: [
        new OptimizeCssAssetsPlugin(),
        new TerserPlugin(terserOptions)
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(styleOptions),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ ...htmlOptions, title: "Flash Column Experiment"})
    ]
  }
}