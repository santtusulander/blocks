'use strict';

let rewire = require('rewire');
let morgan = jasmine.createSpy('morgan').and.returnValue(jasmine.createSpy('morganMiddleware'));
let log    = require('./logger');
let server = rewire('./server');

server.__set__('morgan', morgan);
server = server();

describe('server', function() {
  it('should run without errors', function() {
    expect(server).toBeDefined();
  });

  it('should configure morgan access logger', function() {
    let errorSkipFn = morgan.calls.argsFor(0)[1].skip;
    let infoSkipFn  = morgan.calls.argsFor(1)[1].skip;
    let errorStream = morgan.calls.argsFor(0)[1].stream;
    let infoStream  = morgan.calls.argsFor(1)[1].stream;

    expect(morgan.calls.argsFor(0)[0]).toBe('combined');
    expect(morgan.calls.argsFor(1)[0]).toBe('combined');
    expect(errorStream).toBe(log.errorStream);
    expect(infoStream).toBe(log.infoStream);
    expect(errorSkipFn({}, {statusCode: 399})).toBe(true);
    expect(errorSkipFn({}, {statusCode: 400})).toBe(false);
    expect(infoSkipFn({}, {statusCode: 400})).toBe(true);
    expect(infoSkipFn({}, {statusCode: 399})).toBe(false);
  });

});
