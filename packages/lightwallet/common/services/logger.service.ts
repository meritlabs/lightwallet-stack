import { Injectable } from '@angular/core';

const LOGGING_ENABLED = true;
const TRACE_ENABLED = false;

export enum LogLevel {
  ERROR = 0,
  WARN,
  INFO,
  DEBUG,
}

declare const process: any;

@Injectable()
export class LoggerService {
  private logs = [];

  getLogs(level = LogLevel.INFO) {
    return this.logs.filter(l => l.level <= level);
  }

  error(...messages) {
    this.logs.push({ level: LogLevel.ERROR, timestamp: Date.now(), arguments: messages });
    if (!LOGGING_ENABLED) return;
    console.error.apply(console, messages);
    if (TRACE_ENABLED) console.trace();
  }

  warn(...messages) {
    this.logs.unshift({ level: LogLevel.WARN, timestamp: Date.now(), arguments: messages });
    if (!LOGGING_ENABLED) return;
    console.warn.apply(console, messages);
    if (TRACE_ENABLED) console.trace();
  }

  info(...messages) {
    this.logs.unshift({ level: LogLevel.INFO, timestamp: Date.now(), arguments: messages });
    if (!LOGGING_ENABLED) return;
    console.info.apply(console, messages);
  }

  debug(...messages) {
    this.logs.unshift({ level: LogLevel.DEBUG, timestamp: Date.now(), arguments: messages });
    if (!LOGGING_ENABLED) return;
    console.debug.apply(console, messages);
  }

  /**  alias -> info   */
  log(...messages) {
    this.info(messages);
  }
}
