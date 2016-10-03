"use strict";
const moment = require("moment");
const BaseLogger = require("./BaseLogger");

const logLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  CRITICAL: 5
};

class Logger extends BaseLogger {
  constructor(options) {

    super();

    if (!options.level) {
      throw new Error("trussle-logger log level not set, use NODE_LOG_LEVEL env variable or set on options");
    }

    if (!options.source) {
      throw new Error("trussle-logger source not set");
    }

    this.level = logLevels[options.level];
    this.source = options.source;
    this.transport = options.transport;
    this.template = options.template;
  }

  _log(level, message) {

    if (this._is(level)) {
      const logData = {
        timestamp: moment.utc(),
        source: this.source,
        level,
        message
      };

      this.transport[level.toLowerCase()](this.template(logData));
    }
  }

  _is(level) {
    return this.level <= logLevels[level];
  }
}

module.exports = Logger;
