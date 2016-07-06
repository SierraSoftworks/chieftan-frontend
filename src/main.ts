import {Aurelia} from 'aurelia-framework';
import {bootstrap} from 'aurelia-bootstrapper-webpack';
import * as Log from "aurelia-logging";
import {RavenLogAppender} from "./loggers/raven";

declare const document;
declare const DEVELOPMENT: boolean;
declare const SENTRY_DSN: string|boolean;

bootstrap((aurelia: Aurelia) => {
  if (SENTRY_DSN) {
    Log.addAppender(aurelia.container.get(RavenLogAppender));
  }

  aurelia.use
    .standardConfiguration()
    .globalResources([
      "converters/boolean",
      "converters/json",
      "converters/keyValue",
      "converters/not",
      "converters/output",
      "converters/relativeTime",
    ]);

  Log.setLevel(Log.logLevel.info);

  if (DEVELOPMENT) {
    Log.setLevel(Log.logLevel.debug);
    aurelia.use
      .developmentLogging();
  }

  const rootElement = document.body;
  rootElement.setAttribute('aurelia-app', '');

  return aurelia.start().then(() => aurelia.setRoot('app', rootElement));
});
