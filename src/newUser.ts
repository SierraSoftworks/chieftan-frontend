import {autoinject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {UsersAPI, NewUser} from "./api/users";

@autoinject
export class NewUserView {
  constructor(private usersAPI: UsersAPI, protected router: Router) {

  }

  user: NewUser = {
    name: "",
    email: "",
    permissions: []
  };

  error: Error = null;

  create() {
    this.usersAPI.create(this.user).then(user => {
      this.router.navigateToRoute("user", { id: user.id });
    }, err => this.error = err);
  }

  validateName(name: string) {
    return !!name && /^\w+ (\w+)+$/.test(name);
  }

  validateEmail(email: string) {
    return !!email && /^.+@.*\.\w+$/.test(email);
  }
}
