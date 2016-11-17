'use strict';
const moment = require("moment");
const _ = require('lodash');
const util = require('util');

class LogDataGenerator {

  generateLogData(level, message, source) {

    let logData = {
      timestamp: moment.utc(),
      source,
      level,
      message
    };

    // Error's stack is a getter, convert to normal object
    if (logData.message instanceof Error) {
      logData.message = _.merge({
        stack: logData.message.stack,
        message: logData.message.message
      }, logData.message);
    }

    if (_.isObject(logData.message)) {
      logData.message = util.inspect(logData.message);
    }

    return logData;
  }

}

// Log types to check for. Order is important!
module.exports = new LogDataGenerator();
