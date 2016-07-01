import {autoinject} from "aurelia-framework";
import {UsersAPI, User} from "./api/users";

@autoinject
export class UsersView {
  constructor(private usersAPI: UsersAPI) {

  }

  users: User[] = [];

  activate() {
    return this.usersAPI.list().then(users => {
      this.users = users;
    });
  }
}
