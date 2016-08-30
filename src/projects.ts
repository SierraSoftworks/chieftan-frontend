import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {ProjectsAPI, Project} from "./api/projects";

@autoinject
export class ProjectsView {
  constructor(private projectsAPI: ProjectsAPI, private router: Router) {

  }

  projects: Project[] = [];

  activate() {
    return this.projectsAPI.list().then(projects => {
      this.projects = projects;
    }).catch(err => {
      this.router.navigateToRoute("config");
    });
  }
}
