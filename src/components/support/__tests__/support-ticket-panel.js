import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../../../util/support-helper')
jest.unmock('../support-ticket-panel.jsx')
import SupportTicketPanel from '../support-ticket-panel.jsx'

describe('SupportTicketPanel', () => {

  it('should exist', () => {
    const ticket = shallow(<SupportTicketPanel/>)
    const ticketWithProps = shallow(<SupportTicketPanel
      type="task"
      assignee="Pending"
      body="My end user in Tokyo is complaining about a slow streaming start. Lorem ipsum dolor sit amet, consectur rom..."
      comments="3"
      number="#1-5424"
      status="open"
      prority="urgent"
      title="Poor Performance" />)
    expect(ticket.length).toBe(1)
    expect(ticketWithProps.length).toBe(1)
  })

})
