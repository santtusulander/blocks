import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../support-ticket-comments')
import SupportTicketComments from '../support-ticket-comments'

describe('SupportTicketComments', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        comments: Immutable.List(['foo'])
      }
      return shallow(<SupportTicketComments {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
