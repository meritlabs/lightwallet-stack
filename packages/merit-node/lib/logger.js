'use strict';

var meritcore = require('meritcore-lib');
var _ = meritcore.deps._;
var colors = require('colors/safe');

/**
 * Wraps console.log with some special magic
 * @constructor
 */
function Logger(options) {
  if (!options) {
    options = {};
  }
  this.formatting = _.isUndefined(options.formatting) ? Logger.DEFAULT_FORMATTING : options.formatting;
}

Logger.DEFAULT_FORMATTING = true;

/**
 * Prints an info message
 * #info
 */
Logger.prototype.info = function() {
  this._log.apply(this, ['blue', 'info'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Prints an error message
 * #error
 */
Logger.prototype.error = function() {
  this._log.apply(this, ['red', 'error'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Prints an debug message
 * #debug
 */
Logger.prototype.debug = function() {
  // dbg is a workaround for node < 9.x
  this._log.apply(this, ['magenta', 'dbg'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Prints an warn message
 * #warn
 */
Logger.prototype.warn = function() {
  this._log.apply(this, ['yellow', 'warn'].concat(Array.prototype.slice.call(arguments)));
};

/**
 * Proxies console.log with color and arg parsing magic
 * #_log
 */
Logger.prototype._log = function(color) {
  var args = Array.prototype.slice.call(arguments);
  args = args.slice(1);
  var level = args.shift();

  if (this.formatting) {
    var date = new Date();
    var typeString = colors[color].italic(level + ':');
    args[0] = '[' + date.toISOString() + ']' + ' ' + typeString + ' ' + args[0];
  }
  var fn = console[level] || console.log;
  fn.apply(console, args);
};

module.exports = Logger;
