import {autoinject} from "aurelia-framework";
import {APIBase} from "./common";
import {ProjectSummary} from "./projects";

@autoinject
export class ActionsAPI extends APIBase {
  list(project: string): Promise<Action[]> {
    return this.http.createRequest(`/project/${project}/actions`)
      .asGet()
      .send()
      .then(res => this.handleResponse<Action[]>(res));
  }

  create(project: string, action: NewAction): Promise<Action> {
    return this.http.createRequest(`/project/${project}/actions`)
      .asPost()
      .withContent(action)
      .send()
      .then(res => this.handleResponse<Action>(res));
  }

  get(id: string): Promise<Action> {
    return this.http.createRequest(`/action/${id}`)
      .asGet()
      .send()
      .then(res => this.handleResponse<Action>(res));
  }

  update(project: string, id: string, action: NewAction): Promise<Action> {
    return this.http.createRequest(`/action/${id}`)
      .asPut()
      .withContent(action)
      .send()
      .then(res => this.handleResponse<Action>(res));
  }
}

export interface NewAction {
  name: string;
  description: string;
  vars: {
    [name: string]: string;
  };
  configurations: ActionConfiguration[];
  http?: HttpRequest;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  project: ProjectSummary;
  vars: {
    [name: string]: string;
  };
  configurations: ActionConfiguration[];
  http?: HttpRequest;
}

export interface ActionConfiguration {
  name: string;
  vars: {
    [name: string]: string;
  };
}

export interface ActionSummary {
  id: string;
  name: string;
  description: string;
}

export interface HttpRequest {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    url: string;
    headers?: {
        [header: string]: string;
    };
    data?: string|Object;
}
