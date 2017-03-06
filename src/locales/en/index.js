import account from './account.json'
import analytics from './analytics.json'
import aspera from './aspera.json'
import common from './common.json'
import configuration from './configuration.json'
import content from './content.json'
import dashboard from './dashboard.json'
import login from './login.json'
import network from './network.json'
import password from './password.json'
import security from './security.json'
import services from './services.json'
import storage from './storage.json'
import support from './support.json'
import user from './user.json'
import validators from './validators.json';

//TODO: Should be removed when all strings have been moved to separate files
import en from './en.js'

export default Object.assign({},
  account,
  analytics,
  aspera,
  common,
  configuration,
  content,
  dashboard,
  login,
  network,
  password,
  security,
  services,
  storage,
  support,
  user,
  validators,
  en
)
