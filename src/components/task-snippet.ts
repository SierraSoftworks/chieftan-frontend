import {autoinject, bindable, computedFrom} from "aurelia-framework";
import {Action} from "../api/actions";
import {CodeSnippetGenerators} from "./code-snippets";
import {APIBase} from "../api/common";

@autoinject
export class TaskSnippet {
  constructor(private api: APIBase, private generators: CodeSnippetGenerators) {

  }

  @bindable action: Action;

  multiline: boolean = false;
  language: string = "bash";

  @computedFrom("multiline", "action", "language")
  get codeSnippet(): string {
    const generator = this.generators.get(this.language);
    generator.multiline = this.multiline;

    const vars = Object.assign({}, this.action.vars);
    for(var k in vars) {
      if (vars[k]) delete vars[k];
    }

    return generator.writeHttpRequest("POST", `${this.api.url}/api/v1/action/${this.action.id}/tasks`, {
      vars: vars,
      metadata: {
        description: this.action.description,
        url: this.action.project.url
      }
    });
  }
}
