"use strict";
const Logger = require("./Logger");
const BaseLogger = require("./BaseLogger");

class LoggerOfLoggers extends BaseLogger {

  constructor(options) {
    super();
    this.loggers = options.map(o => new Logger(o));
  }

  _log(level, message) {
    this.loggers.forEach(l => l._log(level, message));
  }

  _is(level) {
    return this.loggers.some(l => l._is(level));
  }
}

module.exports = LoggerOfLoggers;
