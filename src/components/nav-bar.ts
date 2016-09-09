import {autoinject, bindable} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {Router} from "aurelia-router";
import {Breadcrumbs} from "./breadcrumbs";
import {UserManager} from "../managers/user";
import {EnvironmentManager} from "../managers/environments";

@autoinject
export class NavBar {
  constructor(
    private breadcrumbs: Breadcrumbs,
    private events: EventAggregator,
    private userManager: UserManager,
    private envs: EnvironmentManager
  ) {
    events.subscribe("router:navigation:processing", () => {
      this.sideNav = false;
    });
  }

  @bindable router: Router;

  sideNav: boolean = false;
}
