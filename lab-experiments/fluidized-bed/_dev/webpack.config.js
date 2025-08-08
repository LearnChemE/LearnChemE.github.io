const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

module.exports = (env, argv) => {return {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Headloss",
      template: "./src/index.html",
    }),
    new miniCssExtractPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(argv.mode !== 'production')
    })
  ],
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        rules: [
          {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
        ],
      },
      {
        test: /\.(scss)$/i,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.(png|docx|pdf)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
}};
