import * as _ from 'lodash';
let DEFAULT_LOG_LEVEL = 'silent';

/**
 * @desc
 * A simple logger that wraps the <tt>console.log</tt> methods when available.
 *
 * Usage:
 * <pre>
 *   log = new Logger('merit');
 *   log.setLevel('info');
 *   log.debug('Message!'); // won't show
 *   log.setLevel('debug');
 *   log.debug('Message!', 1); // will show '[debug] merit: Message!, 1'
 * </pre>
 *
 * @param {string} name - a name for the logger. This will show up on every log call
 * @constructor
 */

export interface LoggerWithLevels {
  silent(message: string, ...supportingDetails: any[]): void;
  debug(message: string, ...supportingDetails: any[]): void;
  info(message: string, ...supportingDetails: any[]): void;
  log(message: string, ...supportingDetails: any[]): void;
  warn(message: string, ...supportingDetails: any[]): void;
  error(message: string, ...supportingDetails: any[]): void;
  fatal(message: string, ...supportingDetails: any[]): void;
}

export class Logger implements LoggerWithLevels {
  private static _instance: Logger;
  private name: string;
  private level: string;

  public getLevels = function() {
    return this.levels;
  };

  private levels = {
    silent: -1,
    debug: 0,
    info: 1,
    log: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  };

  public silent(message: string, ...supportingDetails: any[]): void {
    this.logMessage('silent', message);
  }

  /**
   * @class Logger
   * @method debug
   * @desc Log messages at the debug level.
   * @param {*} args - the arguments to be logged.
   */
  public debug(message: string, ...supportingDetails: any[]): void {
    this.logMessage('debug', message);
  }

  /**
   * @class Logger
   * @method log
   * @desc Log messages at an intermediary level called 'log'.
   * @param {*} args - the arguments to be logged.
   */
  public log(message: string, ...supportingDetails: any[]): void {
    this.logMessage('log', message);
  }

  /**
   * @class Logger
   * @method info
   * @desc Log messages at the info level.
   * @param {*} args - the arguments to be logged.
   */
  public info(message: string, ...supportingDetails: any[]): void {
    this.logMessage('info', message);
  }

  /**
   * @class Logger
   * @method warn
   * @desc Log messages at the warn level.
   * @param {*} args - the arguments to be logged.
   */
  public warn(message: string, ...supportingDetails: any[]): void {
    this.logMessage('warn', message);
  }

  /**
   * @class Logger
   * @method error
   * @desc Log messages at the error level.
   * @param {*} args - the arguments to be logged.
   */
  public error(message: string, ...supportingDetails: any[]): void {
    this.logMessage('error', message);
  }

  /**
   * @class Logger
   * @method fatal
   * @desc Log messages at the fatal level.
   * @param {*} args - the arguments to be logged.
   */
  public fatal(message: string, ...supportingDetails: any[]): void {
    this.logMessage('fatal', message);
  }

  private constructor() {
    this.name = 'Merit Log';
    this.level = DEFAULT_LOG_LEVEL;

    _.each(this.levels, function(level, levelName: string) {});
  }

  private logMessage(levelName: string, message: string, supportingDetails?: any[]) {
    let level: number = this.levels[levelName] || -1;

    if (levelName === 'silent') {
      // dont create a log.silent() method
      return;
    }
    if (level >= this.levels[this.level]) {
      // TODO: Fix the below so that debug output actually gets the benefit of stacktrace.
      if (Error.stackTraceLimit && this.level == 'debug') {
        let old = Error.stackTraceLimit;
        Error.stackTraceLimit = 2;
        let stack = new Error().stack;
        let lines = stack.split('\n');
        let caller = lines[2];

        if (caller) {
          caller = ':' + caller.substr(6);
        }
        Error.stackTraceLimit = old;

        let str = '[' + levelName + (caller || '') + '] ' + arguments[0],
          extraArgs = [].slice.call(arguments, 1);
        if (console[levelName]) {
          extraArgs.unshift(str);
          console[levelName].apply(console, extraArgs);
        } else {
          if (extraArgs.length) {
            str += JSON.stringify(extraArgs);
          }
          console.log(str);
        }
      }
    }
  }

  /**
   * @desc
   * Sets the level of a logger. A level can be any bewteen: 'debug', 'info', 'log',
   * 'warn', 'error', and 'fatal'. That order matters: if a logger's level is set to
   * 'warn', calling <tt>level.debug</tt> won't have any effect.
   *
   * @param {string} level - the name of the logging level
   */
  public setLevel = function(level) {
    this.level = level;
  };

  /**
   * @desc
   * Return singleton
   *
   * @param {string} level - the name of the logging level
   */
  public static getInstance() {
    return this._instance || new Logger();
  }
}
