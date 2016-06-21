import {autoinject, bindable, bindingMode} from "aurelia-framework";

@autoinject
@bindable({
  name: "value",
  defaultBindingMode: bindingMode.twoWay
})
@bindable({
  name: "changed",
  defaultBindingMode: bindingMode.oneTime
})
@bindable({
  name: "offLabel",
  attributeName: "off-label"
})
@bindable({
  name: "onLabel",
  attributeName: "on-label"
})
export class Switch {

  value: boolean = false;

  offLabel: string = "off";
  onLabel: string = "on";

  changed: () => void;

  valueChanged() {
    this.changed && this.changed();
  }
}
