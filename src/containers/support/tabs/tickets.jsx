import React from 'react'

import SupportTicketPanel from '../../../components/support/support-ticket-panel'

class SupportTabTickets extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="account-support-tickets">

        <SupportTicketPanel
          type="task"
          assignee="Pending"
          body="My end user in Tokyo is complaining about a slow streaming start. Lorem ipsum dolor sit amet, consectur rom..."
          comments="3"
          number="#1-5424"
          status="open"
          title="Poor Performance"
          priority="high" />

        <SupportTicketPanel
          type="task"
          assignee="Pending"
          body="My end user in Tokyo is complaining about a slow streaming start. Lorem ipsum dolor sit amet, consectur rom..."
          comments="3"
          number="#1-5424"
          status="closed"
          title="Poor Performance"
          priority="high" />
      </div>
    )
  }
}

SupportTabTickets.propTypes = {

}

SupportTabTickets.defaultProps = {}


export default SupportTabTickets;
