// Mock out localStorage for tests
global.localStorage = {
  getItem: jest.genMockFunction(),
  removeItem: jest.genMockFunction(),
  setItem: jest.genMockFunction()
}

global.GOOGLE_SITE_KEY = '1234567890'
global.VERSION = '11.22.33'
