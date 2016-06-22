import {autoinject} from "aurelia-framework";
import {APIBase} from "./api/common";
import {StatusAPI} from "./api/status";

@autoinject
export class ConfigView {
  constructor(protected api: APIBase, protected statusAPI: StatusAPI) {

  }

  languages: {
    id: string;
    name: string;
  }[] = [{
    id: "bash",
    name: "Bash"
  }, {
    id: "powershell",
    name: "PowerShell"
  }];

  language = this.languages[0];

  validateURL(url: string) {
    return this.statusAPI.test();
  }
}
