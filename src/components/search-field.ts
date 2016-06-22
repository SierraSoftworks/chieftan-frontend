import {bindable, bindingMode} from "aurelia-framework";

@bindable({
  name: "value",
  defaultBindingMode: bindingMode.twoWay
})
@bindable({
  name: "focused",
  defaultBindingMode: bindingMode.twoWay
})
export class SearchField {
  value: string;
  @bindable placeholder: string;
  focused: boolean = false;

  close() {
    this.focused = false;
    this.value = "";
  }
}
