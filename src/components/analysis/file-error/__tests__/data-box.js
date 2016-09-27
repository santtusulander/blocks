jest.unmock('../data-box.jsx')

import React from 'react'
import { shallow } from 'enzyme'
import { Map } from 'immutable'

import DataBox from '../data-box.jsx'

const errs = [
  {
    code: '400',
    value: Map({ "http":3,"https":4,"total":7 })
  },
  {
    code: '404',
    value: Map({ "http":1,"https":2,"total":3 })
  }
]

describe('DataBox', () => {
  let subject = null
  beforeEach(() => {
    subject = () => shallow(<DataBox {...{ code: 'aaa', errs, label: 'bbb' }}/>)
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show code', () => {
    expect(subject().find('#code').children().nodes).toContain('aaa')
  })

  it('should show label', () => {
    expect(subject().find('#label').children().nodes).toContain('bbb')
  })

  it('should show summaries correctly', () => {
    expect(subject().find('#total-0').children().nodes).toContain(7)
    expect(subject().find('#total-1').children().nodes).toContain(3)
  });
})
