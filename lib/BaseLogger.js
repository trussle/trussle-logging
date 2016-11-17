"use strict";
const events = require("./events");
const logDataGenerator = require('./logDataGenerator');
const LOGGERSOURCE = 'baseLogger';

class BaseLogger {

  constructor(source) {
    this.source = source;
    this.logDataGenerator = logDataGenerator;
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
    try {
      this._generateLog(level, message, this.source);
    } catch (err) {
      // if something goes wrong try to log the error
      try {
        this._generateLog('ERROR', err, LOGGERSOURCE);
      } catch (err) { /* Do nothing. We tried */ }
    }
  }
  _generateLog(level, message, source) {
    const logData = this.logDataGenerator.generateLogData(level, message, source);
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
