import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tickets')
import SupportTabTickets from '../tickets'

describe('SupportTabTickets', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<SupportTabTickets {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
