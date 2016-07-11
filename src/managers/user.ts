import {autoinject} from "aurelia-framework";
import {UsersAPI, User} from "../api/users";
import * as Raven from "raven-js";

@autoinject
export class UserManager {
  constructor(private usersAPI: UsersAPI) {

  }

  private _user: User;
  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
    Raven.setUserContext(user && {
      id: user.id,
      email: user.email,
      username: user.name
    } || null);
  }

  updateUser(): Promise<UserManager> {
    return this.usersAPI.details().then(user => {
      this.user = user;
      return this;
    });
  }
}
