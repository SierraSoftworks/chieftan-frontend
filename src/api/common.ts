import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {HttpClient, HttpResponseMessage} from "aurelia-http-client";

@autoinject
export class APIBase {
  constructor(protected http: HttpClient, private router: Router) {
    http.configure(b => {
      b.withBaseUrl(`${this.url}/api/v1`);
      this.token && b.withHeader("Authorization", `Token ${this.token}`);
    });
  }

  private get _token(): string {
    const configuredServer = localStorage.getItem("token");
    return configuredServer || "";
  }

  private set _token(token: string) {
    localStorage.setItem("token", token);
  }

  private _cached_token: string = null;

  get token(): string {
    return this._cached_token || (this._cached_token = this._token);
  }

  set token(token: string) {
    this._token = token;
    this._cached_token = token;
    this.http.configure(b => {
      token && b.withHeader("Authorization", `Token ${token}`);
    });
  }
  
  private get _url(): string {
    const configuredServer = localStorage.getItem("server");
    return configuredServer || `${location.protocol}//${location.host}`;
  }

  private set _url(url: string) {
    localStorage.setItem("server", url);
  }

  private _cached_url: string = null;
  get url(): string {
    return this._cached_url || (this._cached_url = this._url);
  }

  set url(url: string) {
    this._url = url;
    this._cached_url = url;
    this.http.configure(b => {
      b.withBaseUrl(`${this.url}/api/v1`);
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
