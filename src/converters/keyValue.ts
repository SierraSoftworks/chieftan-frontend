export class KeyValueValueConverter {
  toView<T>(value: { [key: string]: T }): { key: string; value: T; }[] {
    const output: { key: string; value: T; }[] = [];
    for(let key in value) {
      output.push({ key, value: value[key] });
    }

    return output;
  }
}
