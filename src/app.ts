import "../styles/styles.less";

import {Aurelia, autoinject} from 'aurelia-framework';
import {Router, RouterConfiguration, NavigationInstruction, Next, RedirectToRoute} from 'aurelia-router';
import {UserManager} from "./managers/user";
import {HasPermission} from "./managers/permissions";
import * as Raven from "raven-js";

@autoinject
export class App {
  constructor(private userManager: UserManager, private router: Router) {
    
  }

  bind() {
    return this.updateUser();
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Chieftan';
    config.options.pushState = true;

    config.addAuthorizeStep(PermissionStep);

    config.map([
      { route: '', name: 'projects', moduleId: './projects', nav: false, title: 'Projects' },
      { route: 'project/new', name: 'newProject', moduleId: './newProject', nav: false, title: 'New Project', settings: { permission: 'admin' } },
      { route: 'project/:project', name: 'project', moduleId: './project', nav: false, title: 'Project', settings: { permission: 'project/:project' } },
      { route: 'project/:project/actions', name: 'actions', moduleId: './actions', nav: false, title: 'Actions', settings: { permission: 'project/:project' } },
      { route: 'project/:project/actions/new', name: 'newAction', moduleId: './newAction', nav: false, title: 'New Action', settings: { permission: 'project/:project/admin' } },
      { route: 'action/:action', name: 'action', moduleId: './action', nav: false, title: 'Action' },
      { route: 'action/:action/edit', name: 'editAction', moduleId: './editAction', nav: false, title: 'Edit Action' },
      { route: 'project/:project/tasks', name: 'tasks', moduleId: './tasks', nav: false, title: 'Tasks', settings: { permission: 'project/:project' } },
      { route: 'action/:action/tasks', name: 'actionTasks', moduleId: './actionTasks', nav: false, title: 'Tasks' },
      { route: 'task/:task', name: 'task', moduleId: './task', nav: false, title: 'Task' },
      { route: 'audit', name: 'audit', moduleId: './audit', nav: true, title: 'Audit Log', settings: { permission: 'admin' } },
      { route: 'users', name: 'users', moduleId: './users', nav: true, title: 'Users', settings: { permission: 'admin/users' } },
      { route: 'users/new', name: 'newUser', moduleId: './newUser', nav: false, title: 'New User', settings: { permission: 'admin/users' } },
      { route: 'user/:id', name: 'user', moduleId: './user', nav: false, title: 'User', settings: { permission: 'admin/users' } },
      { route: 'audit/:id', name: 'auditEntry', moduleId: './auditEntry', nav: false, title: 'Audit Log Details', settings: { permission: 'admin' } },
      { route: 'config', name: 'config', moduleId: './config', nav: true, title: 'Settings' },
    ]);
  }

  private updateUser() {
    return this.userManager.updateUser().catch(err => {
      Raven.captureException(err, {
        level: "warning"
      });

      this.router.navigateToRoute("config");
    });
  }
}

@autoinject
class PermissionStep {
  constructor(private userManager: UserManager) {

  }

  run(instruction: NavigationInstruction, next: Next) {
    return this.userManager.userPromise.then(user => {
      const hasPermission = instruction.getAllInstructions().every(instruction => {
        if (!instruction.config.settings.permission) return true;

        return HasPermission(user, instruction.config.settings.permission, instruction.params);
      });

      if (!hasPermission) return next.cancel();
      return next();
    }).catch(err => {
      const requiresPermission = instruction.getAllInstructions().some(instruction => {
        return !!instruction.config.settings.permission;
      });

      if (!requiresPermission) return next();
      return next.cancel(new RedirectToRoute("config"));
    });
  }
}
