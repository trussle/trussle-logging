"use strict";

class BaseLogger {

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
    throw new Error("Override _log function in BaseLogger");
  }

  _is(level) {
    throw new Error("Override _is function in BaseLogger");
  }
}

module.exports = BaseLogger;
