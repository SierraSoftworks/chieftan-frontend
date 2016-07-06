import {autoinject} from "aurelia-framework";
import {APIBase} from "./common";
import {ProjectSummary} from "./projects";
import {ActionSummary} from "./actions";

@autoinject
export class StatusAPI extends APIBase {
  test(): Promise<any> {
    return this.http
      .createRequest("/status")
      .asGet()
      .send()
      .then(res => this.handleResponse(res));
  }
}
