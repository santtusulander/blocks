import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { reduxForm } from 'redux-form'
import {
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import Toggle from '../../toggle'
import SelectWrapper from '../../select-wrapper.jsx'
import { STATUS_OPEN, STATUS_SOLVED } from '../../../constants/ticket'
import {
  isStatusOpen,
  getTicketPriorityOptions,
  getTicketTypeOptions
} from '../../../util/support-helper'

let errors = {}
const validate = (values) => {
  errors = {}

  const {
    subject,
    description,
    status,
    type,
    priority,
    assignee
  } = values

  if (!subject || subject.length === 0) {
    errors.subject = 'Title is required'
  }

  if (!description || description.length === 0) {
    errors.description = 'Description is required'
  }

  if (!status || status.length === 0) {
    errors.status = 'Status is required'
  }

  if (!type || type.length === 0) {
    errors.type = 'Type is required'
  }

  if (!priority || priority.length === 0) {
    errors.priority = 'Priority is required'
  }

  if (!priority || priority.length === 0) {
    errors.priority = 'Priority is required'
  }

  if (!assignee || assignee.length === 0) {
    errors.assignee = 'Assignee is required'
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
          status,
          type,
          priority,
          assignee
        }
      } = this.props

      subject.onChange(ticket.get('subject'))
      description.onChange(ticket.get('description'))
      status.onChange(ticket.get('status'))
      type.onChange(ticket.get('type'))
      priority.onChange(ticket.get('priority'))
      assignee.onChange(ticket.get('assignee_id'))
    }
  }

  save() {
    const {
      ticket,
      fields: {
        subject,
        description,
        status,
        type,
        priority,
        assignee
      }
    } = this.props

    let data = {
      subject: subject.value,
      description: description.value,
      status: status.value,
      type: type.value,
      priority: priority.value,
      assignee: assignee.value,
    }

    if (ticket) {
      data.id = ticket.get('id')
    }

    this.props.onSave(data)
  }

  toggleStatus(value) {
    const {
      fields: { status }
    } = this.props

    status.onChange(value ? STATUS_OPEN : STATUS_SOLVED)
  }

  render() {
    const {
      ticket,
      fields: {
        subject,
        description,
        status,
        type,
        priority,
        assignee
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

        <div className='form-group ticket-form__status'>
          <label className='control-label'>Status</label>
          <Toggle
            value={isStatusOpen(status.value)}
            changeValue={this.toggleStatus}
            onText="Open"
            offText="Closed"
          />
        </div>

        <hr/>

        <div className='form-group'>
          <label className='control-label'>Type</label>
          <SelectWrapper
            {...type}
            className="input-select"
            options={getTicketTypeOptions()}
          />
        </div>

        <hr/>

        <div className='form-group'>
          <label className='control-label'>Priority</label>
          <SelectWrapper
            {...priority}
            className="input-select"
            options={getTicketPriorityOptions()}
          />
        </div>

        <hr/>

        <div className='form-group'>
          <label className='control-label'>Assignee</label>
          <SelectWrapper
            {...assignee}
            className="input-select"
            options={[{ value: 235323, label: 'Support'}]}
          />
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={onCancel}>Cancel</Button>
          <Button disabled={!!Object.keys(errors).length} bsStyle="primary"
                  onClick={this.save}>{ticket ? 'Save' : 'Add'}</Button>
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
    status: STATUS_OPEN,
    assignee: null
  },
  validate: validate
})(SupportTicketForm)
