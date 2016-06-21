import {autoinject, bindable} from "aurelia-framework";
import {Task, TasksAPI} from "../api/tasks";

@autoinject
export class TaskEntry {
  constructor(private tasksAPI: TasksAPI) {

  }

  @bindable task: Task;

  runTask() {
    this.tasksAPI.run(this.task.id);
  }
}
