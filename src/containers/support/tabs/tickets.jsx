import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { List } from 'immutable'

import * as supportActionCreators from '../../../redux/modules/support'
import * as uiActionCreators from '../../../redux/modules/ui'

import SectionHeader from '../../../components/layout/section-header'
import IconAdd from '../../../components/icons/icon-add'
import UDNButton from '../../../components/button'
import SupportTicketPanel from '../../../components/support/support-ticket-panel'
import SupportTicketModal from '../../../components/support/support-ticket-modal'
import SupportTicketFormModal from '../../../components/support/support-ticket-form/modal'

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
      activeTicket: null,
      showEditModal: false,
      showModal: false
    }

    this.showModal = this.showModal.bind(this);
    this.showFormModal = this.showFormModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.saveTicket = this.saveTicket.bind(this);
    this.viewTicket = this.viewTicket.bind(this);
    this.renderTicketList = this.renderTicketList.bind(this);
  }

  componentWillMount() {
    this.props.supportActions.fetchTickets();
  }

  showModal(ticket) {
    this.hideModal()

    this.setState({
      showModal: true,
      activeTicket: ticket,
      showEditModal: false
    })
  }

  showFormModal(ticket = null) {
    this.setState({
      activeTicket: ticket,
      showEditModal: true,
      showModal: false
    })
  }

  hideModal() {
    this.setState({
      activeTicket: null,
      showEditModal: false,
      showModal: false
    })
  }

  saveTicket(data) {
    if (this.state.activeTicket) {
      // Update ticket
      return this.props.supportActions.updateTicket(data.id, data).then(action => {
        const ticket = action.payload.ticket
        this.showNotification(`Ticket #${ticket.id} updated.`)
        this.hideModal()
      })
    } else {
      // Add ticket
      return this.props.supportActions.createTicket(data).then(action => {
        const ticket = action.payload.ticket
        this.showNotification(`Ticket #${ticket.id} created.`)
        this.hideModal()
      })
    }
  }

  viewTicket(ticket) {
    this.showModal(ticket)
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  /**
   * Render a list of tickets.
   *
   * @param {Immutable.List} tickets  An immutable list of ticket data.
   * @return                          The HTML for the ticket list.
   */
  renderTicketList(tickets) {
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
              priority={priority}
              openTicket={() => {
                this.viewTicket(ticket)
              }}
            />
          )
        })}

      </div>
    )
  }

  render() {
    const { allTickets } = this.props;
    const openTickets = allTickets.filter(ticket => this.openStatuses.includes(ticket.get('status')))
    const closedTickets = allTickets.filter(ticket => this.closedStatuses.includes(ticket.get('status')))

    const openTicketsSize = openTickets.size
    const openTicketsText = ` Open Ticket${openTickets.size === 1 ? '' : 's'}`
    const finalOpenTicketsText = openTicketsSize + openTicketsText

    const closedTicketsSize = closedTickets.size
    const closedTicketsText = ` Closed Ticket${closedTickets.size === 1 ? '' : 's'}`
    const finalClosedTicketsText = closedTicketsSize + closedTicketsText

    return (
      <div className="account-support-tickets">
        <SectionHeader sectionHeaderTitle={finalOpenTicketsText}>
          <UDNButton
            bsStyle="success"
            icon={true}
            onClick={() => {this.showFormModal()}}>
            <IconAdd/>
          </UDNButton>
        </SectionHeader>
        {this.renderTicketList(openTickets)}

        <SectionHeader sectionHeaderTitle={finalClosedTicketsText} />
        {this.renderTicketList(closedTickets)}

        {this.state.showEditModal &&
        <SupportTicketFormModal
          onCancel={this.hideModal}
          onSave={this.saveTicket}
          show={this.state.showEditModal}
          ticket={this.state.activeTicket}
        />
        }
        {this.state.showModal &&
        <SupportTicketModal
          onCancel={this.hideModal}
          onEdit={this.showFormModal}
          show={this.state.showModal}
          ticket={this.state.activeTicket}
        />
        }
      </div>
    )
  }
}

SupportTabTickets.displayName = 'SupportTabTickets'
SupportTabTickets.propTypes = {
  allTickets: PropTypes.Array,
  supportActions: PropTypes.object,
  uiActions: PropTypes.object
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
