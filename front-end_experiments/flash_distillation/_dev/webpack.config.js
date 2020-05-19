const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const mode = "production";
const mode = "development";

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
    use: ["to-string-loader", "css-loader"]
  },
  {
    test: /component\.s[ac]ss$/i,
    use: [
      {
        loader: "to-string-loader"
      },
      {
        loader: "css-loader"
      }, 
      {
        loader: 'postcss-loader', // Run post css actions
        options: {
          plugins: function () { // post css plugins, can be exported to postcss.config.js
            return [
              require('autoprefixer')
            ];
          }
        }
      },
      {
        loader: "sass-loader"
      }
    ]
  },
  { 
    test: /^((?!component\.).)*s[ac]ss$/i,
    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
  },
  {
    test: /^((?!component\.).)*\.html$/i,
    use: ["html-loader"]
  },
  {
    test: /component\.html$/i,
    use: ["to-string-loader", "html-loader"]
  },
  {
    test: /\.(svg|png|jpg|gif)$/,
    use: {
      loader: "file-loader",
      options: {
        name: "[name].[hash].[ext]",
        outputPath: "resources"
      }
    }
  }
];

const stats = "errors-only";

const htmlOptions = {
  filename: "index.html",
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

const minimize = mode == "development" ? false : true;

module.exports = [{
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
]