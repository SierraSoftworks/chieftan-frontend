import {Binding, Scope, bindingBehavior, noView} from "aurelia-framework";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {UserManager} from "../managers/user";
import {User} from "../api/users";
import {HasPermission} from "../managers/permissions";

@bindingBehavior("hasPermission")
export class HasPermissionBindingBehaviour {
  constructor(private events: EventAggregator, private userManager: UserManager) {
    
  }

  private userChangeHandler: Subscription;

  bind(binding: Binding, scope: Scope, context: { [id: string]: string; } = {}) {
    let permission: string = null;

    const updateTarget = binding[`hasPermission:updateTarget`] = binding.updateTarget;
    binding.updateTarget = (p: string) => {
      permission = p;
      updateTarget.call(binding, HasPermission(this.userManager.user, permission, context || {}))
    }

    this.userChangeHandler = this.events.subscribe("user:updated", (user: User) => {
      updateTarget.call(binding, HasPermission(user, permission, context || {}));
    });
  }

  unbind(binding: Binding, scope: Scope) {
    this.userChangeHandler.dispose();
    binding.updateTarget = binding["hasPermission:updateTarget"];
  }
}

@bindingBehavior("missingPermission")
export class MissingPermissionBindingBehaviour {
  constructor(private events: EventAggregator, private userManager: UserManager) {
    
  }

  private userChangeHandler: Subscription;

  bind(binding: Binding, scope: Scope, context: { [id: string]: string; } = {}) {
    let permission: string = null;

    const updateTarget = binding[`missingPermission:updateTarget`] = binding.updateTarget;
    binding.updateTarget = (p: string) => {
      permission = p;
      updateTarget.call(binding, !HasPermission(this.userManager.user, permission, context || {}))
    }

    this.userChangeHandler = this.events.subscribe("user:updated", (user: User) => {
      updateTarget.call(binding, !HasPermission(user, permission, context || {}));
    });
  }

  unbind(binding: Binding, scope: Scope) {
    this.userChangeHandler.dispose();
    binding.updateTarget = binding["missingPermission:updateTarget"];
  }
}

