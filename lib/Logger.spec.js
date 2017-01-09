"use strict";
require("should-sinon");

const should = require("should");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const SinonTransport = require("./transports/SinonTransport");

const logFactory = require("./logFactory");
const events = require("./events");

const template = (logData) => `(${logData.source}) [${logData.level}] ${logData.message}`;

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

  describe('log template', () => {

    const source = 'source';
    const message = 'message';

    it('When not given a template, should use the default for log messages', () => {
      // Arrange
      const utcTimestamp = 'timestamp';
      const stubs = {
        'moment': {
          utc: () => utcTimestamp,
          '@global': true
        }
      };

      const factory = proxyquire('./logFactory', stubs);
      const sut = factory({
        source,
        level: "INFO",
        transport
      });

      // Act
      sut.error("message");

      // Assert
      transport.spies.error.should.be.calledWith(`${utcTimestamp}: (${source}) [ERROR] ${message}`);
    });

    it('When given a template, should use it rather than the default', () => {
      // Arrange
      const sut = logFactory({
        source,
        template,
        level: "INFO",
        transport
      });

      // Act
      sut.error("message");

      // Assert
      transport.spies.error.should.be.calledWith(`(${source}) [ERROR] ${message}`);
    });
  });

  describe("log functions", () => {
    context("Level = INFO", () => {
      const sut = logFactory({
        source: "ThisTest",
        level: "INFO",
        template,
        transport
      });

      it("logs on critical", () => {
        sut.critical("message");
        transport.spies.critical.should.be.calledWith("(ThisTest) [CRITICAL] message");
      });

      it("logs on error", () => {
        sut.error("message");
        transport.spies.error.should.be.calledWith("(ThisTest) [ERROR] message");
      });

      it("logs on warn", () => {
        sut.warn("message");
        transport.spies.warn.should.be.calledWith("(ThisTest) [WARN] message");
      });

      it("logs on info", () => {
        sut.info("message");
        transport.spies.info.should.be.calledWith("(ThisTest) [INFO] message");
      });

      it("doesn\'t log on debug", () => {
        sut.debug("message");
        transport.spies.debug.should.not.be.called();
      });

      it("doesn\'t log on trace", () => {
        sut.trace("message");
        transport.spies.trace.should.not.be.called();
      });
    });
  });

  describe("error stacks", () => {
    const sut = logFactory({
      source: "ThisTest",
      level: "INFO",
      template,
      transport
    });

    it("logs stack if given", () => {
      const err = new Error("message");
      sut.error(err);
      transport.spies.error.should.not.be.calledWith("(ThisTest) [ERROR] message");
    });

    it("does not fail if no stack given", () => {
      sut.error("message");
      transport.spies.error.should.be.calledWith("(ThisTest) [ERROR] message");
    });
  });

  describe("error keys", () => {
    const sut = logFactory({
      source: "ThisTest",
      level: "INFO",
      template,
      transport
    });

    it("logs key if given", () => {
      const keyMessage = new Error("message");
      keyMessage.key = 'KEY';
      sut.error(keyMessage);
      transport.spies.error.should.not.be.calledWith("(ThisTest) [ERROR] message");
    });

    it("does not fail if no key given", () => {
      sut.error("message");
      transport.spies.error.should.be.calledWith("(ThisTest) [ERROR] message");
    });
  });

  describe("log levels", () => {
    context("Level = INFO", () => {
      const sut = logFactory({
        source: "ThisTest",
        level: "INFO",
        transport
      });

      it("is not Trace", () => {
        sut.isTrace.should.be.false();
      });

      it("is not Debug", () => {
        sut.isDebug.should.be.false();
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
      transport
    });

    it("should fire correct event with log data", () => {

      const spy = sinon.spy();

      events.on("ERROR", spy);
      sut.error("Hello");

      spy.should.be.calledWithMatch({
        level: "ERROR",
        message: "Hello"
      });
    });
  });
});
