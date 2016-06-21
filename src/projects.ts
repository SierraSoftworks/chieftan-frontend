import {autoinject} from "aurelia-framework";
import {ProjectsAPI, Project} from "./api/projects";

@autoinject
export class ProjectsView {
  constructor(private projectsAPI: ProjectsAPI) {

  }

  projects: Project[] = [];

  activate() {
    return this.projectsAPI.list().then(projects => {
      this.projects = projects;
    });
  }
}
