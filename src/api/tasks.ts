import {autoinject} from "aurelia-framework";
import {APIBase} from "./common";
import {ProjectSummary} from "./projects";
import {ActionSummary} from "./actions";

@autoinject
export class TasksAPI extends APIBase {
  list(type: "action"|"project", id: string): Promise<Task[]> {
    return this.http.createRequest(`/${type}/${id}/tasks`)
      .asGet()
      .send()
      .then(res => this.handleResponse<Task[]>(res));
  }

  recent(type: "action"|"project", id: string): Promise<Task[]> {
    return this.http.createRequest(`/${type}/${id}/tasks/recent`)
      .asGet()
      .send()
      .then(res => this.handleResponse<Task[]>(res));
  }

  create(action: string, task: NewTask): Promise<Task> {
    return this.http.createRequest(`/action/${action}/tasks`)
      .asPost()
      .withContent(action)
      .send()
      .then(res => this.handleResponse<Task>(res));
  }

  get(id: string): Promise<Task> {
    return this.http.createRequest(`/task/${id}`)
      .asGet()
      .send()
      .then(res => this.handleResponse<Task>(res));
  }

  run(id: string, configuration?: string, vars: { [name: string]: string; } = {}): Promise<Task> {
    return this.http.createRequest(`/task/${id}/run`)
      .asPost()
      .withContent({
        configuration,
        vars
      })
      .send()
      .then(res => this.handleResponse<Task>(res));
  }
}

export interface NewTask {
  metadata: {
    description: string;
    url: string;
  };
  vars: {
    [name: string]: string;
  };
}

export interface Task {
  id: string;
  metadata: {
    description: string;
    url: string;
  };
  action: ActionSummary;
  project: ProjectSummary;
  vars: {
    [name: string]: string;
  };
  state: "NotExecuted" | "Executing" | "Failed" | "Passed";
  output: string;
  created: Date;
  executed: Date;
  completed: Date;
}

export interface TaskSummary {
  id: string;
  metadata: {
    description?: string;
    url?: string;
  };
}
