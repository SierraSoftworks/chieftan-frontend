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
    return generator.writeHttpRequest("POST", `${this.api.url}/api/v1/action/${this.action.id}/tasks`, {
      vars: this.action.vars,
      metadata: {
        description: "A new task",
        url: "http://github.com/SierraSoftworks"
      }
    });
  }
}
