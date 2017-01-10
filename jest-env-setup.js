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

/* eslint-disable no-console */
if (console) {
  if (console.log) {
    const old = console.log
    console.log = function() {
      old.apply(this, arguments)
      throw new Error("Console logs are not allowed in unit tests")
    }
  }

  if (console.warn) {
    const old = console.warn
    console.warn = function() {
      old.apply(this, arguments)
      throw new Error("Console warnings are not allowed")
    }
  }

  if (console.error) {
    var old = console.error
    console.error = function() {
      old.apply(this, arguments)
      throw new Error("Console errors are not allowed")
    }
  }
}
