"use strict";
const logFactory = require("./logFactory");
const transports = require("./transports");

module.exports = logFactory;
module.exports.transports = transports;
