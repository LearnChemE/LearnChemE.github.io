const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const module_rules = [{
    test: /\.ttf|\.wav$/i,
    loader: 'file-loader',
    options: {
      name: 'assets/[name].[ext]',
    },
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader",
      "sass-loader",
    ],
    type: 'javascript/auto'
  },
  {
    test: /\.svg$/i,
    use: ["to-string-loader", "html-loader"]
  },
  {
    test: /\.(docx|pdf)$/i,
    loader: 'file-loader',
    options: {
      name: 'assets/[name].[ext]',
    },
  },
  {
    test: /\.html$/,
    loader: 'html-loader',
    exclude: path.resolve(__dirname, '../src/html/index.html'),
    options: {
      // This tells html-loader to only process local, relative files
      sources: {
        urlFilter: (attribute, value, resourcePath) => {
          // Skip external URLs and script src attributes
          if (value.startsWith('http://') || value.startsWith('https://')) {
            return false;
          }
          // Skip data URIs
          if (value.startsWith('data:')) {
            return false;
          }
          return true;
        },
      },
    },
  },
];

const html_options = {
  title: "Antoine Constants",
  filename: "index.html",
  templateContent: fs.readFileSync(path.resolve(__dirname, '../src/html/index.html'), 'utf-8'),
  scriptLoading: "blocking",
  hash: true,
  minify: false,
  templateParameters: {
    // Prevent HtmlWebpackPlugin from running html-loader on the template
    webpack: undefined,
    webpackConfig: undefined,
  },
  meta: {
    "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no",
    "keywords": "LearnChemE, chemical engineering, engineering, simulation",
    "author": "Neil Hendren",
    "application-name": "Adiabatic Flash Drum with Binary Liquid Feed Digital Laboratory Experiment",
    "description": "A digital experiment to explore adiabatic flash vaporization of ideal and non-ideal binary mixtures."
  },
}

let config = {
  entry: {
    index: path.resolve(__dirname, '../src/index.js'),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../dist'),
      watch: true,
    },
    hot: false,
    liveReload: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      logging: 'error',
    },
  },
  plugins: [
    new HtmlWebpackPlugin(html_options),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!assets/**',
      ],
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    clean: false,
  },
  module: {
    rules: module_rules
  },
  experiments: {
    futureDefaults: true,
  },
  optimization: null
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {

    config.optimization = {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          minify: TerserPlugin.uglifyJsMinify
        }),
      ],
      moduleIds: 'size',
      chunkIds: 'total-size',
      removeAvailableModules: true,
    }

  } else {

    config.optimization = {
      minimize: false,
      moduleIds: 'named',
      chunkIds: 'named',
      removeAvailableModules: false,
      realContentHash: false,
    }

    config.devtool = 'source-map';

  };

  return config;
}