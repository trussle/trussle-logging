"use strict";
const sinon = require("sinon");

class SinonTransport {

  constructor() {
    this.reset();
  }

  reset() {
    this.spies = {
      trace: sinon.spy(),
      debug: sinon.spy(),
      info: sinon.spy(),
      warn: sinon.spy(),
      error: sinon.spy(),
      critical: sinon.spy()
    };
  }

  trace(message) {
    this.spies.trace(message);
  }

  debug(message) {
    this.spies.debug(message);
  }

  info(message) {
    this.spies.info(message);
  }

  warn(message) {
    this.spies.warn(message);
  }

  error(message) {
    this.spies.error(message);
  }

  critical(message) {
    this.spies.critical(message);
  }
}

module.exports = SinonTransport;
