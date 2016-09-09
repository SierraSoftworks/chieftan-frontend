import {inject, customAttribute} from "aurelia-framework";
import {DOM} from "aurelia-pal";
import * as $ from "jquery";

@inject(DOM.Element)
@customAttribute("dropdown")
export class DropdownAttribute {
  constructor(element: Element) {
    this.activator = $(element);
    this.dropdown = this.activator.siblings(".dropdown-content");
  }

  protected activator: JQuery;
  protected dropdown: JQuery;

  attached() {
    this.activator.on("click", this.activatorClickHandler);
    this.dropdown.on("click", this.dropdownClickHandler);
  }

  detached() {
    this.activator.off("click", this.activatorClickHandler);
    this.activator.off("click", this.dropdownClickHandler);
  }

  private activatorClickHandler(this: Element, e: JQueryMouseEventObject) {
    $(this).siblings(".dropdown-content").toggleClass("active");
  }

  private dropdownClickHandler(this: Element, e: JQueryMouseEventObject) {
    $(this).removeClass("active");
  }
}
