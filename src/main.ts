/* Webpack Build Constants */
declare const document;
declare const DEVELOPMENT: boolean;
declare const SENTRY_DSN: string;

import {Aurelia} from 'aurelia-framework';
import * as Log from "aurelia-logging";
import {RavenLogAppender} from "./loggers/raven";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .globalResources([
      "converters/boolean",
      "converters/json",
      "converters/keyValue",
      "converters/not",
      "converters/output",
      "converters/permissions",
      "converters/relativeTime",
      "converters/ternary",
    ]);

  Log.setLevel(Log.logLevel.info);

  if (DEVELOPMENT) {
    Log.setLevel(Log.logLevel.debug);
    aurelia.use
      .developmentLogging();
  } else if (SENTRY_DSN) {
    Log.addAppender(aurelia.container.get(RavenLogAppender));
  }

  return aurelia.start().then(() => aurelia.setRoot('app'));
}
