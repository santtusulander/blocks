import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { reduxForm } from 'redux-form'
import {
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import Toggle from '../../toggle'
import { STATUS_OPEN, STATUS_SOLVED } from '../../../constants/ticket'
import {
  isStatusOpen,
  isStatusClosed
} from '../../../util/support-helper'

let errors = {}
const validate = (values) => {
  errors = {}

  const {
    subject
  } = values

  if (!subject || subject.length === 0) {
    errors.subject = 'Title is required'
  }

  return errors;
}

class SupportTicketForm extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
    this.toggleStatus = this.toggleStatus.bind(this)
  }

  componentWillMount() {
    if (this.props.ticket) {
      const {
        ticket,
        fields: {
          subject,
          description,
          status
        }
      } = this.props

      subject.onChange(ticket.get('subject'))
      description.onChange(ticket.get('description'))
      status.onChange(ticket.get('status'))
    }
  }

  save() {
    const {
      fields: {
        subject
      }
    } = this.props

    this.props.onSave({
      subject: subject.value,
    })
  }

  toggleStatus(value) {
    const {
      fields: { status }
    } = this.props

    status.onChange(value ? STATUS_OPEN : STATUS_SOLVED)
  }

  render() {
    const {
      fields: {
        subject,
        description,
        status
      },
      onCancel
    } = this.props

    return (
      <form className="ticket-form">
        <Input
          {...subject}
          type="text"
          label="Title"/>
        {subject.touched && subject.error &&
        <div className="error-msg">{subject.error}</div>}

        <hr/>

        <Input
          {...description}
          type="textarea"
          label="Description"/>
        {description.touched && description.error &&
        <div className="error-msg">{description.error}</div>}

        <hr/>

        <div className='form-group'>
          <label className='control-label'>Status</label>
          <Toggle
            value={isStatusOpen(status.value)}
            changeValue={this.toggleStatus}
            onText="Open"
            offText="Closed"
          />
        </div>

        <hr/>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={onCancel}>Cancel</Button>
          <Button disabled={!!Object.keys(errors).length} bsStyle="primary"
                  onClick={this.save}>Save</Button>
        </ButtonToolbar>
      </form>
    )
  }
}

SupportTicketForm.propTypes = {
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  ticket: PropTypes.instanceOf(Map)
}

export default reduxForm({
  form: 'user-form',
  fields: [
    'subject',
    'description',
    'status',
    'type',
    'priority',
    'assignee'
  ],
  initialValues: {
    status: STATUS_OPEN
  },
  validate: validate
})(SupportTicketForm)
