import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'
import { Row, Col } from 'react-bootstrap'

import * as supportActionCreators from '../../../redux/modules/support'
import * as uiActionCreators from '../../../redux/modules/ui'

import IconAdd from '../../../components/icons/icon-add'
import UDNButton from '../../../components/button.js'
import SupportTicketPanel from '../../../components/support/support-ticket-panel'
import SupportTicketModal from '../../../components/support/support-ticket-form/modal'

import {
  getClosedTicketStatuses,
  getOpenTicketStatuses
} from '../../../util/support-helper'

import './tickets.scss'

class SupportTabTickets extends React.Component {
  constructor(props) {
    super(props)

    this.openStatuses = List(getOpenTicketStatuses())
    this.closedStatuses = List(getClosedTicketStatuses())

    this.notificationTimeout = null

    this.state = {
      ticketToEdit: null,
      showModal: false
    }

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.saveTicket = this.saveTicket.bind(this);
  }

  componentWillMount() {
    this.props.supportActions.fetchTickets();
  }

  showModal(ticket = null) {
    this.setState({
      ticketToEdit: ticket,
      showModal: true
    })
  }

  hideModal() {
    this.setState({ showModal: false })
  }

  saveTicket(data) {
    if (this.state.ticketToEdit) {
      // Update ticket
    } else {
      // Add ticket
      return this.props.supportActions.createTicket(data).then(action => {
        this.showNotification(`Ticket ${data.subject} created.`)
        this.hideModal()
      })
    }
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  render() {
    const { allTickets } = this.props;
    const openTickets = allTickets.filter(ticket => this.openStatuses.includes(ticket.get('status')))
    const closedTickets = allTickets.filter(ticket => this.closedStatuses.includes(ticket.get('status')))

    return (
      <div className="account-support-tickets">
        <Row>
          <Col sm={8}>
            <h2>{openTickets.size} Open Ticket{openTickets.size === 1 ? '' : 's'}</h2>
          </Col>
          <Col sm={4}>
            <div className="account-support-tickets__filters">
              <UDNButton bsStyle="success"
                         pageHeaderBtn={true}
                         icon={true}
                         addNew={true}
                         className="pull-right"
                         onClick={() => {
                           this.showModal()
                         }}>
                <IconAdd/>
              </UDNButton>
            </div>
          </Col>
        </Row>
        {renderTicketList(openTickets)}

        <h2>{closedTickets.size} Closed Ticket{closedTickets.size === 1 ? '' : 's'}</h2>
        {renderTicketList(closedTickets)}

        {this.state.showModal &&
        <SupportTicketModal
          onCancel={this.hideModal}
          onSave={this.saveTicket}
          show={this.state.showModal}
          ticket={this.state.ticketToEdit}
        />
        }
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
            priority={priority}/>
        )
      })}

    </div>
  )
}

SupportTabTickets.displayName = 'SupportTabTickets'
SupportTabTickets.propTypes = {
  supportActions: PropTypes.object
}

SupportTabTickets.defaultProps = {
  tickets: List()
}

function mapStateToProps(state) {
  return {
    allTickets: state.support.get('allTickets')
  };
}

function mapDispatchToProps(dispatch) {
  const supportActions = bindActionCreators(supportActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  return {
    supportActions,
    uiActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SupportTabTickets))
