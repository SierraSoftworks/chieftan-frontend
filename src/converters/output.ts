export class OutputValueConverter {
  toView(output: string): string {
    return output.replace(/::\[(\w+)\] ?(.*?)::/g, (entry: string, type: "info" | "warning" | "error", message: string) => {
      return `<br/><span class="${type.replace(`"`, ``)}">${message.replace(`<`, `&lt;`).replace(`>`, `&gt;`)}</span><br/>`;
    });
  }
}
