"use strict";
const BaseLogger = require("./BaseLogger");

const logLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  CRITICAL: 5,
  NONE: 6
};

class Logger extends BaseLogger {
  constructor(source, options) {

    super(source);

    if (!options.level) {
      throw new Error("trussle-logger log level not set, use NODE_LOG_LEVEL env variable or set on options");
    }

    this.level = logLevels[options.level];
    this.transport = options.transport;
    this.template = options.template;
  }

  _log(logData) {

    if (this._is(logData.level)) {
      this.transport[logData.level.toLowerCase()](this.template(logData));
    }
  }

  _is(level) {
    return this.level <= logLevels[level];
  }
}

module.exports = Logger;
