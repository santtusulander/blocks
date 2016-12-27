import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../support-ticket-comment')
import SupportTicketComment from '../support-ticket-comment'

describe('SupportTicketComment', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<SupportTicketComment {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
