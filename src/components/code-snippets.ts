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

  abstract writeRequest(method: string, url: string, vars: StringMap);
}

export class BashCodeSnippetGenerator extends CodeSnippetGenerator {
  private writeVariable(name: string) {
    return `<span class="variable">"$${name}"</span>`;
  }

  private writeMap(vars: { [name: string]: string; }) {
    return JSON.stringify(vars, null, this.multiline ? 2 : 0)
  }

  private writeVariableInit(name: string, vars: any) {
    let value: string;
    if (typeof vars === "string") value = `"${vars}"`;
    else value = this.writeMap(vars);

    return `<span class="variable">${name}</span>=${this.writeValue(value)}`;
  }

  private writeExecutable(name: string) {
    return `<span class="executable">${name}</span>`;
  }

  private writeSwitch(name: string) {
    return `<span class="arg">${name}</span>`;
  }

  private writeValue(value: string) {
    let quoteSymbol = "'";
    if (~value.indexOf("$")) quoteSymbol = '"';
    if (~value.indexOf(" ")) value = `${quoteSymbol}${value.replace(quoteSymbol, `\\${quoteSymbol}`)}${quoteSymbol}`;
    return `<span class="value">${value}</span>`;
  }

  private writeArgument(name: string, value: string) {
    return `${this.writeSwitch(name)} ${this.writeValue(value)}`;
  }

  writeRequest(method: string, url: string, vars: StringMap) {
    return [
      `${this.writeVariableInit("TASKS_URL", url)}`,
      `${this.writeVariableInit("TASK_DATA", vars)}`,
      `${this.writeExecutable("curl")} ${this.writeArgument("-X", method)} ${this.writeArgument("-H" ,"Content-Type: application/json")} ${this.writeSwitch("-d")} ${this.writeVariable("TASK_DATA")} ${this.writeVariable("TASKS_URL")}`
    ].join("\n");
  }
}

export class PowerShellCodeSnippetGenerator extends CodeSnippetGenerator {
  private writeVariable(name: string) {
    return `<span class="variable">$${name}</span>`;
  }

  private indent(lines: string[]) {
    if (!this.multiline) return lines;
    return lines.map(line => `  ${line}`);
  }

  private writeMap(vars: StringMap) {
    const entries = Object.keys(vars).map(key => {
      if (typeof vars[key] === "string") return `"${key}" = "${vars[key]}";`;
      return `"${key}" = ${this.indent(this.writeMap(<StringMap>vars[key]).split("\n")).join(this.multiline ? "\n" : "")};`
    });

    return [
      "@{",
      ...this.indent(entries),
      "}"
    ].join(this.multiline ? "\n" : "");
  }

  private writeVariableInit(name: string, vars: any) {
    let value: string;
    if (typeof vars === "string") value = `"${vars}"`;
    else value = this.writeMap(vars);

    return `<span class="variable">$${name}</span> = ${this.writeValue(value)}`;
  }

  private writeExecutable(name: string) {
    return `<span class="executable">${name}</span>`;
  }

  private writeSwitch(name: string) {
    return `<span class="arg">${name}</span>`;
  }

  private writeValue(value: string) {
    if (!value.indexOf("@")) return `<span class="value">${value}</span>`;
    if (!value.indexOf("(")) return `<span class="value">${value}</span>`;
    if (!value.indexOf("$") && !~value.indexOf(" ")) return this.writeVariable(value.substr(1));

    let quoteSymbol = "'";
    if (~value.indexOf("$")) quoteSymbol = '"';
    if (~value.indexOf(" ")) value = `${quoteSymbol}${value.replace(quoteSymbol, `\\${quoteSymbol}`)}${quoteSymbol}`;
    return `<span class="value">${value}</span>`;
  }

  private writeArgument(name: string, value: string) {
    return `${this.writeSwitch(name)} ${this.writeValue(value)}`;
  }

  writeRequest(method: string, url: string, vars: StringMap) {
    return [
      `${this.writeVariableInit("TASKS_URL", url)}`,
      `${this.writeVariableInit("TASK_DATA", vars)}`,
      `${this.writeExecutable("Invoke-RestMethod")} ${this.writeArgument("-Method", method)} ${this.writeArgument("-Header" ,`@{ "Content-Type" = "application/json" }`)} ${this.writeArgument("-Body", "(ConvertTo-Json $TASK_DATA)")} ${this.writeVariable("TASKS_URL")}`
    ].join("\n");
  }
}

interface StringMap {
  [name: string]: string|StringMap;
}
