import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../by-key')
import AnalysisByKey from '../by-key'

describe('AnalysisByKey', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (noWidth) => {
      props = {
        area: true,
        axes: true,
        className: 'foobar',
        height: 1,
        padding: 1,
        primaryData: [{foo: 'bar'}, {zyx: 'qwe'}],
        primaryLabel: 'foo',
        secondaryData: [{foo: 'bar'}, {zyx: 'qwe'}],
        secondaryLabel: 'bar',
        width: noWidth ? 0 : 1,
        yKey: 'foo',
        xKey: 'bar'
      }
      return shallow(<AnalysisByKey {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
    expect(subject(true).length).toBe(1)
  })
})
