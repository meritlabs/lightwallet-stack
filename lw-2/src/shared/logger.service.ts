import { Injectable } from '@angular/core';

/**
 * this logger wraps standart console output, so we can store logs and show them to user.
 * also if you want to send logs somewhere, you should add functionality to this class
 */
@Injectable()
export class LoggerService {

  static LEVEL_ERROR = 0;
  static LEVEL_WARN  = 1;
  static LEVEL_INFO  = 2;
  static LEVEL_DEBUG = 3;

  static MAX_LOG_NUMBER = 100;

  private logs = [];

  private registerLog(level, messages) {
    this.logs.push({level: level, timestamp: Date.now(), arguments: messages});
    if (this.logs.length > LoggerService.MAX_LOG_NUMBER) this.logs.pop();
  }

  public getLogs(level = LoggerService.LEVEL_INFO) {
    return this.logs.filter((l) => {return (l.level <= level)});
  }

  public error(...messages) {
    this.registerLog(LoggerService.LEVEL_ERROR, messages);
    console.error.apply(console, messages);
  }

  public warn(...messages) {
    this.registerLog(LoggerService.LEVEL_WARN, messages);
    console.warn.apply(console, messages);
  }

  public info(...messages) {
    this.registerLog(LoggerService.LEVEL_INFO, messages);
    console.info.apply(console, messages);
  }

  public debug(...messages) {
    this.registerLog(LoggerService.LEVEL_DEBUG, messages);
    console.debug.apply(console, messages);
  }

   /**  alias -> info   */
  public log(...messages) {
    this.info(messages);
  }



}
