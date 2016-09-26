"use strict";

class ConsoleTransport {

  trace(message) {
    console.log(message);
  }

  debug(message) {
    console.log(message);
  }

  info(message) {
    console.log(message);
  }

  warn(message) {
    console.warn(message);
  }

  error(message) {
    console.error(message);
  }

  severe(message) {
    console.error(message);
  }
}

module.exports = ConsoleTransport;
