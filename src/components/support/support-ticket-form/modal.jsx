import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import SupportTicketForm from './form'
import { Modal } from 'react-bootstrap'

class SupportTicketFormModal extends React.Component {

  static getTitle(ticket = null) {
    return ticket ? `Edit Ticket: #${ticket.get('id')}` : 'New Ticket'
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { ticket, show, onSave, onCancel } = this.props

    return (
      <Modal dialogClassName="ticket-form-sidebar" show={show}>
        <Modal.Header>
          <h1>{SupportTicketFormModal.getTitle(ticket)}</h1>
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

SupportTicketFormModal.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  ticket: PropTypes.instanceOf(Map)
}

SupportTicketFormModal.defaultProps = {
  ticket: null
}

export default SupportTicketFormModal

