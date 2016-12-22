import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../documentation')
import SupportTabDocumentation from '../documentation'

describe('SupportTabDocumentation', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (currentUserRole) => {
      props = {
        currentUserRole: currentUserRole || 1
      }
      return shallow(<SupportTabDocumentation {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject(1).length).toBe(1)
    expect(subject(2).length).toBe(1)
    expect(subject(3).length).toBe(1)
  })
})
