import {autoinject, computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import {ProjectsAPI, Project} from "./api/projects";
import {ActionsAPI, NewAction, HttpRequest} from "./api/actions";

@autoinject
export class NewProjectActionView {
  constructor(private projectsAPI: ProjectsAPI, private actionsAPI: ActionsAPI, private router: Router) {
    this.reset();
  }

  error: Error & { code: number; } = null;

  project: Project;

  details: NewAction;

  features: {
    http: boolean;
  };

  activate(params: { project: string; }) {
    const persistedStateJSON = localStorage.getItem("newProjectActionState");
    if (persistedStateJSON) {
      const persistedState = JSON.parse(persistedStateJSON);
      this.details = persistedState;
      this.features = this.getDisabledFeatures();
    }

    return this.projectsAPI.get(params.project).then(project => {
      this.project = project
    });
  }

  deactivate() {
    localStorage.setItem("newProjectActionState", JSON.stringify(this.details));
  }

  create() {
    const features: NewAction = {
      name: this.details.name,
      description: this.details.description,
      vars: this.details.vars
    };

    for (var k in this.features) {
      if (!this.features[k]) continue;
      features[k] = this.details[k];
    }
    this.actionsAPI.create(this.project.id, features).then(action => {
      this.router.navigateToRoute("projectAction", { project: this.project.id, action: action.id });
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
  
  toggleFeature(name: string) {
    if (this.features[name]) {
      this.disableFeature(name);
    } else {
      this.enableFeature(name);
    }
  }

  enableFeature(name: string) {
    this.features[name] = true;
  }

  disableFeature(name: string) {
    this.features[name] = false;
  }

  getDisabledFeatures() {
    let disabledFeatures: {
      http: boolean;
    } = {
      http: true
    };

    let details = this.details;

    for (let k in details) {
      if (disabledFeatures[k]) disabledFeatures[k] = true;
    }

    return disabledFeatures;
  }

  reset() {
    this.details = {
      name: null,
      description: null,
      vars: {},
      http: {
        method: "GET",
        url: "",
        headers: {}
      }
    };

    this.features = {
      http: true
    };
  }
}
