"use strict";
const moment = require("moment");
const ConsoleTransport = require("./transports").console;
const defaultFormatter = (logData) => `(${logData.source}) [${logData.level}] ${logData.message}`;

const logLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  CRITICAL: 5
};


class Logger {
  constructor(options) {

    if (!options.level) {
      throw new Error("trussle-logger log level not set, use NODE_LOG_LEVEL env variable or set on options");
    }

    if (!options.source) {
      throw new Error("trussle-logger source not set");
    }

    this.level = logLevels[options.level];
    this.source = options.source;
    this.transport = options.transport;
    this.formatter = options.formatter;
  }

  trace(message) {
    this._log("TRACE", message);
  }

  debug(message) {
    this._log("DEBUG", message);
  }

  info(message) {
    this._log("INFO", message);
  }

  warn(message) {
    this._log("WARN", message);
  }

  error(message) {
    this._log("ERROR", message);
  }

  critical(message) {
    this._log("CRITICAL", message);
  }

  get isTrace() {
    return this._is("TRACE");
  }

  get isDebug() {
    return this._is("DEBUG");
  }

  get isInfo() {
    return this._is("INFO");
  }

  get isWarn() {
    return this._is("WARN");
  }

  get isError() {
    return this._is("ERROR");
  }

  get isCritical() {
    return this._is("CRITICAL");
  }

  _log(level, message) {

    if (this._is(level)) {
      const logData = {
        timestamp: moment.utc(),
        source: this.source,
        level,
        message
      };

      this.transport.forEach(transport => {
        transport[level.toLowerCase()](this.formatter(logData));
      });
    }
  }

  _is(level) {
    return this.level <= logLevels[level];
  }
}

const logFactory = (config) => {

  if (!config) {
    throw new Error("Please Specify Config");
  }

  let options = {};

  options.source = typeof config === 'string' ? config : config.source;
  options.level = config.level || process.env.NODE_LOG_LEVEL;
  options.transport = config.transport ? Array.isArray(config.transport) ? config.transport : [config.transport] : [new ConsoleTransport()];
  options.formatter = config.formatter || defaultFormatter;
  return new Logger(options);
};

module.exports = logFactory;
