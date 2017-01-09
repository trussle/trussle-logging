"use strict";
require("should-sinon");

const sinon = require("sinon");
const should = require("should");

const SinonTransport = require("./transports/SinonTransport");

const logFactory = require("./logFactory");
const events = require("./events");

const template = (logData) => `(${logData.source}) [${logData.level}] ${logData.message}`;

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
      const sut = logFactory({
        source: "ThisTest",
        level: "INFO",
        transport: transport1,
        template,
        variants: [
          {
            level: "DEBUG",
            transport: transport2,
            template: data => `${data.level}: ${data.message} ++ DEBUG`
          }
        ]
      });

      it("logs twice on critical", () => {
        sut.critical("message");
        transport1.spies.critical.should.be.calledWith("(ThisTest) [CRITICAL] message");
        transport2.spies.critical.should.be.calledWith("CRITICAL: message ++ DEBUG");
      });

      it("logs twice on error", () => {
        sut.error("message");
        transport1.spies.error.should.be.calledWith("(ThisTest) [ERROR] message");
        transport2.spies.error.should.be.calledWith("ERROR: message ++ DEBUG");
      });

      it("logs twice on warn", () => {
        sut.warn("message");
        transport1.spies.warn.should.be.calledWith("(ThisTest) [WARN] message");
        transport2.spies.warn.should.be.calledWith("WARN: message ++ DEBUG");
      });

      it("logs twice on info", () => {
        sut.info("message");
        transport1.spies.info.should.be.calledWith("(ThisTest) [INFO] message");
        transport2.spies.info.should.be.calledWith("INFO: message ++ DEBUG");
      });

      it("logs once on debug", () => {
        sut.debug("message");
        transport1.spies.debug.should.not.be.called();
        transport2.spies.debug.should.be.calledWith("DEBUG: message ++ DEBUG");
      });

      it("doesn\'t log on trace", () => {
        sut.trace("message");
        transport1.spies.trace.should.not.be.called();
        transport2.spies.trace.should.not.be.called();
      });
    });
  });

  describe("log levels", () => {
    context("Level = INFO+DEBUG", () => {
      const sut = logFactory({
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
        sut.isTrace.should.be.false();
      });

      it("is Debug", () => {
        sut.isDebug.should.be.true();
      });

      it("is Info", () => {
        sut.isInfo.should.be.true();
      });

      it("is Warn", () => {
        sut.isWarn.should.be.true();
      });

      it("is Error", () => {
        sut.isError.should.be.true();
      });

      it("is Critical", () => {
        sut.isCritical.should.be.true();
      });
    });
  });

  describe("events", () => {
    const sut = logFactory({
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

      sut.error("Hello");

      spy.should.be.calledOnce();
    });
  });
});
