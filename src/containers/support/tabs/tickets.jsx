import React from 'react'
import { Range } from 'immutable'
import SupportTicketPanel from '../../../components/support/support-ticket-panel'

import './tickets.scss'

class SupportTabTickets extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="account-support-tickets">

        <h2>5 Open Tickets</h2>
        <div className="support-tickets-list">
          {Range(0, 10).map((item, index) => {
            return (
              <SupportTicketPanel
                type="task"
                assignee="Pending"
                body="My end user in Tokyo is complaining about a slow streaming start. Lorem ipsum dolor sit amet, consectur rom..."
                comments="3"
                number={index}
                status="open"
                title="Poor Performance"
                priority="high" />
            )
          })}

        </div>

        <h2>5 Closed Tickets</h2>

      </div>
    )
  }
}

SupportTabTickets.propTypes = {

}

SupportTabTickets.defaultProps = {}


export default SupportTabTickets;
