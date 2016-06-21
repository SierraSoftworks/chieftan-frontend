import {autoinject, computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import {ProjectsAPI, NewProject} from "./api/projects";

@autoinject
export class NewProjectView {
  constructor(private projectsAPI: ProjectsAPI, private router: Router) {

  }

  error: Error & { code: number; } = null;

  details: NewProject = {
    name: null,
    description: null,
    url: null
  }

  create() {
    this.projectsAPI.create(this.details).then(project => {
      this.router.navigateToRoute("project", { project: project.id });
    }, err => {
      this.error = err;
    });
  }

  @computedFrom("details")
  get nameValid() {
    const name = this.details.name;
    return name && name.length;
  }

  @computedFrom("details")
  get descriptionValid() {
    const description = this.details.description;
    return description && description.length;
  }

  @computedFrom("details")
  get urlValid() {
    const url = this.details.url;
    return url && /^https?:\/\.{6,}$/.test(url);
  }
}
