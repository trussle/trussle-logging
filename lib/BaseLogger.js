"use strict";
const moment = require("moment");
const events = require("./events");
class BaseLogger {

  constructor(source) {
    this.source = source;
  }

  trace(message) {
    this._writeLog("TRACE", message);
  }

  debug(message) {
    this._writeLog("DEBUG", message);
  }

  info(message) {
    this._writeLog("INFO", message);
  }

  warn(message) {
    this._writeLog("WARN", message);
  }

  error(message) {
    this._writeLog("ERROR", message);
  }

  critical(message) {
    this._writeLog("CRITICAL", message);
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

  _writeLog(level, message) {
    const logData = {
      timestamp: moment.utc(),
      source: this.source,
      level,
      message
    };
    // We may have sent an Error;
    // if we have, the stack is most useful
    if (message && message.stack) {
      logData.stack = message.stack;
    }
    // Errors tend to already have a message
    if (message && message.message) {
      logData.message = message.message;
    }
    // If we are logging an error, key may be the type
    if (message && message.key) {
      logData.key = message.key;
    }

    this._log(logData);
    events.emit(level, logData);
  }

  _log(logData) {
    throw new Error("Override _log function in BaseLogger");
  }

  _is(level) {
    throw new Error("Override _is function in BaseLogger");
  }
}

module.exports = BaseLogger;
