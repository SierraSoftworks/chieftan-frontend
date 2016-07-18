const webpack = require("webpack");
const helpers = require("./webpack-helpers");

const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const coreBundles = {
  bootstrap: [
    'aurelia-polyfills',
    'aurelia-pal',
    'aurelia-pal-browser',
    'bluebird',
    'ts-helpers'
  ],
  // that will have root directory remapped from /dist/commonjs to /dist/es2015
  // they will be included in the 'aurelia' bundle (except for bootstrap packages)
  aurelia: [
    'aurelia-bootstrapper-webpack',
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-event-aggregator',
    'aurelia-framework',
    'aurelia-history',
    'aurelia-history-browser',
    'aurelia-http-client',
    'aurelia-loader',
    'aurelia-loader-webpack',
    'aurelia-logging',
    'aurelia-logging-console',
    'aurelia-metadata',
    'aurelia-pal',
    'aurelia-pal-browser',
    'aurelia-path',
    'aurelia-polyfills',
    'aurelia-route-recognizer',
    'aurelia-router',
    'aurelia-task-queue',
    'aurelia-templating',
    'aurelia-templating-binding',
    'aurelia-templating-router',
    'aurelia-templating-resources'
  ],
  // you may remove certain non-core packages from the 'aurelia' bundle in order to lazy-load them
  excludeFromAureliaBundle: [

  ]
}

const meta = helpers.generateMeta(coreBundles);

module.exports = {
  context: helpers.root(""),
  debug: true,

  metadata: {
    title: "FarmTrack",
    baseUrl: "/",
    language: "typescript"
  },

  cache: true,
  devtool: "eval",

  output: {
    path: helpers.root("dist"),
    filename: "[name].bundle.js",
    sourceMapFilename: "[name].bundle.map",
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },

  entry: {
    'app': ["./src/main"],
    'aurelia-bootstrap': ['ts-helpers', './index'].concat(meta.bootstrapPackages),
    'aurelia': meta.aureliaPackages
  },

  resolve: {
    root: helpers.root("src"),
    extensions: ['', '.ts', '.js', '.html'],
    modulesDirectories: ["node_modules"],
    modules: [helpers.root("src"), "node_modules"],
    alias: meta.aliases
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: "source-map",
        exclude: [

        ]
      }
    ],

    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [helpers.root('node_modules'), helpers.root('build')],
        query: {
          tsconfig: 'tsconfig.json'
        }
      },

      {
        test: /\.css$/,
        loaders: "style!css"
      },

      {
        include: [helpers.root("styles/initial.less")],
        loader: ExtractTextPlugin.extract({ notExtractLoader: "style", loader: "css!less" })
      },

      {
        test: /\.less$/,
        exclude: [helpers.root("styles/initial.less")],
        loader: "style!css!less"
      },

      {
        test: /\.html$/,
        loader: 'html',
        exclude: [helpers.root('index.html')]
      },

      { test: /\.(png|gif|jpg)$/, loader: 'url', query: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url', query: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url', query: { limit: 10000, mimetype: 'application/font-woff' } },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
    ]
  },

  plugins: [
    new AureliaWebpackPlugin({
      root: helpers.root('.'),
      src: helpers.root('src')
    }),

    new webpack.optimize.OccurrenceOrderPlugin(true),

    new DefinePlugin({
      VERSION: `"development"`,
      DEVELOPMENT: true,
      SENTRY_DSN: false
    }),

    new ProvidePlugin({
      'Promise': 'bluebird',
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery' // this doesn't expose jQuery property for window, but exposes it to every module
    }),

    new ExtractTextPlugin("initial.css"),

    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: "favicon.ico",
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),

    new CopyWebpackPlugin([

    ]),

    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'aurelia-bootstrap',
        'aurelia',
        'app'
      ].reverse(),
      children: true
    })
  ],

  devServer: {
    port: 3002,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    outputPath: helpers.root('dist')
  }
};
