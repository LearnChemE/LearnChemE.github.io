const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
    use: [MiniCssExtractPlugin.loader, "css-loader"]
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
    "keywords": "",
    "author": "Neil Hendren"
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
    entry: { app: [path.resolve(__dirname, "./src/index.js")] },
    output: {
      ...jsOptions,
      path: path.resolve(path.resolve(process.cwd(), 'dist')),
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
      new CleanWebpackPlugin({ root: path.join(__dirname, 'dist') }),
      new HtmlWebpackPlugin({ ...htmlOptions, title: "Other"})
    ]
  }
}