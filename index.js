/**
 * This is the entrypoint for the Webpack app.
 * Require any polyfills and global runtimes here.
 */

// we want font-awesome to load as soon as possible to show the fa-spinner
import 'materialize-css/dist/css/materialize.css';
import './styles/initial.less';

import * as raven from 'raven-js';
raven.config(SENTRY_DSN, {
  release: VERSION
}).install();

if (window.addEventListener) {
  window.addEventListener("unhandledrejection", (err) => {
    raven.captureException(err);
  });

  window.addEventListener("error", (err) => {
    raven.captureException(err);
    raven.showReportDialog();
  });
}

// comment out if you don't want a Promise polyfill (remove also from config/webpack.common.js)
import * as Bluebird from 'bluebird';
Bluebird.config({
  //// Enable long stack traces
  // longStackTraces: true,
  //// Enable cancellation
  // cancellation: true,
  //// Enable monitoring
  // monitoring: true,
  // Enable warnings
  warnings: false
});

import 'aurelia-polyfills';
import {initialize} from 'aurelia-pal-browser';

// PAL has to be initialized in the first chunk, before any of the Aurelia files are loaded
// the reason is that Webpack resolves all the imports immediately, as the chunks are loaded
// Some modules use {DOM} from 'aurelia-pal' and expect it to already be initialized.
initialize();
