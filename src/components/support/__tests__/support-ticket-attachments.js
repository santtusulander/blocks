import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../support-ticket-attachments')
import SupportTicketAttachments from '../support-ticket-attachments'

describe('SupportTicketAttachments', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        attachments: Immutable.List(['foo'])
      }
      return shallow(<SupportTicketAttachments {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
