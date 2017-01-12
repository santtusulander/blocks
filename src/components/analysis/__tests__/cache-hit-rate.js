import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../cache-hit-rate')
import AnalysisCacheHitRate from '../cache-hit-rate'

const trafficMock = Immutable.fromJS([{
  detail: [
    {
      chit_ratio: 1,
      timestamp: 2
    },
    {
      chit_ratio: 3,
      timestamp: 4
    }
  ]
}])

describe('AnalysisCacheHitRate', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        fetching: false,
        traffic: trafficMock
      }
      return shallow(<AnalysisCacheHitRate {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
