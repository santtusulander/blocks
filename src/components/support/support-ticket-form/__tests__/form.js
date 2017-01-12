import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../form')
import SupportTicketForm from '../form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fieldMock = {
  onChange: jest.fn(),
  value: 'foo'
}

const fieldsMock = {
  subject: fieldMock,
  description: fieldMock,
  status: fieldMock,
  type: fieldMock,
  priority: fieldMock,
  assignee: fieldMock
}

describe('SupportTicketForm', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        fields: fieldsMock,
        intl: intlMaker(),
        handleSubmit: jest.fn(),
        ticket: Immutable.Map({ id: 'foo' })
      }
      return shallow(<SupportTicketForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
