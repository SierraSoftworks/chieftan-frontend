const core = require('@easy-webpack/core');
const generateConfig = core.generateConfig,
      get = core.get,
      stripMetadata = core.stripMetadata, 
      EasyWebpackConfig = core.EasyWebpackConfig; 
const path = require('path');

const envProd = require('@easy-webpack/config-env-production');
const envDev = require('@easy-webpack/config-env-development');
const aurelia = require('@easy-webpack/config-aurelia');
const typescript = require('@easy-webpack/config-typescript');
const html = require('@easy-webpack/config-html');
const css = require('@easy-webpack/config-css');
const less = require('@easy-webpack/config-less');
const fontAndImages = require('@easy-webpack/config-fonts-and-images');
const globalBluebird = require('@easy-webpack/config-global-bluebird');
const globalJquery = require('@easy-webpack/config-global-jquery');
const generateIndexHtml = require('@easy-webpack/config-generate-index-html');
const commonChunksOptimize = require('@easy-webpack/config-common-chunks-simple');
const copyFiles = require('@easy-webpack/config-copy-files');
const uglify = require('@easy-webpack/config-uglify');
const generateCoverage = require('@easy-webpack/config-test-coverage-istanbul');
const DefinePlugin = require("webpack").DefinePlugin;

const ELECTRON = process.env.ELECTRON && process.env.ELECTRON.toLowerCase() || false;
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = 'development');
const SENTRY_DSN = process.env.SENTRY_DSN || false;
const VERSION = process.env.VERSION || ENV;
const FLAVOUR = process.env.FLAVOUR || ENV;

// basic configuration:
const title = 'Chieftan';
const baseUrl = '/';
const rootDir = path.resolve();
const srcDir = path.resolve('src');
const outDir = path.resolve('dist');

const coreBundles = {
  bootstrap: [
    'aurelia-bootstrapper-webpack',
    'aurelia-polyfills',
    'aurelia-pal',
    'aurelia-pal-browser',
    'regenerator-runtime',
    'bluebird',
    'raven-js',
    path.join(rootDir, 'index.js')
  ],
  // these will be included in the 'aurelia' bundle (except for the above bootstrap packages)
  aurelia: [
    'aurelia-bootstrapper-webpack',
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-event-aggregator',
    'aurelia-framework',
    'aurelia-history',
    'aurelia-history-browser',
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
  ]
}

let config = generateConfig(
  {
    entry: {
      'app': ['./src/main' /* this is filled by the aurelia-webpack-plugin */],
      'aurelia-bootstrap': coreBundles.bootstrap,
      'aurelia': coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1)
    },
    output: {
      path: outDir,
    },
  },

  /**
   * Don't be afraid, you can put bits of standard Webpack configuration here
   * (or at the end, after the last parameter, so it won't get overwritten by the presets)
   * Because that's all easy-webpack configs are - snippets of premade, maintained configuration parts!
   * 
   * For Webpack docs, see: https://webpack.js.org/configuration/
   */

  {
    plugins: [
      new DefinePlugin({
        SENTRY_DSN: JSON.stringify(SENTRY_DSN),
        VERSION: JSON.stringify(VERSION),
        ENV: JSON.stringify(ENV),
        FLAVOUR: JSON.stringify(FLAVOUR),
        DEVELOPMENT: JSON.stringify(ENV === 'development')
      })
    ]
  },

  ENV === 'test' || ENV === 'development' ? 
    envDev(ENV !== 'test' ? {} : {devtool: 'inline-source-map'}) :
    envProd({ /* devtool: '...' */ }),

  aurelia({root: rootDir, src: srcDir, title: title, baseUrl: baseUrl}),
  typescript(ENV !== 'test' ? {} : { options: { doTypeCheck: false, sourceMap: false, inlineSourceMap: true, inlineSources: true } }),
  html(),
  less({ allChunks: true, sourceMap: false }),
  css({ filename: 'styles.css', allChunks: true, sourceMap: false }),
  fontAndImages(),
  globalBluebird(),
  globalJquery(),
  generateIndexHtml({minify: ENV === 'production'}),

  ...(ENV === 'production' || ENV === 'development' ? [
      commonChunksOptimize({appChunkName: 'app', firstChunk: 'aurelia-bootstrap'}),
      copyFiles({patterns: [
        { from: 'favicon.ico', to: 'favicon.ico' }
      ]})
    ] : [
    /* ENV === 'test' */
    generateCoverage({ options: { esModules: true } })
  ])

  // ENV === 'production' ?
  //   uglify({debug: false, mangle: { except: ['cb', '__webpack_require__'] }}) : {}
);

module.exports = stripMetadata(config);


