import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { Modal, Glyphicon } from 'react-bootstrap'

import IconEdit from '../icons/icon-configuration'
import IconClose from '../icons/icon-close'
import UDNButton from '../button'
import Toggle from '../toggle'
import { formatDate } from '../../util/helpers'

import {
  isStatusOpen,
  getTicketPriorityIcon,
  getTicketTypeIcon,
  getTicketPriorityLabel,
  getTicketTypeLabel
} from '../../util/support-helper'

class SupportTicketModal extends React.Component {
  constructor(props) {
    super(props)
  }

  static getTicketType(ticket) {
    const type = ticket.get('type')
    return (
      <div className="ticket-modal__type">
        <div className="ticket-modal__type-icon">{getTicketTypeIcon(type)}</div>
        <div className="ticket-modal__type-label">{getTicketTypeLabel(type)}</div>
      </div>
    )
  }

  static getTicketPrority(ticket) {
    const priority = ticket.get('priority')
    return (
      <div className="ticket-modal__priority">
        <div className="ticket-modal__priority-icon">{getTicketPriorityIcon(priority)}</div>
        <div className="ticket-modal__priority-label">{getTicketPriorityLabel(priority)}</div>
      </div>
    )
  }

  render() {
    const { ticket, show, onEdit, onCancel } = this.props

    return (
      <Modal dialogClassName="ticket-sidebar ticket-modal" show={show}>
        <Modal.Header>
          <small>Ticket</small>
          <h1>
            #{ticket.get('id')}
            <UDNButton bsStyle="success"
                       pageHeaderBtn={true}
                       icon={true}
                       className="ticket-modal__edit-ticket-button"
                       onClick={() => {
                         onEdit(ticket)
                       }}>
              <IconEdit/>
            </UDNButton>
          </h1>

          <a className="ticket-modal__cancel-button" onClick={onCancel}>
            <IconClose/>
          </a>
        </Modal.Header>

        <Modal.Body>
          <div className="ticket-modal__title">
            <h3>Title</h3>
            <h2>{ticket.get('subject')}</h2>
          </div>

          <hr/>

          <div className="ticket-modal__description">
            <h3>Description</h3>
            {ticket.get('description')}
          </div>

          <hr/>

          <div className="ticket-modal__status">
            <h3>Status</h3>
            <Toggle
              value={isStatusOpen(ticket.get('status'))}
              onText="Open"
              offText="Closed"
            />
          </div>

          <hr/>

          <div className="ticket-modal__details">
            <h3>Details</h3>

            <table>
              <tbody>
                <tr>
                  <th>Type:</th>
                  <td>{SupportTicketModal.getTicketType(ticket)}</td>
                </tr>
                <tr>
                  <th>Priority:</th>
                  <td>{SupportTicketModal.getTicketPrority(ticket)}</td>
                </tr>
                <tr>
                  <th>Assignee:</th>
                  <td>Pending</td>
                </tr>
                <tr>
                  <th>Created by:</th>
                  <td>jsmith@customerprovider.com</td>
                </tr>
                <tr>
                  <th>Creation Date:</th>
                  <td>{formatDate(ticket.get('created_at'))}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </Modal.Body>
      </Modal>
    )
  }
}

SupportTicketModal.propTypes = {
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
  show: PropTypes.bool,
  ticket: PropTypes.instanceOf(Map)
}

SupportTicketModal.defaultProps = {
  ticket: null,
  onEdit: () => {},
  onCancel: () => {}
}

export default SupportTicketModal

