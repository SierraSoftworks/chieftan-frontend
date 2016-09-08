import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {HttpClient, HttpResponseMessage} from "aurelia-http-client";
import {EnvironmentManager} from "../managers/environments";

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

    if(response.statusCode !== 200) {
      let err = new Error(data.message);
      (<Error & {code: number}>err).code = data.code;
      err.name = data.error;

      if (response.statusCode === 401) this.router.navigateToRoute("config");

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
