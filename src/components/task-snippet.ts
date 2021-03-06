import {autoinject, bindable, computedFrom} from "aurelia-framework";
import {Action} from "../api/actions";
import {CodeSnippetGenerators, CodeSnippetConfig} from "./code-snippets";
import {EnvironmentManager} from "../managers/environments";

@autoinject
export class TaskSnippet {
  constructor(private config: CodeSnippetConfig, private envs: EnvironmentManager, private generators: CodeSnippetGenerators) {

  }

  @bindable action: Action;

  get codeSnippet(): string {
    const generator = this.generators.get(this.config.language.id);

    const vars = Object.assign({}, this.action.vars);
    for(var k in vars) {
      if (vars[k]) delete vars[k];
    }

    return generator.writeHttpRequest("POST", `${this.envs.active.url}/api/v1/action/${this.action.id}/tasks`, {
      Authorization: `Token ${this.envs.active.token}`
    }, {
      vars: vars,
      metadata: {
        description: this.action.description,
        url: this.action.project.url
      }
    });
  }
}
