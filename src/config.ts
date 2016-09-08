import {autoinject} from "aurelia-framework";
import {APIBase} from "./api/common";
import {StatusAPI} from "./api/status";
import {UsersAPI} from "./api/users";
import {UserManager} from "./managers/user";
import {EnvironmentManager} from "./managers/environments";
import {CodeSnippetConfig, CodeSnippetLanguage, CodeSnippetGenerators} from "./components/code-snippets";

@autoinject
export class ConfigView {
  constructor(protected api: APIBase, protected taskSnippets: CodeSnippetConfig, protected statusAPI: StatusAPI, protected usersAPI: UsersAPI, protected snippets: CodeSnippetGenerators, private userManager: UserManager, protected envs: EnvironmentManager) {

  }

  languages: CodeSnippetLanguage[] = [{
    id: "bash",
    name: "Bash"
  }, {
    id: "powershell",
    name: "PowerShell"
  }];

  validateName(name: string) {
    return !!name;
  }

  validateURL(url: string) {
    return /^(?:https?):\/\/(?:[\w@][\w.:@]+)\/?[\w\.%\-/]*$/.test(url || "");
  }

  validateToken(token: string) {
    return /^[a-f0-9]{32}$/.test(token || "");
  }

  get exampleSnippet(): string {
    return this.snippets.get(this.taskSnippets.language.id).writeExample();
  }

  newEnvironment() {
    const env = {
      name: "New Environment",
      url: `${window.location.protocol}//${window.location.host}/`,
      token: ""
    };

    this.envs.environments.push(env);
    this.envs.active = env;
  }

  saveEnvironments() {
    this.envs.save();
  }
}
