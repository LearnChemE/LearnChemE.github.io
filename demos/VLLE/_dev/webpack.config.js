const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const rules = [
  {
    test: /\.js?$/,
    exclude: [/node_modules/, /p4.js/],
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
    use: ["html-loader"]
  },
  {
    test: /\.svg$/i,
    use: ["to-string-loader", "html-loader"]
  },
  {
    test: /\.(png|jpg|gif)/,
    use: ["file-loader"]
  }
];

const stats = "errors-only";

const htmlOptions = {
  filename: "index.html",
  template: path.resolve(__dirname, "../src/html/index.html"),
  meta: {
    "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no",
    "keywords": "LearnChemE, Chemical Engineering, Engineering, Education, Simulation, Thermodynamics, Vapor-liquid equilibrium, partially miscible liquids, phase equilibrium",
    "author": "Neil Hendren",
    "application-name": "Vapor-liquid-liquid equilibrium (VLLE)",
    "description": "A simulation of partially miscible liquids in vapor-liquid-liquid equilibrium (VLLE)"
  },
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true
  },
};

const jsOptions = {
  filename: "main.[contenthash].js"
  // filename: "main.js"
};

const styleOptions = {
  filename: "[name].[contenthash].css"
  // filename: "[name].css"
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
    devServer: {
      contentBase: path.join(__dirname, '../dist'),
      compress: true,
      open: true,
      stats: 'errors-only',
    },
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
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns : ['**/*', '!mathjax/**', '!resources/**'] }),
      new HtmlWebpackPlugin({ ...htmlOptions, title: "Vapor-liquid-liquid equilibrium (VLLE)"})
    ]
  }
}