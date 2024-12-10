const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const miniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
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
  ],
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.(docx|pdf)$/i,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.(scss)$/i,
        use: [{
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
        test: /\.svg$/i,
        use: ["raw-loader"],
      },
    ],
  },
};