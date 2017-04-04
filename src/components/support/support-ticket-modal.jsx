import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { Modal } from 'react-bootstrap'

import IconEdit from '../shared/icons/icon-configuration'
import IconClose from '../shared/icons/icon-close'
import UDNButton from '../button'
import Toggle from '../toggle'
import SupportTicketAttachments from './support-ticket-attachments'
import SupportTicketComments from './support-ticket-comments'
import { formatDate } from '../../util/helpers'

import {
  isStatusOpen,
  getTicketPriorityIcon,
  getTicketTypeIcon,
  getTicketPriorityLabel,
  getTicketTypeLabel
} from '../../util/support-helper'

class SupportTicketModal extends React.Component {

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

  constructor(props) {
    super(props)
  }

  render() {
    const { ticket, show, onEdit, onCancel } = this.props

    const attachments = List([Map({
      "id": 928354,
      "file_name": "my_funny_profile_pic.png",
      "content_url": "https://company.zendesk.com/attachments/my_funny_profile_pic.png",
      "content_type": "image/png",
      "size": 166144
    }), Map({
      "id": 928374,
      "file_name": "my_funny_profile_pic.png",
      "content_url": "https://company.zendesk.com/attachments/my_funny_profile_pic.png",
      "content_type": "image/png",
      "size": 156535
    })])

    const comments = List([Map({
      "id": 1274,
      "type": "Comment",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac ipsum eget est malesuada condimentum. Mauris commodo purus ex, rhoncus ornare turpis interdum et. Nam pharetra eros ante, in elementum tortor convallis vel. Etiam dapibus iaculis magna, at luctus orci vehicula in. Sed et mattis sem, sed cursus ex. Cras vel pellentesque metus. Integer consectetur quis mauris eget tempus. Pellentesque posuere in ex a varius.",
      "public": true,
      "created_at": "2009-07-20T22:55:29Z",
      "author_id": 123123
    }), Map({
      "id": 1275,
      "type": "Comment",
      "body": "Mauris sollicitudin sagittis felis, at elementum purus porttitor vel. Sed sed sapien ipsum. Morbi nec urna sit amet est convallis consequat vel ac lectus. Nam sed tincidunt arcu, commodo lacinia metus. Phasellus tincidunt, dui id porttitor vulputate, mi urna hendrerit justo, non feugiat orci turpis sit amet turpis. Cras porta, tellus in ultricies elementum, lorem purus rutrum lacus, vitae feugiat ex ipsum ut orci. Donec blandit, magna vitae iaculis aliquam, dui tellus ullamcorper erat, ut sodales ipsum diam vitae massa. Quisque vehicula vestibulum elit, at aliquam erat aliquam ut.",
      "public": true,
      "created_at": "2009-07-20T22:55:29Z",
      "author_id": 123123
    })])

    return (
      <Modal dialogClassName="ticket-sidebar ticket-modal" show={show}>
        <Modal.Header>
          <small>Ticket</small>
          <h1>
            #{ticket.get('id')}
            <UDNButton bsStyle="success"
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

          <hr/>

          <div className="ticket-modal__attachments">
            <h3>Attachments</h3>

            <SupportTicketAttachments
              attachments={attachments}/>
          </div>

          <hr/>

          <div className="ticket-modal__comments">
            <h3>Comments</h3>

            <SupportTicketComments
              comments={comments}/>
          </div>

        </Modal.Body>
      </Modal>
    )
  }
}

SupportTicketModal.displayName = "SupportTicketModal"
SupportTicketModal.propTypes = {
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
  show: PropTypes.bool,
  ticket: PropTypes.instanceOf(Map)
}

SupportTicketModal.defaultProps = {
  ticket: null,
  onEdit: () => {
    // no-op
  },
  onCancel: () => {
    // no-op
  }
}

export default SupportTicketModal
