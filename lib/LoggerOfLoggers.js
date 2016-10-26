"use strict";
const Logger = require("./Logger");
const BaseLogger = require("./BaseLogger");

class LoggerOfLoggers extends BaseLogger {

  constructor(source, options) {
    super(source);
    this.loggers = options.map(o => new Logger(source, o));
  }

  _log(logData) {
    this.loggers.forEach(l => l._log(logData));
  }

  _is(level) {
    return this.loggers.some(l => l._is(level));
  }
}

module.exports = LoggerOfLoggers;
