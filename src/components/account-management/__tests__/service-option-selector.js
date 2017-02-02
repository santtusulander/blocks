import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../service-option-selector.jsx')

import ServiceOptionSelector from '../service-option-selector.jsx'

const input = {
  onChange: jest.fn(),
  value: Immutable.List([])
}

describe('ServiceOptionSelector', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        input
      }
      return shallow(
        <ServiceOptionSelector {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
