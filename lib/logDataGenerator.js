'use strict';
const moment = require("moment");

class Log {

  static isType(level, message, source) {
    return true;
  }

  static create(level, message, source) {
    return new Log(level, message, source);
  }

  constructor(level, message, source) {
    this.timestamp = moment.utc();
    this.source = source;
    this.level = level;
    this.message = message;
  }

}

/**
 * Message is an error
 */
class ErrorLog extends Log {

  static isType(level, message, source) {
    return message && message instanceof Error;
  }

  static create(level, message, source) {
    return new ErrorLog(level, message, source);
  }

  constructor(level, message, source) {
    super(level, message.message, source);
    this.stack = message.stack;
  }

}


/**
 * Message is a an error with the additional key property { key: 'ERROR_KEY'}
 */
class GormLog extends ErrorLog {

  static isType(level, message, source) {
    return super.isType(level, message, source) && message.key;
  }

  static create(level, message, source) {
    return new GormLog(level, message, source);
  }

  constructor(level, message, source) {
    super(level, message, source);
    this.key = message.key;
  }

}


/**
 * Generate different log types based on log types
 */
class LogDataGenerator {

  constructor(logTypes) {
    this.logTypes = logTypes;
  }

  generateLogData(level, message, source) {
    return this.logTypes.find( (logType) => ( logType.isType(level, message, source)) )
    .create(level, message, source);
  }

}

// Log types to check for. Order is important!
const logTypes = [GormLog, ErrorLog, Log];
module.exports = new LogDataGenerator(logTypes);
