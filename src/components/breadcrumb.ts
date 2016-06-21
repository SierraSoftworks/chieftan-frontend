import {autoinject, bindable, noView} from "aurelia-framework";
import {AppRouter} from "aurelia-router";

export class Breadcrumbs {
  crumbs: Breadcrumb[] = [];

  add(crumb: Breadcrumb) {
    this.crumbs.push(crumb);
  }

  remove(crumb: Breadcrumb) {
    const i = this.crumbs.indexOf(crumb);
    if (~i) this.crumbs.splice(i, 1);
  }
}

@autoinject
@noView
export class Breadcrumb {
  constructor(private breadcrumbs: Breadcrumbs, private router: AppRouter) {

  }

  @bindable name: string;
  @bindable url: string;
  @bindable route: string;
  @bindable routeParams: any;

  bind() {
    if (this.route) this.updateUrlFromRoute(this.route, this.routeParams);
    this.breadcrumbs.add(this);
  }

  unbind() {
    this.breadcrumbs.remove(this);
  }

  routeChanged() {
    this.updateUrlFromRoute(this.route, this.routeParams);
  }

  routeParamsChanged() {
    this.updateUrlFromRoute(this.route, this.routeParams);
  }

  updateUrlFromRoute(route: string, params: any) {
    this.url = this.router.generate(route, params);
  }
}
