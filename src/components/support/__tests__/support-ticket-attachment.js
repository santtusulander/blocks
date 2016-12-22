import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../support-ticket-attachment')
import SupportTicketAttachment from '../support-ticket-attachment'

describe('SupportTicketAttachment', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<SupportTicketAttachment {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
