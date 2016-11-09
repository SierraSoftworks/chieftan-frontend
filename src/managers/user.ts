import {autoinject} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {UsersAPI, User} from "../api/users";
import {EnvironmentManager} from "./environments";
import * as Raven from "raven-js";

@autoinject
export class UserManager {
  constructor(private usersAPI: UsersAPI, private envs: EnvironmentManager, private eventAggregator: EventAggregator) {
    this.envs.subscribe(env => {
      this.user = null;
      this.updateUser();
    });
  }

  private _userPromise: Promise<User>;

  private _user: User;
  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
    this.eventAggregator.publish("user:updated", this._user);
  }

  get userPromise(): Promise<User> {
    return this._userPromise = this._userPromise || this.usersAPI.details().then(user => {
      this.user = user;
      return user;
    });
  }

  updateUser(): Promise<UserManager> {
    this._userPromise = this.usersAPI.details();
    
    return this._userPromise.then(user => {
      this.user = user;
      return this;
    }).catch(err => {
      Raven.captureException(err, {
        level: "error"
      });
      
      return this;
    });
  }
}
