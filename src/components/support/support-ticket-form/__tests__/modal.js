import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../modal')
import SupportTicketFormModal from '../modal'

describe('SupportTicketFormModal', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        ticket: Immutable.Map({ id: 'foo' })
      }
      return shallow(<SupportTicketFormModal {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
