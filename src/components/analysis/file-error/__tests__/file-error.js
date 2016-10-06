import React from 'react'
import { shallow } from 'enzyme'
import { fromJS, Map, List } from 'immutable'

jest.unmock('../file-error.jsx')
jest.unmock('../../../../constants/status-codes.js')

import FileError from '../file-error.jsx'
import STATUS_CODES from '../../../../constants/status-codes.js'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const fakeSummary = fromJS({
  e401: {"http":1,"https":2,"total":3},
  e404: {"http":2,"https":3,"total":5},
  e500: {"http":3,"https":4,"total":7},
  e503: {"http":4,"https":5,"total":9}
})

const fakeURLs = fromJS([
  {
    "status_code":404,
    "url":"abc.com",
    "bytes":1000,
    "requests":2000,
    "service_type":"http"
  },
  {
    "status_code":500,
    "url":"def.com",
    "bytes":2000,
    "requests":1000,
    "service_type":"http"
  }
])

describe('FileError', () => {

  let subject = null

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = Object.assign({}, {
        intl: intlMaker(),
        serviceTypes: fromJS(['http', 'https']),
        summary: fakeSummary,
        urls: fakeURLs,
        statusCodes: List(['All', '401', '404']),
      }, props)
      return shallow(<FileError {...defaultProps}/>)
    }
  })

  it('should have a client error box', () => {
    expect(subject().find('#client-errors').prop('errs')).toEqual([
      { code: 401, value: Map({ "http": 1, "https": 2, "total": 3 }) },
      { code: 404, value: Map({ "http": 2, "https": 3, "total": 5 }) }
    ])
  })

  it('should have a server error box', () => {
    expect(
      subject({ statusCodes: List(['All', '500', '503']) })
        .find('#server-errors')
        .prop('errs')
    ).toEqual([
      { code: 500, value: Map({ "http": 3, "https": 4, "total": 7 }) },
      { code: 503, value: Map({ "http": 4, "https": 5, "total": 9 }) }
    ])
  })

  it('should have a url list', () => {
    expect(
      subject({ statusCodes: List(['All', '401', '500']) })
        .find('AnalysisURLList')
        .prop('urls')
    ).toEqual(fakeURLs)
  })
})
