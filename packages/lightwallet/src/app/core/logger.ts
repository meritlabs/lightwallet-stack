import { Injectable } from '@angular/core';

const LOGGING_ENABLED = false;
const TRACE_ENABLED = false;

declare const process: any;

@Injectable()
export class Logger {

  static LEVEL_ERROR = 0;
  static LEVEL_WARN = 1;
  static LEVEL_INFO = 2;
  static LEVEL_DEBUG = 3;

  private logs = [];

  getLogs(level = Logger.LEVEL_INFO) {
    return this.logs.filter(l => l.level <= level);
  }

  error(...messages) {
    if (!LOGGING_ENABLED) return;
    this.logs.push({ level: Logger.LEVEL_ERROR, timestamp: Date.now(), arguments: messages });
    console.error.apply(console, messages);
    if (TRACE_ENABLED)
      console.trace();
  }

  warn(...messages) {
    if (!LOGGING_ENABLED) return;
    this.logs.unshift({ level: Logger.LEVEL_WARN, timestamp: Date.now(), arguments: messages });
    console.warn.apply(console, messages);
    if (TRACE_ENABLED)
      console.trace();
  }

  info(...messages) {
    if (!LOGGING_ENABLED) return;
    this.logs.unshift({ level: Logger.LEVEL_INFO, timestamp: Date.now(), arguments: messages });
    console.info.apply(console, messages);
  }

  debug(...messages) {
    if (!LOGGING_ENABLED) return;
    this.logs.unshift({ level: Logger.LEVEL_DEBUG, timestamp: Date.now(), arguments: messages });
    console.debug.apply(console, messages);
  }

  /**  alias -> info   */
  log(...messages) {
    if (!LOGGING_ENABLED) return;
    this.info(messages);
  }
}

