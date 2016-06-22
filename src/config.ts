import {autoinject} from "aurelia-framework";
import {APIBase} from "./api/common";
import {StatusAPI} from "./api/status";
import {CodeSnippetConfig, CodeSnippetLanguage, CodeSnippetGenerators} from "./components/code-snippets";

@autoinject
export class ConfigView {
  constructor(protected api: APIBase, protected taskSnippets: CodeSnippetConfig, protected statusAPI: StatusAPI, protected snippets: CodeSnippetGenerators) {

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

  get exampleSnippet(): string {
    return this.snippets.get(this.taskSnippets.language.id).writeExample();
  }
}
