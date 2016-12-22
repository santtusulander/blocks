import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../support-ticket-modal')
import SupportTicketModal from '../support-ticket-modal'

const onEditMock = jest.fn()
const mockTicket = Immutable.Map({ type: 'foo', priority: 'bar' })

describe('SupportTicketModal', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        onEdit: onEditMock,
        ticket: mockTicket
      }
      return shallow(<SupportTicketModal {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
    subject().find('.ticket-modal__edit-ticket-button').simulate('click')
  })

  it('should edit the ticket', () => {
    subject().find('.ticket-modal__edit-ticket-button').simulate('click')
    expect(onEditMock.mock.calls[0][0]).toEqual(mockTicket)
  })
})
