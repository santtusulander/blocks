// Mock out localStorage for tests
global.localStorage = {
  getItem: jest.genMockFunction(),
  removeItem: jest.genMockFunction(),
  setItem: jest.genMockFunction()
}

global.VERSION = '11.22.33'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)
