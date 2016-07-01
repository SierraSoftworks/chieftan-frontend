import {autoinject} from "aurelia-framework";
import {AuditAPI, AuditLogEntry} from "./api/audit";

@autoinject
export class AuditView {
  constructor(protected auditAPI: AuditAPI) {

  }

  log: AuditLogEntry[] = [];

  activate() {
    return this.auditAPI.log().then(log => this.log = log);
  }
}
