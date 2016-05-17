const config = require('../webpack/config')

//Fitler out the .jsx loaders, or storybook breaks
/*const loaders = config.module.loaders.filter((item) => {
  return !item.test instanceof RegExp || (item.test.test && !item.test.test('.jsx'));
});*/

/*module.exports = {
  module: {
    loaders: loaders
  }
};*/

module.exports = (storybookBaseConfig, configType) => {

  storybookBaseConfig.module = {
      loaders: config.module.loaders
  };

  storybookBaseConfig.output.publicPath = 'http://localhost:9001/static/';


return storybookBaseConfig;
};
