import {autoinject} from "aurelia-framework";
import {APIBase} from "./common";
import {ProjectSummary} from "./projects";
import {ActionSummary} from "./actions";
import {TaskSummary} from "./tasks";

@autoinject
export class UsersAPI extends APIBase {
  list(): Promise<User[]> {
    return this.http
      .createRequest(`/users`)
      .asGet()
      .send()
      .then(res => this.handleResponse(res));
  }

  details(id?: string): Promise<User> {
    return this.http
      .createRequest(`/user${id ? `/${id}` : ""}`)
      .asGet()
      .send()
      .then(res => this.handleResponse(res));
  }

  create(user: NewUser): Promise<User> {
    return this.http
      .createRequest(`/users`)
      .asPost()
      .withContent(user)
      .send()
      .then(res => this.handleResponse(res));
  }
}


export interface User {
  id: string;
  name: string;
  email: string;

  permissions: string[];
}

export interface NewUser {
  name: string;
  email: string;

  permissions?: string[];
}
