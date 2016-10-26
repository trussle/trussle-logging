"use strict";
const logFactory = require("./logFactory");
const transports = require("./transports");
const events = require("./events");

module.exports = logFactory;
module.exports.events = events;
module.exports.transports = transports;
