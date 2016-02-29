'use strict';

let log      = require('./logger');


describe('logger', function() {
  it('should have transports', function() {
    expect(log.transports.console).toBeDefined();
    expect(log.transports.info).toBeDefined();
    expect(log.transports.warn).toBeDefined();
  });

  it('should have streams that write log messages', function() {
    spyOn(log, 'info').and.stub();
    spyOn(log, 'error').and.stub();

    log.infoStream.write('info log');
    log.errorStream.write('error log');

    expect(log.infoStream).toBeDefined();
    expect(log.errorStream).toBeDefined();
    expect(log.info.calls.argsFor(0)[0]).toBe('info log');
    expect(log.error.calls.argsFor(0)[0]).toBe('error log');
  });

});
