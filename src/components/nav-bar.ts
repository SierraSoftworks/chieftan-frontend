import {autoinject, bindable} from "aurelia-framework";
import {Router} from "aurelia-router";
import {Breadcrumbs} from "./breadcrumb";

@autoinject
export class NavBar {
  constructor(private breadcrumbs: Breadcrumbs) {

  }

  @bindable router: Router;
}
