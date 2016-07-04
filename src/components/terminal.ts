import {bindable, bindingMode} from "aurelia-framework";
import * as hljs from "highlightjs/highlight.pack";

export class Terminal {
  @bindable name: string;
  @bindable design: string = "bash";
  @bindable value: string = "";
  @bindable language: string;
  @bindable rawValue: string = "";

  valueChanged() {
    this.updateDisplay();
  }

  languageChanged() {
    this.updateDisplay();
  }

  updateDisplay() {
    const result = this.language ? hljs.highlight(this.language, this.value) : hljs.highlightAuto(this.value);
    this.rawValue = result.value;

    if (!this.language) this.language = result.language;
  }
}
