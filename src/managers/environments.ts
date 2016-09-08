import {autoinject, Disposable} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";

@autoinject
export class EnvironmentManager {
  constructor(private httpClient: HttpClient) {
    try {
      const envStr = localStorage.getItem("environments");
      const activeEnvStr = localStorage.getItem("environments:active");
      const envs = JSON.parse(envStr);
      if (Array.isArray(envs)) {
        this.environments = envs;
        this.active = envs.find(e => e.name === activeEnvStr);
      }
    } catch(err) {

    }

    this.activeEnvironment = this.activeEnvironment || this.environments[0] || {
      name: "Chieftan",
      url: `${window.location.protocol}//${window.location.host}/`,
      token: ""
    };
  }

  get active(): Environment {
    return this.activeEnvironment;
  }

  set active(env: Environment) {
    this.activeEnvironment = env;
    localStorage.setItem("environments:active", env.name);
    this.testEnvironment(env).then(state => {
      if (env !== this.activeEnvironment) return;
      this.state = state;
    });
    
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

  testEnvironment(env: Environment): Promise<EnvironmentTestResult> {
    return this.httpClient
      .createRequest("/user")
      .withBaseUrl(`${env.url}/api/v1`)
      .asGet()
      .send().then(res => {
        return { available: true, authentication: true };
      }, res => {
        if (res.statusCode === 401) return { available: true, authentication: false };
        return { available: false, authentication: false };
      });
  }
}

export interface Environment {
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
