import {autoinject} from "aurelia-framework";
import {UsersAPI, User} from "./api/users";
import {ProjectsAPI, Project} from "./api/projects";
import {PermissionLevel} from "./managers/permissions";

@autoinject
export class UserView {
  constructor(private usersAPI: UsersAPI, private projectsAPI: ProjectsAPI) {
    this.crypto = window.crypto || (<any>window).msCrypto;
  }

  user: User = null;
  projects: Project[] = [];
  tokens: string[] = [];

  crypto: Crypto;

  projectPermissionLevels: PermissionLevel[] = [
    {
      title: "Read/Write",
      description: "Allow modification of this project and its various resources.",
      permissions: ["project/:project", "project/:project/admin"],
      icon: {
        glyph: "lock_open",
        activeColour: "#519C10"
      },
      assign: (user, context) => {
        this.addPermissions(`project/${context["project"]}`, `project/${context["project"]}/admin`)
      }
    },{
      title: "Read Only",
      description: "Only allow viewing of project resources and triggering of tasks.",
      permissions: ["project/:project"],
      icon: {
        glyph: "lock_open",
        activeColour: "#356AD5"
      },
      assign: (user, context) => {
        this.addPermissions(`project/${context["project"]}`)
        this.removePermissions(`project/${context["project"]}/admin`)
      }
    },{
      title: "No Access",
      description: "Don't allow access to this project",
      permissions: [],
      icon: {
        glyph: "lock_outline",
        activeColour: "#CFA500"
      },
      assign: (user, context) => {
        this.removePermissions(`project/${context["project"]}`, `project/${context["project"]}/admin`)
      }
    }
  ]

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

  addPermissions(...permissions: string[]) {
    this.usersAPI.addPermissions(this.user.id, permissions).then(user => {
      this.user = user;
    });
  }

  removePermissions(...permissions: string[]) {
    this.usersAPI.removePermissions(this.user.id, permissions).then(user => {
      this.user = user;
    });
  }
}
