import { Injectable } from '@angular/core';
import * as _ from 'lodash';

const LOGGING_ENABLED = true;
const TRACE_ENABLED = false;

@Injectable()
export class Logger {

  static LEVEL_ERROR = 0;
  static LEVEL_WARN = 1;
  static LEVEL_INFO = 2;
  static LEVEL_DEBUG = 3;

  private logs = [];

  private isNode(): boolean {
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
  }

  private inspectObjectForNode(...messages): any[] {
    // We nede to inspect objects to provide proper output in node console logs.
    const util = require('util');
    return _.map(messages, (message) => {
      if (message instanceof Object) {
        return util.inspect(message, false, 3);
      }
      return message;
    })
  }

  getLogs(level = Logger.LEVEL_INFO) {
    return this.logs.filter(l => l.level <= level);
  }

  error(...messages) {
    if (!LOGGING_ENABLED) return;
    if (this.isNode) {
      messages = this.inspectObjectForNode(...messages);
    }
    this.logs.push({ level: Logger.LEVEL_ERROR, timestamp: Date.now(), arguments: messages });
    console.error.apply(console, messages);
    if (TRACE_ENABLED)
      console.trace();
  }

  warn(...messages) {
    if (!LOGGING_ENABLED) return;
    if (this.isNode) {
      messages = this.inspectObjectForNode(...messages);
    }
    this.logs.unshift({ level: Logger.LEVEL_WARN, timestamp: Date.now(), arguments: messages });
    console.warn.apply(console, messages);
    if (TRACE_ENABLED)
      console.trace();
  }

  info(...messages) {
    if (!LOGGING_ENABLED) return;
    if (this.isNode) {
      messages = this.inspectObjectForNode(...messages);
    }
    this.logs.unshift({ level: Logger.LEVEL_INFO, timestamp: Date.now(), arguments: messages });
    console.info.apply(console, messages);
    if (TRACE_ENABLED)
      console.trace();
  }

  debug(...messages) {
    if (!LOGGING_ENABLED) return;
    if (this.isNode) {
      messages = this.inspectObjectForNode(...messages);
    }
    this.logs.unshift({ level: Logger.LEVEL_DEBUG, timestamp: Date.now(), arguments: messages });
    console.debug.apply(console, messages);
    if (TRACE_ENABLED)
      console.trace();
  }

  /**  alias -> info   */
  log(...messages) {
    if (!LOGGING_ENABLED) return;
    if (this.isNode) {
      messages = this.inspectObjectForNode(...messages);
    }
    this.info(messages);
  }

}
