import {autoinject, bindable} from "aurelia-framework";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {UserManager} from "../managers/user";
import {User, UsersAPI} from "../api/users";
import {Project} from "../api/projects";
import {HasPermission, PermissionLevel} from "../managers/permissions";

@autoinject
export class Permission {
  constructor(private events: EventAggregator, private userManager: UserManager, private usersAPI: UsersAPI) {
    
  }

  @bindable user: User|null = null;
  @bindable project: Project|null = null;
  @bindable levels: PermissionLevel[] = [
    {
      title: "Read/Write",
      description: "Allow modification of this project and its various resources.",
      permissions: ["project/:project", "project/:project/admin"],
      icon: {
        glyph: "lock_open",
        activeColour: "#519C10"
      }
    },{
      title: "Read Only",
      description: "Only allow viewing of project resources and triggering of tasks.",
      permissions: ["project/:project"],
      icon: {
        glyph: "lock_open",
        activeColour: "#356AD5"
      }
    },{
      title: "No Access",
      description: "Don't allow access to this project",
      permissions: [],
      icon: {
        glyph: "lock_outline",
        activeColour: "#CFA500"
      }
    }
  ];

  private userChangeHandler: Subscription;
  private level: PermissionLevel = null;

  bind() {
    this.userChangeHandler = this.events.subscribe("user:updated", (user: User) => {
      this.updateActiveLevel();
    });

    this.updateActiveLevel();
  }

  unbind() {
    this.userChangeHandler.dispose();
  }

  private updateActiveLevel() {
    this.level = this.levels.find(level => 
      level.permissions.every(permission => 
        HasPermission(this.user || this.userManager.user, permission, {
          project: this.project && this.project.id
        })
      )
    );
  }
}

export class HasFlagValueConverter {
  toView(value: number, flag: number): boolean {
    return value === flag || (value & flag) !== 0;
  }
}
