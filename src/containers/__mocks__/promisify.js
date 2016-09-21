// Put this in your "setupEnvScriptFile" for Jest.
// usage: `jest.genMockFn().mockReturnValue(promisify('whateva'))`
export const promisify = function (returnValue, delay) {
  delay = !!delay;
  let delayCount = 0;

  let recursiveMockPromise = new function () {
    let self = this;
    self.returnValue = returnValue;

    self.then = (cb) => {
      let performCallback = () => {
        self.returnValue = cb(self.returnValue);
      };

      if (delay) {
        setTimeout(performCallback, 1 + delayCount);
        delayCount += 500;
      } else {
        performCallback();
      }
      return self;
    };

    self.catch = () => self;

    return self;
  };
  return recursiveMockPromise;
};
