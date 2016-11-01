"use strict";
const logFactory = require("./logFactory");
const SinonTransport = require("./transports/SinonTransport");
const should = require("should");
const events = require("./events");
const sinon = require("sinon");

require("should-sinon");

describe("LoggerOfLoggers", () => {
  const transport1 = new SinonTransport();
  const transport2 = new SinonTransport();

  beforeEach(() => {
    transport1.reset();
    transport2.reset();
  });

  describe("constructor", () => {
    it("throws error when no config is specified", () => {
      should(() => logFactory()).throw("Please Specify Config");
    });
  });

  describe("log functions", () => {
    context("Level = INFO+DEBUG", () => {
      const log = logFactory({
        source: "ThisTest",
        level: "INFO",
        transport: transport1,
        variants: [
          {
            level: "DEBUG",
            transport: transport2,
            template: data => `${data.level}: ${data.message} ++ DEBUG`
          }
        ]
      });

      it("logs twice on critical", () => {
        log.critical("message");
        transport1.spies.critical.should.be.calledWith("(ThisTest) [CRITICAL] message");
        transport2.spies.critical.should.be.calledWith("CRITICAL: message ++ DEBUG");
      });

      it("logs twice on error", () => {
        log.error("message");
        transport1.spies.error.should.be.calledWith("(ThisTest) [ERROR] message");
        transport2.spies.error.should.be.calledWith("ERROR: message ++ DEBUG");
      });

      it("logs twice on warn", () => {
        log.warn("message");
        transport1.spies.warn.should.be.calledWith("(ThisTest) [WARN] message");
        transport2.spies.warn.should.be.calledWith("WARN: message ++ DEBUG");
      });

      it("logs twice on info", () => {
        log.info("message");
        transport1.spies.info.should.be.calledWith("(ThisTest) [INFO] message");
        transport2.spies.info.should.be.calledWith("INFO: message ++ DEBUG");
      });

      it("logs once on debug", () => {
        log.debug("message");
        transport1.spies.debug.should.not.be.called();
        transport2.spies.debug.should.be.calledWith("DEBUG: message ++ DEBUG");
      });

      it("doesn\'t log on trace", () => {
        log.trace("message");
        transport1.spies.trace.should.not.be.called();
        transport2.spies.trace.should.not.be.called();
      });
    });
  });

  describe("log levels", () => {
    context("Level = INFO+DEBUG", () => {
      const log = logFactory({
        source: "ThisTest",
        level: "INFO",
        transport: transport1,
        variants: [
          {
            level: "DEBUG"
          }
        ]
      });

      it("is not Trace", () => {
        log.isTrace.should.be.false();
      });

      it("is Debug", () => {
        log.isDebug.should.be.true();
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
      transport: transport1,
      variants: [
        {
          level: "DEBUG"
        }
      ]
    });

    it("only fires the event once", () => {

      const spy = sinon.spy();

      events.on("ERROR", spy);
      
      log.error("Hello");

      spy.should.be.calledOnce();
    });
  });
});
