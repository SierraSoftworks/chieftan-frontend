import {autoinject} from "aurelia-framework";
import {ProjectsAPI, Project} from "./api/projects";
import {ActionsAPI, Action} from "./api/actions";
import {TasksAPI, Task} from "./api/tasks";

@autoinject
export class ProjectView {
  constructor(private projectsAPI: ProjectsAPI, private actionsAPI: ActionsAPI, private tasksAPI: TasksAPI) {

  }

  task: Task = null;
  action: Action = null;
  private refreshIntervalHandle: number = null;

  run: {
    vars: { [variable: string]: string };
  } = {
    vars: {}
  };

  activate(params: { task: string; }) {
    return this.tasksAPI.get(params.task).then(task => {
      this.task = task;
      this.taskChanged();

      return Promise.all([
        this.actionsAPI.get(task.action.id).then(action => {
          this.action = action
          this.run.vars = Object.assign({}, action.vars, task.vars);
        })
      ])
    });
  }

  deactivate() {
    if (this.refreshIntervalHandle)
      clearInterval(this.refreshIntervalHandle);
  }

  refreshTask() {
    this.tasksAPI.get(this.task.id).then(task => {
      this.task = task;
      this.taskChanged();
    });
  }

  runTask() {
    this.tasksAPI.run(this.task.id, this.run.vars).then(task => {
      this.task = task;
      this.taskChanged();
    });
  }

  taskChanged() {
    if (this.task.state === "Executing") {
      if (!this.refreshIntervalHandle)
        this.refreshIntervalHandle = setInterval(() => this.refreshTask(), 1000);
    } else {
      if (this.refreshIntervalHandle) {
        clearInterval(this.refreshIntervalHandle);
        this.refreshIntervalHandle = null;
      }
    }
  }
}
