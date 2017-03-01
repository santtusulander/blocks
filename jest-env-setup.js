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

const consoleErrorMessage = args => {
  const message = 'Console statements are not allowed in unit tests:\n'
  args = Array.prototype.slice.call(args)
  return message + args.join('\n')
}

/* eslint-disable no-console */
if (console) {
  if (console.log) {
    const old = console.log
    console.log = function() {
      old.apply(console, arguments)
      throw new Error(consoleErrorMessage(arguments))
    }
  }

  if (console.warn) {
    const old = console.warn
    console.warn = function() {
      old.apply(console, arguments)
      throw new Error(consoleErrorMessage(arguments))
    }
  }

  if (console.error) {
    var old = console.error
    console.error = function() {
      old.apply(console, arguments)
      throw new Error(consoleErrorMessage(arguments))
    }
  }
}

// global mock for localStorage
localStorage = (() => {
  let store = {}
  return {
    getItem: key => store[key] == null ? null : store[key],
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} }
  }
})()
