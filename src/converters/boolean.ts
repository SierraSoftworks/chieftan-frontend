export class BooleanValueConverter {
  toView(value: string|boolean) {
    if (typeof value === "boolean") return value;
    return value === "true";
  }
}
