import {autoinject} from "aurelia-framework";
import {APIBase} from "./api/common";
import {StatusAPI} from "./api/status";
import {UsersAPI} from "./api/users";
import {UserManager} from "./managers/user";
import {CodeSnippetConfig, CodeSnippetLanguage, CodeSnippetGenerators} from "./components/code-snippets";

@autoinject
export class ConfigView {
  constructor(protected api: APIBase, protected taskSnippets: CodeSnippetConfig, protected statusAPI: StatusAPI, protected usersAPI: UsersAPI, protected snippets: CodeSnippetGenerators, private userManager: UserManager) {

  }

  languages: CodeSnippetLanguage[] = [{
    id: "bash",
    name: "Bash"
  }, {
    id: "powershell",
    name: "PowerShell"
  }];

  validateURL(url: string) {
    return this.statusAPI.test();
  }

  validateToken(token: string) {
    this.api.token = token;
    return this.userManager.updateUser();
  }

  get exampleSnippet(): string {
    return this.snippets.get(this.taskSnippets.language.id).writeExample();
  }
}
