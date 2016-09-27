import {autoinject, Disposable, Container} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";

@autoinject
export class EnvironmentManager {
  constructor(public httpClient: HttpClient) {
    try {
      const envStr = localStorage.getItem("environments");
      const activeEnvStr = localStorage.getItem("environments:active");
      const envs: EnvironmentConfig[] = JSON.parse(envStr);
      if (Array.isArray(envs)) {
        this.environments = envs.map(conf => new Environment(conf, this.httpClient));
        this.active = this.environments.find(e => e.name === activeEnvStr);
      }
    } catch(err) {

    }

    this.activeEnvironment = this.activeEnvironment || this.environments[0] || new Environment({
      name: "Chieftan",
      url: `${window.location.protocol}//${window.location.host}/`,
      token: ""
    }, this.httpClient);
  }

  get active(): Environment {
    return this.activeEnvironment;
  }

  set active(env: Environment) {
    if (this.activeEnvironment === env) return;

    this.activeEnvironment = env;
    localStorage.setItem("environments:active", env.name);
    
    this.notifySubscribers();
  }

  state: EnvironmentTestResult = null;
  environments: Environment[] = [];

  private activeEnvironment: Environment = null;
  private subscribers: EnvironmentChangeListener[] = [];

  save(): Promise<EnvironmentManager> {
    return new Promise<EnvironmentManager>((resolve, reject) => {
      try {
        localStorage.setItem("environments", JSON.stringify(this.environments));
        return resolve(this);
      } catch(err) {
        return reject(err);
      }
    });
  }

  subscribe(listener: EnvironmentChangeListener): Disposable {
    this.subscribers.push(listener);
    listener(this.activeEnvironment);
    return {
      dispose: () => {
        const i = this.subscribers.indexOf(listener);
        if (~i) this.subscribers.splice(i, 1);
      }
    };
  }

  private notifySubscribers() {
    const env = this.activeEnvironment;
    this.subscribers.forEach(subscriber => subscriber(env));
  }
}

export class Environment {
  constructor(config: EnvironmentConfig, private httpClient: HttpClient) {
    this.name = config.name;
    this._token = config.token;
    this._url = config.url;
    this.validate();
  }

  name: string;

  private _token: string;
  get token() {
    return this._token;
  }

  set token(token) {
    this._token = token;
    this.queueValidate();
  }

  private _url: string;
  get url() {
    return this._url;
  }

  set url(url) {
    this._url = url;
    this.queueValidate();
  }

  urlValid: boolean = false;
  tokenValid: boolean = false;

  private validateDebounceHandle: number;

  private queueValidate() {
    if (this.validateDebounceHandle) {
      clearTimeout(this.validateDebounceHandle);
    }

    this.validateDebounceHandle = setTimeout(() => {
      this.validateDebounceHandle = null;
      this.validate();
    }, 500);
  }

  get valid(): boolean {
    return this.urlValid && this.tokenValid;
  }

  validate(): Promise<this> {
    return this.httpClient
      .createRequest("/user")
      .withBaseUrl(`${this._url}/api/v1`)
      .withHeader("Authorization", `Token ${this._token}`)
      .asGet()
      .send().then(res => {
        if (!res.isSuccess) return { urlValid: false, tokenValid: false };

        const contentType = res.headers.get("Content-Type") || res.headers.get("content-type") || "";
        if (!contentType.indexOf("application/json")) {
          const properties = Object.keys(res.content);
          if (["id", "name", "email", "permissions"].every(x => !!~properties.indexOf(x))) {
            return { urlValid: true, tokenValid: true };
          }
        }

        return { urlValid: false, tokenValid: false };
      }, res => {
        if (res.statusCode === 401) return { urlValid: true, tokenValid: false };
        return { urlValid: false, tokenValid: false };
      }).then(res => {
        this.urlValid = res.urlValid;
        this.tokenValid = res.tokenValid;
        return this;
      });
  }

  toJSON(): EnvironmentConfig {
    return {
      name: this.name,
      token: this.token,
      url: this._url
    };
  }
}

export interface EnvironmentConfig {
  name: string;
  token: string;
  url: string;
}

export interface EnvironmentChangeListener {
  (env: Environment): void;
}

export interface EnvironmentTestResult {
  available: boolean;
  authentication: boolean;
}
