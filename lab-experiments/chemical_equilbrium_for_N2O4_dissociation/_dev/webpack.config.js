// _dev/webpack.config.js (Modified)

const path = require('path');
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin         = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin    = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    // Only show errors in console
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
      // Emit JS bundles directly into dist/ (NO 'js/' prefix)
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, '../dist'),
      // publicPath: '/', // REMOVED - Will default to 'auto' in Webpack 5+
      clean: false,       // We’ll use CleanWebpackPlugin instead
    },

    // ───────────────────────────────────────────────────────────────────────
    // 3) SOURCE MAPS (dev only)
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
        // ───────────────────────────────────────────────────────────────────
        // 5.1) SCSS → CSS (extract into dist/ in production)
        // ───────────────────────────────────────────────────────────────────
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },

        // ───────────────────────────────────────────────────────────────────
        // 5.2) FONTS & AUDIO & DOCS (TTF, WAV, DOCX, PDF) → dist/assets/
        // ───────────────────────────────────────────────────────────────────
        {
          test: /\.(ttf|wav|docx|pdf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },

        // ───────────────────────────────────────────────────────────────────
        // 5.3) IMAGES
        // ───────────────────────────────────────────────────────────────────
        // SVGs handled to be loaded as strings (like in the "working" config example)
        {
          test: /\.svg$/i,
          use: ['to-string-loader', 'html-loader'],
        },
        // Other images (PNG, JPG, GIF) → dist/assets/
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },

        // ───────────────────────────────────────────────────────────────────
        // 5.4) HTML PARTIALS (overlay) if you import them → dist/html/overlay/
        // ───────────────────────────────────────────────────────────────────
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
      // ─────────────────────────────────────────────────────────────────────
      // 6.1) HtmlWebpackPlugin
      // ─────────────────────────────────────────────────────────────────────
      new HtmlWebpackPlugin({
        title: "Chemical equilibrium for N2O4 dissociation",
        filename: "index.html",
        template: path.resolve(__dirname, '../src/html/index.html'),
        scriptLoading: "blocking",
        hash: true, // Consider removing if using [contenthash] in filenames, but keep if it was in your original working setup
        meta: {
          viewport:          "width=device-width, initial-scale=1, shrink-to-fit=no",
          keywords:          "LearnChemE, chemical engineering, engineering, simulation",
          author:            "Sanath Kavatooru",
          "application-name": "Unsteady state material balances for a two-phase, multicomponent system ",
          description:       ""
        },
      }),

      // ─────────────────────────────────────────────────────────────────────
      // 6.2) Extract CSS into its own file under dist/ (NO 'css/' prefix for prod)
      // ─────────────────────────────────────────────────────────────────────
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
      }),

      // ─────────────────────────────────────────────────────────────────────
      // 6.3) Clean dist/ before each build
      // ─────────────────────────────────────────────────────────────────────
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          '!assets/**', // Keep assets if needed, this was in your original
        ],
      }),

      // ─────────────────────────────────────────────────────────────────────
      // 6.4) CopyWebpackPlugin (kept from your original config)
      // ─────────────────────────────────────────────────────────────────────
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../src/html/overlay'),
            to:   path.resolve(__dirname, '../dist/html/overlay'),
          },
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
              terserOptions: { compress: true }, // Ensure this matches your TerserPlugin version's API if issues arise
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
          realContentHash: false, // This was 'false' in your original, so kept it.
        },
  };
};