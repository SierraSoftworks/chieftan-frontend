import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {HttpClient, HttpResponseMessage} from "aurelia-http-client";
import {EnvironmentManager} from "../managers/environments";
import * as Raven from "raven-js";

@autoinject
export class APIBase {
  constructor(protected http: HttpClient, private router: Router, private env: EnvironmentManager) {
    env.subscribe((e) => {
      if (!e) return;
      http.configure(b => {
        b.withBaseUrl(`${e.url}/api/v1`);
        e.token && b.withHeader("Authorization", `Token ${e.token}`);
      });
    });
  }

  protected handleResponse<T>(response: HttpResponseMessage) {
    const data = response.content;

    if(!response.isSuccess) {
      let err = new Error(data.message || "Server Error");
      (<Error & {code: number}>err).code = data.code || 500;
      err.name = data.error || "An unknown server error occured while processing your request.";

      if (response.statusCode === 401) this.router.navigateToRoute("config");

      Raven.captureException(err, {
        level: "error",
        extra: {
          request: response.requestMessage
        }
      });
      
      return Promise.reject<T>(err);
    }
    
    if (response.mimeType !== "application/json") {
      let err = new Error("The server returned a response which was not of type 'application/json'.");
      (<Error & {code: number}>err).code = 500;
      err.name = "Invalid Response";
      return Promise.reject<T>(err);
    }
    
    return Promise.resolve<T>(response.content);
  }
}
