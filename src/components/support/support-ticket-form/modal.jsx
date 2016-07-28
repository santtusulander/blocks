import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import SupportTicketForm from './form'
import { Modal } from 'react-bootstrap'

class SupportTicketModal extends React.Component {
  constructor(props) {
    super(props)
  }

  static getTitle(ticket = null) {
    return ticket ? `Edit Ticket: #${ticket.get('id')}` : 'New Ticket'
  }

  render() {
    const { ticket, show, onSave, onCancel } = this.props

    return (
      <Modal dialogClassName="ticket-form-sidebar" show={show}>
        <Modal.Header>
          <h1>{SupportTicketModal.getTitle(ticket)}</h1>
        </Modal.Header>

        <Modal.Body>
          <SupportTicketForm
            ticket={ticket}
            onSave={onSave}
            onCancel={onCancel}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

SupportTicketModal.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  ticket: PropTypes.instanceOf(Map)
}

SupportTicketModal.defaultProps = {
  ticket: null
}

export default SupportTicketModal

