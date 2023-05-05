const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

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
    test: /\.svg$/i,
    use: ["to-string-loader", "html-loader"]
  },
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        cacheDirectory: true,
        cacheCompression: false
      }
    }
  }
];

const html_options = {
  title: "React Learner App",
  filename: "index.html",
  template: path.resolve(__dirname, './src/html/index.html'),
  scriptLoading: "blocking",
  hash: true,
  meta: {
    "viewport": "width=device-width, initial-scale=1, shrink-to-fit=no",
    "keywords": "LearnChemE, chemical engineering, engineering, simulation",
    "author": "Neil Hendren",
    "application-name": "Learn React",
    "description": "An app to learn React"
  },
}

let config = {
  stats: 'errors-only',
  entry: {
    index: path.resolve(__dirname, './src/index.jsx'),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './dist'),
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
    }
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
    path: path.resolve(__dirname, './dist'),
    clean: false,
  },
  module: {
    rules: module_rules
  },
  experiments: {
    futureDefaults: true,
  },
  optimization: null,
  resolve: {
    extensions: [".js", ".jsx"]
  }
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

    config.module.rules[2].use.options.envName = "production";

  } else {

    config.optimization = {
      minimize: false,
      moduleIds: 'named',
      chunkIds: 'named',
      removeAvailableModules: false,
      realContentHash: false,
    }

    config.devtool = 'source-map';

    config.module.rules[2].use.options.envName = "development";

  };

  return config;
}