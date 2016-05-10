import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../file-error.jsx')
const FileError = require('../file-error.jsx')
const DataBox = require('../data-box.jsx')
const URLList = require('../../url-list.jsx')

// Set up mocks to make sure formatting libs are used correctly
const numeral = require('numeral')
const numeralFormatMock = jest.genMockFunction()
numeral.mockReturnValue({format:numeralFormatMock})

const fakeSummary = Immutable.fromJS({
  e400: {"http":1,"https":2,"total":3},
  e404: {"http":2,"https":3,"total":5},
  e500: {"http":3,"https":4,"total":7},
  e503: {"http":4,"https":5,"total":9}
})

const fakeURLs = Immutable.fromJS([
  {
    "status_code":"404",
    "url":"abc.com",
    "bytes":1000,
    "requests":2000,
    "service_type":"http"
  },
  {
    "status_code":"500",
    "url":"def.com",
    "bytes":2000,
    "requests":1000,
    "service_type":"http"
  }
])

describe('FileError', () => {
  it('should have a client error box', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<FileError summary={fakeSummary} urls={fakeURLs} />);
    const result = renderer.getRenderOutput()
    const clientErrors = result.props.children[0].props.children.props.children[0]
    expect(clientErrors.type).toEqual(DataBox)
    expect(clientErrors.props.errs).toEqual([
      {code: 400, value: Immutable.Map({"http":1,"https":2,"total":3})},
      {code: 404, value: Immutable.Map({"http":2,"https":3,"total":5})}
    ])
  });
  it('should have a server error box', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<FileError summary={fakeSummary} urls={fakeURLs} />);
    const result = renderer.getRenderOutput()
    const serverErrors = result.props.children[0].props.children.props.children[1]
    expect(serverErrors.type).toEqual(DataBox)
    expect(serverErrors.props.errs).toEqual([
      {code: 500, value: Immutable.Map({"http":3,"https":4,"total":7})},
      {code: 503, value: Immutable.Map({"http":4,"https":5,"total":9})}
    ])
  });
  it('should have a url list', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<FileError summary={fakeSummary} urls={fakeURLs} />);
    const result = renderer.getRenderOutput()
    const urlList = result.props.children[2]
    expect(urlList.type).toEqual(URLList)
    expect(urlList.props.urls).toEqual(fakeURLs)
  });
})
