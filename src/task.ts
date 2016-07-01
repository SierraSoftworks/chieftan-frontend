import {autoinject, BindingEngine, Disposable} from "aurelia-framework";
import {ProjectsAPI, Project} from "./api/projects";
import {ActionsAPI, Action, ActionConfiguration} from "./api/actions";
import {TasksAPI, Task} from "./api/tasks";

@autoinject
export class ProjectView {
  constructor(private projectsAPI: ProjectsAPI, private actionsAPI: ActionsAPI, private tasksAPI: TasksAPI, private bindingEngine: BindingEngine) {
    this.configurationChangeSubscription = this.bindingEngine.propertyObserver(this, "configuration").subscribe(() => this.configurationChanged());
  }

  task: Task = null;
  action: Action = null;
  private refreshIntervalHandle: number = null;

  configuration: ActionConfiguration = null;
  private configurationChangeSubscription: Disposable;

  vars: { [variable: string]: string } = {};

  activate(params: { task: string; }) {
    return this.tasksAPI.get(params.task).then(task => {
      this.task = task;
      this.taskChanged();

      return Promise.all([
        this.actionsAPI.get(task.action.id).then(action => {
          this.action = action
          this.configuration = action.configurations && action.configurations[0];
        })
      ])
    });
  }

  deactivate() {
    if (this.refreshIntervalHandle)
      clearInterval(this.refreshIntervalHandle);

    this.configurationChangeSubscription.dispose();
  }

  refreshTask() {
    this.tasksAPI.get(this.task.id).then(task => {
      this.task = task;
      this.taskChanged();

      this.configurationChanged();
    });
  }

  runTask(configuration?: string) {
    this.tasksAPI.run(this.task.id, configuration, this.vars).then(task => {
      this.task = task;
      this.taskChanged();
    });
  }

  configurationChanged() {
    this.vars = Object.assign({}, this.action.vars, this.task.vars, this.vars, this.configuration && this.configuration.vars || {});
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
