import {autoinject, bindable, bindingMode} from "aurelia-framework";
import {Task, TasksAPI} from "../api/tasks";

@autoinject
@bindable({
  name: "task",
  defaultBindingMode: bindingMode.twoWay
})
export class TaskEntry {
  constructor(private tasksAPI: TasksAPI) {

  }

  task: Task;
  private refreshIntervalHandle: number = null;

  unbind() {
    if (this.refreshIntervalHandle)
      clearInterval(this.refreshIntervalHandle);
  }

  runTask() {
    this.tasksAPI.run(this.task.id).then(task => {
      this.task = task;
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

  refreshTask() {
    this.tasksAPI.get(this.task.id).then(task => {
      this.task = task;
    });
  }

}
