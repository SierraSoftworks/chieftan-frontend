import {autoinject, computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import {ProjectsAPI, ProjectSummary} from "./api/projects";
import {ActionsAPI, Action, NewAction, HttpRequest} from "./api/actions";

@autoinject
export class EditProjectActionView {
  constructor(private projectsAPI: ProjectsAPI, private actionsAPI: ActionsAPI, private router: Router) {
    
  }

  error: Error & { code: number; } = null;

  project: ProjectSummary;

  action: Action;
  details: NewAction;

  features: {
    http: boolean;
  };

  activate(params: { action: string; }) {
    return Promise.all([
      this.actionsAPI.get(params.action).then(action => {
        this.action = action;
        this.project = action.project;
        this.details = {
          name: action.name,
          description: action.description,
          vars: action.vars,
          http: action.http
        };
        this.features = this.getFeatures();
      })
    ]);
  }

  save() {
    const features: NewAction = {
      name: this.details.name,
      description: this.details.description,
      vars: this.details.vars
    };

    for (var k in this.features) {
      if (!this.features[k]) continue;
      features[k] = this.details[k];
    }

    this.actionsAPI.update(this.project.id, this.action.id, features).then(action => {
      this.router.navigateToRoute("action", { action: action.id });
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

  getFeatures() {
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
}
