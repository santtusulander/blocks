// Mock out localStorage for tests
global.localStorage = {
  getItem: jest.genMockFunction(),
  removeItem: jest.genMockFunction(),
  setItem: jest.genMockFunction()
}

global.GOOGLE_SITE_KEY = '1234567890'
global.VERSION = '11.22.33'
global.MAPBOX_ACCESS_TOKEN = '1234567890'

// This is necessary to test react-mapbox-gl without generating an error
window.URL = {
  createObjectURL: jest.genMockFunction()
}
