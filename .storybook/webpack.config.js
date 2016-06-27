const config = require('../webpack/config')

module.exports = (storybookBaseConfig, configType) => {

  storybookBaseConfig.module = {
    loaders: config.module.loaders
  };

  storybookBaseConfig.resolve = {
    extensions: ['', '.js', '.jsx']
  };

  storybookBaseConfig.output.publicPath = 'http://localhost:9001/static/';

  return storybookBaseConfig;
};
