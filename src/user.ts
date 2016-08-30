import {autoinject} from "aurelia-framework";
import {UsersAPI, User} from "./api/users";
import {ProjectsAPI, Project} from "./api/projects";

@autoinject
export class UserView {
  constructor(private usersAPI: UsersAPI, private projectsAPI: ProjectsAPI) {
    this.crypto = window.crypto || (<any>window).msCrypto;
  }

  user: User = null;
  projects: Project[] = [];
  tokens: string[] = [];

  crypto: Crypto;

  activate(params: { id: string; }) {
    return Promise.all([
      this.usersAPI.details(params.id).then(user => {
        this.user = user;
      }),
      this.usersAPI.tokens(params.id).then(tokens => {
        this.tokens = tokens;
      }),
      this.projectsAPI.list().then(projects => {
        this.projects = projects;
      })
    ]);
  }

  private generateToken(): string {
    const tokenData = new Uint8Array(16);
    this.crypto.getRandomValues(tokenData);

    return tokenData.reduce((str, byte) => {
      const bStr = byte.toString(16);
      if (bStr.length === 1) return `${str}0${bStr}`;
      return `${str}${bStr}`;
    }, "");
  }

  newToken() {
    const newToken = this.generateToken();
    this.usersAPI.addToken(this.user.id, newToken).then(tokens => {
      this.tokens = tokens;
    });
  }

  revokeToken(token: string) {
    this.usersAPI.revokeToken(this.user.id, token).then(tokens => {
      this.tokens = tokens;
    });
  }

  hasPermission(permission: string) {
    return this.user && !!~this.user.permissions.indexOf(permission);
  }
}
