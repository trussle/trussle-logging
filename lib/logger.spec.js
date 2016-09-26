"use strict";
const logger = require("./logger");
const should = require("should");
const sinon = require("sinon");
require("should-sinon");

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

describe("logger", () => {
  const transport = new SinonTransport();

  beforeEach(() => {
    transport.reset();
  });

  describe("constructor", () => {
    it("throws error when no config is specified", () => {
      should(() => logger()).throw("Please Specify Config");
    });

    it("sets source to config when config is a string", () => {
      let currentEnvLevel = process.env.NODE_LOG_LEVEL;

      process.env.NODE_LOG_LEVEL = "TRACE";

      let log = logger("ThisTest");
      process.env.NODE_LOG_LEVEL = currentEnvLevel;

      log.source.should.equal("ThisTest");
    });
  });

  describe("log functions", () => {
    context("Level = INFO", () => {
      const log = logger({
        source: "ThisTest",
        level: "INFO",
        transport
      });

      it("logs on critical", () => {
        log.critical("message");
        transport.spies.critical.should.be.calledWith("(ThisTest) [CRITICAL] message");
      });

      it("logs on error", () => {
        log.error("message");
        transport.spies.error.should.be.calledWith("(ThisTest) [ERROR] message");
      });

      it("logs on warn", () => {
        log.warn("message");
        transport.spies.warn.should.be.calledWith("(ThisTest) [WARN] message");
      });

      it("logs on info", () => {
        log.info("message");
        transport.spies.info.should.be.calledWith("(ThisTest) [INFO] message");
      });

      it("doesn\'t log on debug", () => {
        log.debug("message");
        transport.spies.debug.should.not.be.called();
      });

      it("doesn\'t log on trace", () => {
        log.trace("message");
        transport.spies.trace.should.not.be.called();
      });
    });
  });
});
