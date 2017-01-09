import React from 'react'
import { shallow,mount } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../../../util/helpers')

//jest.autoMockOff()
jest.unmock('../url-report.jsx')

const AnalysisURLReport = require('../url-report.jsx')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const urlMetrics = fromJS([
  {
    url: 'www.abc.com',
    bytes: 1000,
    requests: 287536,
    service_type: 'http'
  },
  {
    url: 'www.cdg.com/123.mp4',
    bytes: 3000,
    requests: 343456,
    service_type: 'https'
  },
  {
    url: 'www.cdg.com/123.mp4',
    bytes: 4000,
    requests: 565677,
    service_type: 'http'
  }
])

describe('AnalysisURLReport', () => {
  let subject = null
  let props = {}
  beforeEach(() => {
    subject = () => {
      props = {
        urlMetrics,
        serviceTypes: fromJS(['http']),
        statusCodes: fromJS(['All']),
        intl: intlMaker()
      }
      return shallow(<AnalysisURLReport {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  });

  it('should pass on filtered urls', () => {
    expect(subject().find('AnalysisURLList').props().urls).toEqual(urlMetrics/*.pop()*/)
  })

  it('should aggregate urlMetrics data sharing similar urls', () => {
    expect(subject().state().topURLs.size).toBe(2)
  })

  it('should pass on proper chart height prop', () => {
    expect(subject().find('AnalysisHorizontalBar').props().height).toBeDefined()
  })

  it('should select data type properly', () => {
    const component = subject()
    const bytesBtn = component.find('[value="bytes"]')
    const requestsBtn = component.find('[value="requests"]')
    requestsBtn.simulate('change', {target: {value: 'requests'} } )
    expect(component.state().dataKey).toBe('requests')
    bytesBtn.simulate('change',{target: {value: 'bytes'} })
    expect(component.state().dataKey).toBe('bytes')
  })
})
