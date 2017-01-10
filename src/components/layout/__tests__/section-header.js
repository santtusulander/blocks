import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../section-header')
import SectionHeader from '../section-header'

describe('SectionHeader', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        className: 'foo'
      }
      return shallow(<SectionHeader {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
