import account from './account.json'
import analytics from './analytics.json'
import common from './common.json'
import content from './content.json'
import security from './security.json'
import services from './security.json'
import support from './support.json'

//TODO: Should be removed when all strings have been moved to separate files
import en from './en.js'

export default Object.assign({},
  account,
  analytics,
  common,
  content,
  security,
  services,
  support,
  en
)
