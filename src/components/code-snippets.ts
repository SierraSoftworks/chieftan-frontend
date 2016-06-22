export class CodeSnippetGenerators {
  generators: {
    [lang: string]: CodeSnippetGenerator
  } = {
    bash: new BashCodeSnippetGenerator(),
    powershell: new PowerShellCodeSnippetGenerator()
  } 

  get(language: string) {
    return this.generators[language];
  }
}

export abstract class CodeSnippetGenerator {
  constructor(public multiline: boolean = true) {

  }

  protected escapeCharacter: string = "\\";

  protected escapeWith(value: string, escapeChar: string = "\\", ...against: string[]) {
    if (!against.length) against = [`"`];

    return against.reduce(
      (value, escape) => value.replace(new RegExp(escape, "g"), `${escapeChar}${escape}`),
      value.replace(new RegExp(escapeChar.replace("\\", "\\\\").replace("/", "\\/"), "g"), `${escapeChar}${escapeChar}`)
    );
  }

  protected escape(value: string, ...against: string[]) {
    return this.escapeWith(value, this.escapeCharacter, ...against);
  }

  abstract writeHttpRequest(method: string, url: string, vars: StringMap);
}

export class BashCodeSnippetGenerator extends CodeSnippetGenerator {
  private writeMap(vars: StringMap) {
    if (this.multiline) return `"${this.escape(JSON.stringify(vars, null, 2))}"`;
    return `"${this.escape(JSON.stringify(vars))}"`;
  }

  writeHttpRequest(method: string, url: string, vars: StringMap) {
    return [
      `TASK_URL="${this.escape(url)}"`,
      `TASK_DATA=${this.writeMap(vars)}`,
      `curl -s -X ${method} -H "Content-Type: application/json" -d "$TASK_DATA" $TASK_URL`
    ].join("\n");
  }
}

export class PowerShellCodeSnippetGenerator extends CodeSnippetGenerator {
  private indent(lines: string[]) {
    if (!this.multiline) return lines;
    return lines.map(line => `  ${line}`);
  }

  private writeMap(vars: StringMap) {
    const entries = Object.keys(vars).map(key => {
      if (typeof vars[key] === "string") return `"${key}" = "${vars[key]}";`;
      return `"${key}" = ${this.indent(this.writeMap(<StringMap>vars[key]).split("\n")).join(this.multiline ? "\n" : "").trim()};`
    });

    return [
      "@{",
      ...this.indent(entries),
      "}"
    ].join(this.multiline ? "\n" : "");
  }

  writeHttpRequest(method: string, url: string, vars: StringMap) {
    return [
      `$TASKS_URL="${url}"`,
      `$TASK_DATA=${this.writeMap(vars)}`,
      `Invoke-RestMethod -Method ${method} -Header @{ "Content-Type" = "application/json" } -Body (ConvertTo-Json $TASK_DATA) $TASKS_URL`
    ].join("\n");
  }
}

interface StringMap {
  [name: string]: string|StringMap;
}
