import {autoinject} from "aurelia-framework";
import {ProjectsAPI, Project} from "./api/projects";
import {ActionsAPI, Action} from "./api/actions";
import {TasksAPI, Task} from "./api/tasks";

@autoinject
export class ProjectView {
  constructor(private projectsAPI: ProjectsAPI, private actionsAPI: ActionsAPI, private tasksAPI: TasksAPI) {

  }

  action: Action = null;
  tasks: Task[] = [];

  activate(params: { action: string; }) {
    return Promise.all([
      this.actionsAPI.get(params.action).then(action => {
        this.action = action;
      }),
      this.tasksAPI.list("action", params.action).then(tasks => {
        this.tasks = tasks;
      })
    ]);
  }
}
