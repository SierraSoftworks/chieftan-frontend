const base = require("./webpack.config.js");
const helpers = require("./webpack-helpers");

const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = Object.assign({}, base, {
  cache: false,

  debug: false,
  devtool: "source-map",

  output: {
    path: helpers.root("dist"),
    filename: "[name].[chunkhash].bundle.js",
    sourceMapFilename: "[name].[chunkhash].bundle.map",
    chunkFilename: '[id].[chunkhash].chunk.js',
    publicPath: '/'
  },

  plugins: [
    new WebpackMd5Hash(),
    new DedupePlugin(),

    ...base.plugins,

    new DefinePlugin({
      VERSION: `"${process.env.VERSION}""`,
      DEVELOPMENT: false,
      SENTRY_DSN: process.env.SENTRY_DSN && `"${process.env.SENTRY_DSN}"` || false
    }),

    new CompressionPlugin({
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024
    })
  ],

  htmlLoader: {
    minimize: true,
    removeAttributeQuotes: false,
    caseSensitive: true
  }
});
