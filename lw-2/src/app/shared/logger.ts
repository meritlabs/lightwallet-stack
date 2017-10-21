import { Injectable } from '@angular/core';



@Injectable()
export class Logger {

  static LEVEL_ERROR = 0;
  static LEVEL_WARN  = 1;
  static LEVEL_INFO  = 2;
  static LEVEL_DEBUG = 3;

  private logs = [];

  public getLogs(level = Logger.LEVEL_INFO) {
    return this.logs.filter((l) => {return (l.level <= level)});
  }

  public error(...messages) {
    this.logs.push({level: Logger.LEVEL_ERROR, timestamp: Date.now(), arguments: messages});
    console.error.apply(console, messages);
  }

  public warn(...messages) {
    this.logs.unshift({ level: Logger.LEVEL_WARN,  timestamp: Date.now(), arguments: messages });
    console.warn.apply(console, messages);
  }

  public info(...messages) {
    this.logs.unshift({level: Logger.LEVEL_INFO,  timestamp: Date.now(), arguments: messages});
    console.info.apply(console, messages);
  }

  public debug(...messages) {
    this.logs.unshift({level: Logger.LEVEL_DEBUG, timestamp: Date.now(), arguments: messages});
    console.debug.apply(console, messages);
  }

   /**  alias -> info   */
  public log(...messages) {
    this.info(messages);
  }



}
