const helpers = require('./helpers');

exports.config = {
  baseUrl: 'http://localhost:3000/',

  // use `npm run e2e`
  specs: [
    helpers.root('test/e2e/**/*.ts')
  ],
  exclude: [],

  framework: 'jasmine',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: true,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true']
    }
  },

  onPrepare: function() {
    require('ts-babel-node-extendable').register({ compilerOptions: { allowJs: false } });
  },

  /**
   * Aurelia configuration
   */
  plugins: [{
    path: helpers.root('config/aurelia.protractor.js')
  }]
};
