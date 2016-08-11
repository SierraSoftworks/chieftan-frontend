export interface Breadcrumb {
    name: string;
    url?: string;
    route?: string;
    routeParams?: any;
}

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