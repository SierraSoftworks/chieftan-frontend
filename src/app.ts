import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Chieftan';
    config.map([
      { route: '', name: 'projects', moduleId: './projects', nav: false, title: 'Projects' },
      { route: 'project/new', name: 'newProject', moduleId: './newProject', nav: false, title: 'New Project' },
      { route: 'project/:project', name: 'project', moduleId: './project', nav: false, title: 'Project' },
      { route: 'project/:project/actions', name: 'actions', moduleId: './actions', nav: false, title: 'Actions' },
      { route: 'project/:project/actions/new', name: 'newAction', moduleId: './newAction', nav: false, title: 'New Action' },
      { route: 'action/:action', name: 'action', moduleId: './action', nav: false, title: 'Action' },
      { route: 'action/:action/edit', name: 'editAction', moduleId: './editAction', nav: false, title: 'Edit Action' },
      { route: 'project/:project/tasks', name: 'tasks', moduleId: './tasks', nav: false, title: 'Tasks' },
      { route: 'action/:action/tasks', name: 'actionTasks', moduleId: './actionTasks', nav: false, title: 'Tasks' },
      { route: 'task/:task', name: 'task', moduleId: './task', nav: false, title: 'Task' },
      { route: 'config', name: 'config', moduleId: './config', nav: true, title: 'Settings' },
    ]);

    this.router = router;
  }
}
