export class JsonValueConverter {
  toView(value: any, spaces: number = 2): string {
    return JSON.stringify(value, null, spaces);
  }

  fromView(value: string): any {
    try {
      return JSON.parse(value);
    } catch(err) {
      return null;
    }
  }
}
