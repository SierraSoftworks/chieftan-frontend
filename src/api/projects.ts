import {autoinject} from "aurelia-framework";
import {APIBase} from "./common";

@autoinject
export class ProjectsAPI extends APIBase {
  list(): Promise<Project[]> {
    return this.http.createRequest("/projects")
      .asGet()
      .send()
      .then(res => this.handleResponse<Project[]>(res));
  }

  create(project: NewProject): Promise<Project> {
    return this.http.createRequest("/projects")
      .asPost()
      .withContent(project)
      .send()
      .then(res => this.handleResponse<Project>(res));
  }

  get(id: string): Promise<Project> {
    return this.http.createRequest(`/project/${id}`)
      .asGet()
      .send()
      .then(res => this.handleResponse<Project>(res));
  }
}

export interface NewProject {
  name: string;
  description: string;
  url: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
}
