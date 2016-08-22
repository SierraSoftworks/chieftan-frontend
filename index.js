import 'materialize-css/dist/css/materialize.css';
import './styles/initial.less';
import * as Raven from "raven-js"

Raven.config(SENTRY_DSN, {
  release: VERSION,
  environment: FLAVOUR
}).install();

if (window.addEventListener) {
  window.addEventListener("unhandledrejection", (err) => {
    Raven.captureException(err);
  });

  window.addEventListener("error", (err) => {
    Raven.captureException(err);
    Raven.showReportDialog();
  });
}

import * as Bluebird from "bluebird";
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

import 'aurelia-bootstrapper-webpack';
