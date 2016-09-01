import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import * as Raven from "raven-js";

declare var SENTRY_DSN;

@autoinject
export class NotFound {
  constructor(private router: Router) {

  }

  location: Location;
  hasRavenDSN: boolean = !!SENTRY_DSN;

  activate() {
    this.location = location;
    Raven.captureMessage("Page Not Found", {
      level: "info",
      extra: {
        path: location.pathname,
        query: location.search,
        hash: location.hash,
      }
    });
  }

  report() {
    (<any>Raven).showReportDialog();
  }
}
