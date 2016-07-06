import {autoinject, bindable, bindingMode, computedFrom} from "aurelia-framework";

@autoinject
@bindable({
  name: "value",
  defaultBindingMode: bindingMode.twoWay
})
export class SelectBox<T> {
  constructor() {

  }

  value: T;
  @bindable options: T[];
  @bindable filter: string;
  @bindable placeholder: string = "Select an option";
  @bindable match: (item: T, filter: string) => boolean = null;;

  highlightIndex: number = null;
  active: boolean = false;

  @computedFrom("options", "filter")
  get availableOptions(): T[] {
    if (!this.filter) return this.options;
    return this.options.filter(item => this.match && this.match(item, this.filter) || !!~JSON.stringify(item).indexOf(this.filter));
  }

  open() {
    this.active = true;
  }

  close() {
    this.active = false;
  }

  toggle() {
    if (this.active) this.close();
    else this.open();
  }

  selectItem(item: T) {
    this.value = item;
    this.close();
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key) {
      switch(e.key) {
        case "Enter":
          if(this.highlightIndex !== null)
            this.selectItem(this.availableOptions[this.highlightIndex]);
          e.preventDefault();
          break;
        case "ArrowUp":
          this.moveHighlightUp();
          e.preventDefault();
          break;
        case "ArrowDown":
          this.moveHighlightDown();
          e.preventDefault();
          break;
        default:
          this.highlightIndex = null;
          break;
      }
    } else {
      switch(e.keyCode) {
        case 13:
          if(this.highlightIndex !== null)
            this.selectItem(this.availableOptions[this.highlightIndex]);
          e.preventDefault();
          break;
        case 38:
          this.moveHighlightUp();
          e.preventDefault();
          break;
        case 40:
          this.moveHighlightDown();
          e.preventDefault();
          break;
        default:
          this.highlightIndex = null;
          break;
      }
    }
  }

  private moveHighlightUp() {
    if (this.highlightIndex === null) return this.highlightIndex = 0;
    this.highlightIndex = Math.max(this.highlightIndex - 1, 0);
  }

  private moveHighlightDown() {
    if (!this.options) return;
    if (this.options.length == 0) return;
    if (this.highlightIndex === null) return this.highlightIndex = 0;
    this.highlightIndex = Math.min(this.highlightIndex + 1, this.options.length - 1);
  }
}
