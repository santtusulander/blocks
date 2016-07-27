import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'

import * as supportActionCreators from '../../../redux/modules/support'

import SupportTicketPanel from '../../../components/support/support-ticket-panel'
import { STATUSES_OPEN, STATUSES_CLOSED } from '../../../constants/support'

import './tickets.scss'

class SupportTabTickets extends React.Component {
  constructor(props) {
    super(props)

    this.openStatuses = STATUSES_OPEN
    this.closedStatuses = STATUSES_CLOSED
  }

  componentWillMount() {
    this.props.supportActions.fetchTickets();
  }

  render() {
    const { allTickets } = this.props;
    const openTickets = allTickets.filter(ticket => this.openStatuses.includes(ticket.get('status')))
    const closedTickets = allTickets.filter(ticket => this.closedStatuses.includes(ticket.get('status')))

    return (
      <div className="account-support-tickets">

        <h2>{openTickets.size} Open Ticket{openTickets.size === 1 ? '' : 's'}</h2>
        {renderTicketList(openTickets)}

        <h2>{closedTickets.size} Closed Ticket{closedTickets.size === 1 ? '' : 's'}</h2>
        {renderTicketList(closedTickets)}

      </div>
    )
  }
}

/**
 * Render a list of tickets.
 *
 * @param {Immutable.List} tickets  An immutable list of ticket data.
 * @return                          The HTML for the ticket list.
 */
function renderTicketList(tickets) {
  return (
    <div className="support-tickets-list">
      {tickets.map(ticket => {
        const {
          description,
          id,
          priority,
          status,
          subject,
          type,
          comment_count
        } = ticket.toJS();
        return (
          <SupportTicketPanel
            key={id}
            type={type}
            assignee="Pending"
            body={description}
            comments={comment_count}
            number={`#${id}`}
            status={status}
            title={subject}
            priority={priority} />
        )
      })}

    </div>
  )
}

SupportTabTickets.displayName = 'SupportTabTickets'
SupportTabTickets.propTypes = {
  allTickets: React.PropTypes.instanceOf(List),
  supportActions: React.PropTypes.object
}

SupportTabTickets.defaultProps = {
  allTickets: new List()
}

function mapStateToProps(state) {
  return {
    allTickets: state.support.get('allTickets')
  };
}

function mapDispatchToProps(dispatch) {
  const supportActions = bindActionCreators(supportActionCreators, dispatch)
  return { supportActions };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SupportTabTickets))
