import {autoinject} from "aurelia-framework";
import {HttpClient, HttpResponseMessage} from "aurelia-http-client";

export class Configuration {
  url: string = "http://localhost:3001"
}

@autoinject
export class APIBase {
  constructor(protected http: HttpClient, protected config: Configuration) {
    http.configure(b => {
      b.withBaseUrl(`${config.url}/api/v1`);
    });
  }

  protected handleResponse<T>(response: HttpResponseMessage) {
    const data = response.content;

    if(response.statusCode !== 200) {
      let err = new Error(data.message);
      (<Error & {code: number}>err).code = data.code;
      err.name = data.error;
      return Promise.reject<T>(err);
    } else {
      return Promise.resolve<T>(response.content);
    }
  }
}
