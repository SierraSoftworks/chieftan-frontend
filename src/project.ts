import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {ProjectsAPI, Project} from "./api/projects";
import {ActionsAPI, Action} from "./api/actions";
import {TasksAPI, Task} from "./api/tasks";

@autoinject
export class ProjectView {
  constructor(private projectsAPI: ProjectsAPI, private actionsAPI: ActionsAPI, private tasksAPI: TasksAPI, private router: Router) {

  }

  project: Project = null;
  actions: Action[] = [];
  tasks: Task[] = [];

  private refreshIntervalHandle: number = null;

  activate(params: { project: string; }) {
    this.refreshIntervalHandle = setInterval(() => {
      this.refreshTasks();
    }, 5000);

    return Promise.all([
      this.projectsAPI.get(params.project).then(project => {
        this.project = project;
      }),
      this.actionsAPI.list(params.project).then(actions => {
        this.actions = actions;
      }),
      this.tasksAPI.recent("project", params.project).then(tasks => {
        this.tasks = tasks;
      })
    ]);
  }

  deactivate() {
    clearTimeout(this.refreshIntervalHandle);
  }

  refreshTasks() {
    return this.tasksAPI.recent("project", this.project.id).then(tasks => {
      this.tasks = tasks;
    });
  }

  cloneAction(action: Action) {
    localStorage.setItem("newActionState", JSON.stringify({
      name: null,
      description: null,
      vars: action.vars,
      http: action.http
    }));

    this.router.navigateToRoute("newAction", { project: this.project.id });
  }
}
