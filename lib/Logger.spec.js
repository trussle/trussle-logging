"use strict";
const logFactory = require("./logFactory");
const events = require("./events");
const should = require("should");
const SinonTransport = require("./transports/SinonTransport");
const sinon = require("sinon");
require("should-sinon");

describe("Logger", () => {
  const transport = new SinonTransport();

  beforeEach(() => {
    transport.reset();
  });

  describe("constructor", () => {
    it("throws error when no config is specified", () => {
      should(() => logFactory()).throw("Please Specify Config");
    });

    it("sets source to config when config is a string", () => {
      let currentEnvLevel = process.env.NODE_LOG_LEVEL;

      process.env.NODE_LOG_LEVEL = "TRACE";

      let log = logFactory("ThisTest");
      process.env.NODE_LOG_LEVEL = currentEnvLevel;

      log.source.should.equal("ThisTest");
    });
  });

  describe("log functions", () => {
    context("Level = INFO", () => {
      const log = logFactory({
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

  describe("error stacks", () => {
    const log = logFactory({
      source: "ThisTest",
      level: "INFO",
      transport
    });

    it("logs stack if given", () => {
      const err = new Error("message");
      log.error(err);
      transport.spies.error.should.be.calledWith(`(ThisTest) [ERROR] ${err.stack}`);
    });

    it("does not fail if no stack given", () => {
      log.error("message");
      transport.spies.error.should.be.calledWith("(ThisTest) [ERROR] message");
    });
  });

  describe("log levels", () => {
    context("Level = INFO", () => {
      const log = logFactory({
        source: "ThisTest",
        level: "INFO",
        transport
      });

      it("is not Trace", () => {
        log.isTrace.should.be.false();
      });

      it("is not Debug", () => {
        log.isDebug.should.be.false();
      });

      it("is Info", () => {
        log.isInfo.should.be.true();
      });

      it("is Warn", () => {
        log.isWarn.should.be.true();
      });

      it("is Error", () => {
        log.isError.should.be.true();
      });

      it("is Critical", () => {
        log.isCritical.should.be.true();
      });
    });
  });

  describe("events", () => {
    const log = logFactory({
      source: "ThisTest",
      level: "INFO",
      transport
    });

    it("should fire correct event with log data", () => {

      const spy = sinon.spy();

      events.on("ERROR", spy);
      log.error("Hello");

      spy.should.be.calledWithMatch({
        level: "ERROR",
        message: "Hello"
      });
    });
  });
});
