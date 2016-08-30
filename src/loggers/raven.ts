import * as Log from "aurelia-logging";
import * as Raven from "raven-js";

export class RavenLogAppender implements Log.Appender {
  constructor() {
    if (!console) return;

    if (!console.trace) {
      console.log("WARNING");
      console.log("This is not meant to be used by customers.");
      console.log("If someone has asked you to run anything here, they may gain access to your account.");
    } else {
      let cssHeading = "color: red; font-size: 40px; font-weight: bold;"
      let cssDefault = "color: red; font-weight: bold";
      console.log("%cWARNING", cssHeading);
      console.log("%cThis is not meant to be used by customers.", cssDefault);
      console.log("%cIf someone has asked you to run anything here, they may gain access to your account.", cssDefault);
    }
  }

  /**
    * Appends a debug log.
    *
    * @param logger The source logger.
    * @param rest The data to log.
    */
  debug(logger: Log.Logger, ...rest: any[]);
  debug(logger: Log.Logger, message: string, ...rest: any[]): void {
    this.log(message, {
      level: "debug",
      logger: logger.id,
      extra: Object.assign({}, ...rest)
    });
  }

  /**
    * Appends an info log.
    *
    * @param logger The source logger.
    * @param rest The data to log.
    */
  info(logger: Log.Logger, ...rest: any[]);
  info(logger: Log.Logger, message: string, ...rest: any[]): void {
    this.log(message, {
      level: "info",
      logger: logger.id,
      extra: Object.assign({}, ...rest)
    });
  }

  /**
    * Appends a warning log.
    *
    * @param logger The source logger.
    * @param rest The data to log.
    */
  warn(logger: Log.Logger, ...rest: any[]);
  warn(logger: Log.Logger, message: string, ...rest: any[]): void {
    this.log(message, {
      level: "warn",
      logger: logger.id,
      extra: Object.assign({}, ...rest)
    });
  }

  /**
    * Appends an error log.
    *
    * @param logger The source logger.
    * @param rest The data to log.
    */
  error(logger: Log.Logger, ...rest: any[]);
  error(logger: Log.Logger, message: string, ...rest: any[]): void {
    this.log(message, {
      level: "error",
      logger: logger.id,
      extra: Object.assign({}, ...rest)
    });
  }

  log(message: string|Error, context: {
    level: string;
    logger?: string;
    extra?: {};
    tags?: { [id: string]: string; };
  }) {
    let log = (message: string, ...data: any[]) => {};

    let cssDefault = "color: black; font-weight: normal;";
    let cssLevel = "color: blue; font-weight: normal;";
    let cssLogger = "color: black; font-weight: bold;";

    switch(context.level) {
      case "debug":
        log = console && console.log.bind(console);
        cssLevel = "color: gray; font-weight: normal;";
        break;
      case "info":
        log = console && console.log.bind(console);
        cssLevel = "color: blue; font-weight: normal;";
        break;
      case "warn":
        log = console && console.warn.bind(console);
        cssLevel = "color: orange; font-weight: normal;";
        break;
      case "error":
      case "fatal":
        log = console && console.error.bind(console);
        cssLevel = "color: red; font-weight: normal;";
        break;
      default:
        log = console && console.log.bind(console);
        break;
    }

    if (console.trace)
      log(`%c${context.level.toUpperCase()} %c[%c${context.logger}%c] ${message}`, cssLevel, cssDefault, cssLogger, cssDefault, context.extra);
    else
      log(`${context.level.toUpperCase()} [${context.logger}] ${message}`, context.extra);

    if(typeof message === "string")
      Raven.captureMessage(message, context);
    else
      Raven.captureException(message, context);
  }
}
