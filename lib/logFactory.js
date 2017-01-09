"use strict";

const _ = require("lodash");

const ConsoleTransport = require("./transports").Console;

const Logger = require("./Logger");
const LoggerOfLoggers = require("./LoggerOfLoggers");

const defaultTemplate = (logData) => `${logData.timestamp}: (${logData.source}) [${logData.level}] ${logData.message}`;

const getSource = config => (
  typeof config === 'string' ? config : config.source
);

const getOptions = (config) => ({
  level: config.level || process.env.NODE_LOG_LEVEL,
  transport: config.transport || new ConsoleTransport(),
  template: config.template || defaultTemplate
});

const logFactory = (config) => {

  if (!config) {
    throw new Error("Please Specify Config");
  }

  const source = getSource(config);

  if (!_.isEmpty(config.variants)) {
    const baseConfig = _.omit(config, ['variants']);
    const variants = [{}].concat(config.variants);
    const options = variants.map(v => getOptions(_.extend({}, baseConfig, v)));

    return new LoggerOfLoggers(source, options);
  }

  return new Logger(source, getOptions(config));
};

module.exports = logFactory;
