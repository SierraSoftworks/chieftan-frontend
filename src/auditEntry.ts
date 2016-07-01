import {autoinject} from "aurelia-framework";
import {AuditAPI, AuditLogEntry} from "./api/audit";

@autoinject
export class AuditEntryView {
  constructor(protected auditAPI: AuditAPI) {

  }

  entry: AuditLogEntry = null;

  activate(params: { id: string; }) {
    return this.auditAPI.details(params.id).then(entry => this.entry = entry);
  }
}
