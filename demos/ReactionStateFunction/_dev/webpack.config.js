const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";

const module_rules = [
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader",
      "sass-loader",
    ]
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

const html_options = {
  title: "Enthalpy as a State Function",
  filename: "index.html",
  template: path.resolve(__dirname, '../src/html/template.html'),
  scriptLoading: "blocking",
  hash: true,
  meta: {
    "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no",
    "keywords": "LearnChemE, Chemical Engineering, Engineering, Education, Simulation, Thermodynamics",
    "author": "Neil Hendren",
    "application-name": "Enthalpy as a State Function",
    "description": "An interactive simulation designed to teach engineering students about state functions and how to calculate heat of reaction."
  },
}

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/index.js'),
  },
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin(html_options),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  module: {
    rules: module_rules
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        minify: TerserPlugin.uglifyJsMinify
      }),
    ]
  }
};