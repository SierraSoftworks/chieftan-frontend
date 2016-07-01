import {autoinject} from "aurelia-framework";
import {APIBase} from "./common";
import {ProjectSummary} from "./projects";
import {ActionSummary} from "./actions";
import {TaskSummary} from "./tasks";

@autoinject
export class AuditAPI extends APIBase {
  log(): Promise<AuditLogEntry[]> {
    return this.http
      .createRequest("/audit")
      .asGet()
      .send()
      .then(res => this.handleResponse(res));
  }

  details(id: string): Promise<AuditLogEntry> {
    return this.http
      .createRequest(`/audit/${id}`)
      .asGet()
      .send()
      .then(res => this.handleResponse(res));
  }
}


export interface AuditLogEntry {
  id: string;
  type: string;
  timestamp: Date;

  context: AuditLogContext;
}

export interface AuditLogContext {
  project?: ProjectSummary;
  action?: ActionSummary;
  task?: TaskSummary;
  request: {};
}
