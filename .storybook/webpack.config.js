const config = require('../webpack/config')

//Fitler out the .jsx loaders, or storybook breaks
const loaders = config.module.loaders.filter((item) => {
  return !item.test instanceof RegExp || (item.test.test && !item.test.test('.jsx'));
});

module.exports = {
  module: {
    loaders: loaders
  }
};
