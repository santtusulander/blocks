import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../select-wrapper')
import SelectWrapper from '../select-wrapper'

describe('SelectWrapper', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<SelectWrapper {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
