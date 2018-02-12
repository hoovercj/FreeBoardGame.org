var path = require("path");

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const port = process.env.PORT || 8000;
const workboxPlugin = require('workbox-webpack-plugin');


var config = {
  /*
   * app.ts represents the entry point to your web application. Webpack will
   * recursively go through every "require" statement in app.ts and
   * efficiently build out the application's dependency tree.
   */
  entry: [path.resolve(__dirname, 'src/app.tsx')],

  /*
   * The combination of path and filename tells Webpack what name to give to
   * the final bundled JavaScript file and where to store this file.
   */
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, './dist/index.html'),
      template: path.resolve(__dirname, './src/index.html'),
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
		new workboxPlugin({
       globDirectory: './dist',
       globPatterns: ['**\/*.{html,js,webp,mp3,wav,svg}'],
       globIgnores: [],
       swSrc: './sw.js',
       swDest: './dist/sw.js',
   }),
   new CopyWebpackPlugin([
      { from: require.resolve('workbox-sw'), to: 'workbox-sw.prod.js' }
   ])
  ],

  /*
   * resolve lets Webpack now in advance what file extensions you plan on
   * "require"ing into the web application, and allows you to drop them
   * in your code.
   */
  resolve: {
    extensions: [".ts", ".tsx", ".js", "*"],
    modules: [
      "node_modules",
      "src"
    ]
  },

  module: {
    /*
     * Each loader needs an associated Regex test that goes through each
     * of the files you've included (or in this case, all files but the
     * ones in the excluded directories) and finds all files that pass
     * the test. Then it will apply the loader to that file. I haven't
     * installed ts-loader yet, but will do that shortly.
     */
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|webp|svg|mp3|wav)$/,
        exclude: /node_modules/,
        loader: "file-loader"
      }
    ]
  }
};

module.exports = config