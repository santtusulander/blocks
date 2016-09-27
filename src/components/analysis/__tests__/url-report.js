jest.unmock('../url-report.jsx')

import React from 'react'
import { mount } from 'enzyme'
import { fromJS } from 'immutable'

import AnalysisURLReport from '../url-report.jsx'

const urls = fromJS([
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
  }
])

describe('AnalysisURLReport', () => {
  let subject = null
  let props = {}
  beforeEach(() => {
    subject = () => {
      props = {
        urls,
        serviceTypes: fromJS(['http']),
        statusCodes: fromJS(['All'])
      }
      return mount(<AnalysisURLReport {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  });

  it('should pass on filtered urls', () => {
    expect(subject().find('AnalysisURLList').props().urls).toEqual(urls.pop())
  })

  it('should pass on proper chart height prop', () => {
    expect(subject().find('AnalysisHorizontalBar').props().height).toBe(108)
  })

  it('should select data type properly', () => {
    const component = subject()
    const bytesBtn = component.find('[value="bytes"]')
    const requestsBtn = component.find('[value="requests"]')
    requestsBtn.simulate('change')
    expect(component.state().dataKey).toBe('requests')
    bytesBtn.simulate('change')
    expect(component.state().dataKey).toBe('bytes')
  })
})
