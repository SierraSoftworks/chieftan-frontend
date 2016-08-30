import {autoinject, bindable} from "aurelia-framework";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {UserManager} from "../managers/user";
import {User, UsersAPI} from "../api/users";
import {Project} from "../api/projects";
import {HasPermission} from "../managers/permissions";

enum PermissionLevel {
  NoAccess = 0,
  ReadOnly = 1,
  ReadWrite = 2,
  Inherited = 4,

  InheritedReadOnly = ReadOnly | Inherited,
  InheritedReadWrite = ReadWrite | Inherited
}

@autoinject
export class Permission {
  constructor(private events: EventAggregator, private userManager: UserManager, private usersAPI: UsersAPI) {
    
  }

  @bindable user: User|null = null;
  @bindable project: Project|null = null;

  private userChangeHandler: Subscription;
  private permissionLevel: PermissionLevel = PermissionLevel.NoAccess;

  private Level = PermissionLevel;

  bind() {
    this.userChangeHandler = this.events.subscribe("user:updated", (user: User) => {
      this.updateState();
    });

    this.updateState();
  }

  unbind() {
    this.userChangeHandler.dispose();
  }

  updateState() {
    const hasReadOnlyInherited = HasPermission(this.user || this.userManager.user, "project/:project");
    const hasReadOnly = HasPermission(this.user || this.userManager.user, "project/:project", {
      project: this.project && this.project.id
    });

    const hasReadWriteInherited = HasPermission(this.user || this.userManager.user, "project/:project/admin");
    const hasReadWrite = HasPermission(this.user || this.userManager.user, "project/:project/admin", {
      project: this.project && this.project.id
    });

    if (hasReadWrite)
      this.permissionLevel = PermissionLevel.ReadWrite | (hasReadWriteInherited ? PermissionLevel.Inherited : PermissionLevel.NoAccess);
    else if (hasReadOnly)
      this.permissionLevel = PermissionLevel.ReadOnly | (hasReadOnlyInherited ? PermissionLevel.Inherited : PermissionLevel.NoAccess);
    else
      this.permissionLevel = PermissionLevel.NoAccess; 
  }

  has(level: PermissionLevel) {
    if (this.permissionLevel === level) return true;
    return (level & this.permissionLevel) !== 0;
  }

  setLevel(level: PermissionLevel) {
    throw new Error("Not yet implemented");
  }
}

export class HasFlagValueConverter {
  toView(value: number, flag: number): boolean {
    return value === flag || (value & flag) !== 0;
  }
}
