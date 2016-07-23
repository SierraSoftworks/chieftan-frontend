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
      .then(res => this.handleResponse<User[]>(res));
  }

  details(id?: string): Promise<User> {
    return this.http
      .createRequest(`/user${id ? `/${id}` : ""}`)
      .asGet()
      .send()
      .then(res => this.handleResponse<User>(res));
  }

  create(user: NewUser): Promise<User> {
    return this.http
      .createRequest(`/users`)
      .asPost()
      .withContent(user)
      .send()
      .then(res => this.handleResponse<User>(res));
  }

  tokens(id: string): Promise<string[]> {
    return this.http
      .createRequest(`/user/${id}/tokens`)
      .asGet()
      .send()
      .then(res => this.handleResponse<string[]>(res));
  }

  addToken(id: string, token: string): Promise<string[]> {
    return this.http
      .createRequest(`/user/${id}/tokens`)
      .asPost()
      .withContent({ token })
      .send()
      .then(res => this.handleResponse<string[]>(res));
  }

  revokeToken(id: string, token: string): Promise<string[]> {
    return this.http
      .createRequest(`/user/${id}/token/${token}`)
      .asDelete()
      .send()
      .then(res => this.handleResponse<string[]>(res));
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
