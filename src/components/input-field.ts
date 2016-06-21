import {bindable, computedFrom, bindingMode} from "aurelia-framework";

@bindable({
  name: "value",
  defaultBindingMode: bindingMode.twoWay,
  changeHandler: "valueChanged"
})
@bindable({
  name: "validText",
  attributeName: "valid-text"
})
@bindable({
  name: "invalidText",
  attributeName: "invalid-text"
})
export class InputField {
  @bindable label: string;
  value: string;
  @bindable placeholder: string;
  @bindable type: string = "text";
  @bindable valid: string|boolean|((value: string) => boolean) = null;
  @bindable disabled: boolean|string = false;
  @bindable multiline: boolean|string = false;
  @bindable require: boolean|string = false;
  validText: string = "right";
  invalidText: string = "wrong";

  focused: boolean = false;
  @bindable enter: () => void;

  private textarea: HTMLElement;
  private sizingDiv: HTMLElement;

  attached() {
    this.resizeMultiline(this.value);
  }

  @computedFrom("placeholder", "value", "focused")
  get active(): boolean {
    return !!(this.placeholder || this.value || this.focused);
  }

  @computedFrom("valid")
  get canValidate(): boolean {
    return typeof this.valid === "function" || typeof this.valid === "boolean";
  }

  @computedFrom("valid", "value")
  get validState(): string {
    if (!this.value) return "";
    if (typeof this.valid === "function") {
      let valid = (<(value: string) => boolean>this.valid)(this.value);
      if (typeof valid !== "boolean") return "";
      return valid ? "valid" : "invalid";
    } else if (typeof this.valid === "boolean") {
      if (this.valid) return "valid";
      return "invalid";
    } else if (typeof this.valid === "string") {
      if (this.valid === "false" || this.valid === "no") return "invalid";
      return "valid";
    }
  }

  onLabelFocused() {
    this.focused = true;
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (event.ctrlKey) return;

      event.preventDefault();
      this.enter && this.enter();
    }
  }

  valueChanged(newValue: string) {
    this.resizeMultiline(newValue);
  }

  private resizeMultiline(text: string) {
    if (!this.multiline) return;

    InputAreaSizingHelper.resizeToContent(text, $(this.textarea), $(this.sizingDiv));
  }
}

export class InputAreaSizingHelper {
  static resizeToContent(text: string, element: JQuery, sizingHelper: JQuery) {
    let fontFamily = element.css("font-family"),
        fontSize = element.css("font-size");

    fontFamily && sizingHelper.css("font-family", fontFamily);
    fontSize && sizingHelper.css("font-size", fontSize);

    sizingHelper.text(text || "");
    sizingHelper.html((sizingHelper.html() + "\n").replace(/\n/g, "<br>"));

    if (element.is(":visible"))
      sizingHelper.css("width", element.width());
    else
      sizingHelper.css("width", $(window).width() / 2);

    element.css("height", sizingHelper.height());
  }
}
