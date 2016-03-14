'use strict';

let log     = require('./logger');
let router  = require('./router');


describe('router', function() {
  it('should have an error handler', function() {
    let req = {};
    let res = {status: () => {}, send: () => {}};
    spyOn(res, 'status').and.returnValue(res);
    spyOn(res, 'send').and.stub();
    spyOn(log, 'error').and.stub();

    router.errorHandler(req, res);

    expect(log.error.calls.argsFor(0)[0].indexOf('404')).toBe(0);
    expect(res.status.calls.argsFor(0)[0]).toBe(404);
    expect(typeof res.send.calls.argsFor(0)[0]).toBe('string');
  });

});
