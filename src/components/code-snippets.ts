import {autoinject, Container} from "aurelia-framework";

export class CodeSnippetConfig {
  get language(): CodeSnippetLanguage {
    const configuredLanguageJSON = localStorage.getItem("language");
    if (configuredLanguageJSON) return JSON.parse(configuredLanguageJSON);
    return {
      id: "bash",
      name: "Bash"
    };
  }

  set language(language: CodeSnippetLanguage) {
    localStorage.setItem("language", JSON.stringify(language));
  }

  get multiline(): boolean {
    return localStorage.getItem("multiline") === "true";
  }

  set multiline(multiline: boolean) {
    localStorage.setItem("multiline", multiline ? "true" : "false");
  }
}

export interface CodeSnippetLanguage {
  id: string;
  name: string;
}

@autoinject
export abstract class CodeSnippetGenerator {
  constructor(protected config: CodeSnippetConfig) {

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

  abstract writeExample();
}

export class BashCodeSnippetGenerator extends CodeSnippetGenerator {
  private writeMap(vars: StringMap) {
    if (this.config.multiline) return `"${this.escape(JSON.stringify(vars, null, 2))}"`;
    return `"${this.escape(JSON.stringify(vars))}"`;
  }

  writeHttpRequest(method: string, url: string, vars: StringMap) {
    return [
      `TASK_URL="${this.escape(url)}"`,
      `TASK_DATA=${this.writeMap(vars)}`,
      `curl -s -X ${method} -H "Content-Type: application/json" -d "$TASK_DATA" $TASK_URL`
    ].join("\n");
  }

  writeExample() {
    return [
      `CHIEFTAN="Cool shit"`,
      ...[`if [ "$CHIEFTAN" == "Cool shit"]; then`,
      `  echo "*drops mic*"`,
      `fi`].reduce((lines, line) => this.config.multiline ? lines.push(line) && lines : [`${(lines[0] ? `${lines[0]}; ` : "")}${line.trim()}`], [])
    ].join("\n");
  }
}

export class PowerShellCodeSnippetGenerator extends CodeSnippetGenerator {
  private indent(lines: string[]) {
    if (!this.config.multiline) return lines;
    return lines.map(line => `  ${line}`);
  }

  private writeMap(vars: StringMap) {
    const entries = Object.keys(vars).map(key => {
      if (typeof vars[key] === "string") return `"${key}" = "${vars[key]}";`;
      return `"${key}" = ${this.indent(this.writeMap(<StringMap>vars[key]).split("\n")).join(this.config.multiline ? "\n" : "").trim()};`
    });

    return [
      "@{",
      ...this.indent(entries),
      "}"
    ].join(this.config.multiline ? "\n" : "");
  }

  writeHttpRequest(method: string, url: string, vars: StringMap) {
    return [
      `$TASKS_URL="${url}"`,
      `$TASK_DATA=${this.writeMap(vars)}`,
      `Invoke-RestMethod -Method ${method} -Header @{ "Content-Type" = "application/json" } -Body (ConvertTo-Json $TASK_DATA) $TASKS_URL`
    ].join("\n");
  }

  writeExample() {
    return [
      `$CHIEFTAN = "Cool shit"`,
      ...[`if ($CHIEFTAN -eq "Cool shit") {`,
      `  Write-Host "*drops mic*"`,
      `}`].reduce((lines, line) => this.config.multiline ? lines.push(line) && lines : [`${(lines[0] ? `${lines[0]}; ` : "")}${line.trim()}`], [])
    ].join("\n");
  }
}

interface StringMap {
  [name: string]: string|StringMap;
}

@autoinject
export class CodeSnippetGenerators {
  constructor(protected container: Container) {

  }

  generators: {
    [lang: string]: CodeSnippetGenerator
  } = {
    bash: this.container.get(BashCodeSnippetGenerator),
    powershell: this.container.get(PowerShellCodeSnippetGenerator)
  } 

  get(language: string) {
    return this.generators[language];
  }
}