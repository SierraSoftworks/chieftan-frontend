import {Aurelia} from 'aurelia-framework';
import {bootstrap} from 'aurelia-bootstrapper-webpack';

bootstrap(async (aurelia: Aurelia) => {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .globalResources([
      "converters/boolean",
      "converters/json",
      "converters/keyValue",
      "converters/not",
      "converters/output",
    ]);

  const rootElement = document.body;
  rootElement.setAttribute('aurelia-app', '');

  await aurelia.start();
  aurelia.setRoot('app', rootElement);
  
  // if you would like your website to work offline (Service Worker), 
  // enable the OfflinePlugin in config/webpack.common.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
});
