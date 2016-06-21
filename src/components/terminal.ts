import {bindable, bindingMode} from "aurelia-framework";

export class Terminal {
  @bindable name: string;
  @bindable style: string = "bash";
  @bindable value: string = "";
}
