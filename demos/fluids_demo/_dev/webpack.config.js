// _dev/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin         = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin    = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    stats: 'errors-only',

    // ───────────────────────────────────────────────────────────────────────
    // 1) ENTRY
    // ───────────────────────────────────────────────────────────────────────
    entry: {
      index: path.resolve(__dirname, '../src/index.js'),
    },

    // ───────────────────────────────────────────────────────────────────────
    // 2) OUTPUT
    // ───────────────────────────────────────────────────────────────────────
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',   // Serve everything under dist/ as “/…”
      clean: false,      // We rely on CleanWebpackPlugin instead
    },

    // ───────────────────────────────────────────────────────────────────────
    // 3) SOURCE MAPS (only in dev)
    // ───────────────────────────────────────────────────────────────────────
    devtool: isProd ? false : 'source-map',

    // ───────────────────────────────────────────────────────────────────────
    // 4) DEV SERVER
    // ───────────────────────────────────────────────────────────────────────
    devServer: {
      static: {
        directory: path.resolve(__dirname, '../dist'),
        watch: true,
      },
      hot: false,
      liveReload: true,
      client: {
        overlay: { errors: true, warnings: false },
        logging: 'error',
      },
      historyApiFallback: true,
    },

    // ───────────────────────────────────────────────────────────────────────
    // 5) MODULE RULES
    // ───────────────────────────────────────────────────────────────────────
    module: {
      rules: [
        // ── 5.1) SCSS → CSS (extract in production; style-loader in dev)
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },

        // ── 5.2) FONTS & AUDIO & DOCUMENTS (TTF, WAV, DOCX, PDF)
        {
          test: /\.(ttf|wav|docx|pdf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },

        // ── 5.3) IMAGES (SVG, PNG, JPG, GIF)
        {
          test: /\.(svg|png|jpe?g|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },

        // ── 5.4) HTML PARTIALS (only if you import them in JS; otherwise CopyPlugin handles)
        {
          test: /\.html$/i,
          include: path.resolve(__dirname, '../src/html/overlay'),
          type: 'asset/resource',
          generator: {
            filename: 'html/overlay/[name][ext]',
          },
        },
      ],
    },

    // ───────────────────────────────────────────────────────────────────────
    // 6) PLUGINS
    // ───────────────────────────────────────────────────────────────────────
    plugins: [
      // ── 6.1) HtmlWebpackPlugin for main index.html
      new HtmlWebpackPlugin({
        title: "Heterogeneous Chemical Equilibrium",
        filename: "index.html",
        template: path.resolve(__dirname, '../src/html/index.html'),
        scriptLoading: "blocking",
        hash: true,
        meta: {
          viewport:          "width=device-width, initial-scale=1, shrink-to-fit=no",
          keywords:          "LearnChemE, chemical engineering, engineering, simulation",
          author:            "Neil Hendren",
          "application-name": "Heterogeneous Chemical Equilibrium",
          description:       "Simulates the number of moles of solids and gas in equilibrium in a constant-volume container."
        },
      }),

      // ── 6.2) Extract CSS into a separate file in production
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),

      // ── 6.3) Clean dist/ before each build (except keep dist/assets/ if you need)
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          '!assets/**',
        ],
      }),

      // ── 6.4) Copy static folders:
      //      • src/html/overlay → dist/html/overlay
      //      • src/assets (images + pdfs + etc) → dist/assets
      new CopyWebpackPlugin({
        patterns: [
          // Copy overlay HTML partials
          {
            from: path.resolve(__dirname, '../src/html/overlay'),
            to:   path.resolve(__dirname, '../dist/html/overlay'),
          },
          // Copy everything under src/assets → dist/assets
          {
            from: path.resolve(__dirname, '../src/assets'),
            to:   path.resolve(__dirname, '../dist/assets'),
          },
        ],
      }),
    ],

    // ───────────────────────────────────────────────────────────────────────
    // 7) OPTIMIZATION
    // ───────────────────────────────────────────────────────────────────────
    optimization: isProd
      ? {
          minimizer: [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                compress: true,
              },
            }),
          ],
          moduleIds: 'size',
          chunkIds:  'total-size',
          removeAvailableModules: true,
        }
      : {
          minimize: false,
          moduleIds: 'named',
          chunkIds: 'named',
          removeAvailableModules: false,
          realContentHash: false,
        },
  };
};