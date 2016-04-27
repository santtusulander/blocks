// Mock out localStorage for tests
global.localStorage = {
  getItem: jest.genMockFunction(),
  setItem: jest.genMockFunction()
}

global.VERSION = '11.22.33'

