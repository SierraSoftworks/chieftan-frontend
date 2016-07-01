import {autoinject} from "aurelia-framework";
import {UsersAPI, User} from "./api/users";

@autoinject
export class UserView {
  constructor(private usersAPI: UsersAPI) {

  }

  user: User = null;
  tokens: string[] = [];

  activate(params: { id: string; }) {
    return Promise.all([
      this.usersAPI.details(params.id).then(user => {
        this.user = user;
      }),
      this.usersAPI.tokens(params.id).then(tokens => {
        this.tokens = tokens;
      })
    ]);
  }
}
