"use strict";
const BaseLogger = require("./BaseLogger");
const should = require("should");
const _ = require('lodash');
const sinon = require('sinon');
require("should-sinon");


describe('BaseLogger', () => {

  let baseLogger;

  beforeEach( () => {
    baseLogger = new BaseLogger('Source');
    baseLogger._log = _.identity;
  });

  it('should trace', () => {
    should( () => baseLogger.trace('message') ).not.throw();
  });

  it('should debug', () => {
    should( () => baseLogger.debug('message') ).not.throw();
  });

  it('should info', () => {
    should( () => baseLogger.info('message') ).not.throw();
  });

  it('should warn', () => {
    should( () => baseLogger.warn('message') ).not.throw();
  });

  it('should error', () => {
    should( () => baseLogger.error('message') ).not.throw();
  });

  it('should critical', () => {
    should( () => baseLogger.critical('message') ).not.throw();
  });

  it('should throw an internal error if log errors', () => {
    baseLogger._log = sinon.spy();
    const spy = sinon.spy();
    baseLogger.logDataGenerator = {
      generateLogData: (level, message, source) => { if (source === 'Source') { spy(); throw 'error'; } }
    };
    baseLogger._writeLog('ERROR', 'message');
    spy.should.be.called();
    baseLogger._log.should.be.called();
  });

  it('should not error if logging totally fails', () => {
    baseLogger._log = sinon.spy();
    baseLogger.logDataGenerator = {
      generateLogData: (level, message, source) => { throw 'error'; }
    };
    should( () => baseLogger._writeLog('ERROR', 'message') ).not.throw();
  });

  it('should write log', () => {
    should( () => baseLogger._writeLog('ERROR', 'message') ).not.throw();
  });


});
