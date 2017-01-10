import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../section-container')
import SectionContainer from '../section-container'

describe('SectionContainer', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        className: 'foo'
      }
      return shallow(<SectionContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
