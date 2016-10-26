import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { reduxForm } from 'redux-form'
import {
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

import Toggle from '../../toggle'
import SelectWrapper from '../../select-wrapper.jsx'
import { STATUS_OPEN, STATUS_SOLVED } from '../../../constants/ticket'
import {
  isStatusOpen,
  getTicketPriorityOptions,
  getTicketTypeOptions
} from '../../../util/support-helper'

let errors = {}
const maxSubjectLength = 150
const maxDescriptionLength = 5000

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
    errors.subject = <FormattedMessage id="portal.support.tickets.validation.title.required.text"/>
  }

  if (subject && subject.length > maxSubjectLength) {
    errors.subject = <FormattedMessage id="portal.support.tickets.validation.title.maxLength.text" values={{maxLength: maxSubjectLength}}/>
  }

  if (!description || description.length === 0) {
    errors.description = <FormattedMessage id="portal.support.tickets.validation.description.required.text"/>
  }

  if (description && description.length > maxDescriptionLength) {
    errors.description = <FormattedMessage id="portal.support.tickets.validation.description.maxLength.text" values={{maxLength: maxDescriptionLength}}/>
  }

  if (!status || status.length === 0) {
    errors.status = <FormattedMessage id="portal.support.tickets.validation.status.required.text"/>
  }

  if (!type || type.length === 0) {
    errors.type = <FormattedMessage id="portal.support.tickets.validation.type.required.text"/>
  }

  if (!priority || priority.length === 0) {
    errors.priority = <FormattedMessage id="portal.support.tickets.validation.priority.required.text"/>
  }

  if (!assignee || assignee.length === 0) {
    errors.assignee = <FormattedMessage id="portal.support.tickets.validation.assignee.required.text"/>
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
      assignee: assignee.value
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
          label={this.props.intl.formatMessage({id: 'portal.support.tickets.label.title.text'})}/>
        {subject.touched && subject.error &&
        <div className="error-msg">{subject.error}</div>}

        <hr/>

        <Input
          {...description}
          type="textarea"
          label={this.props.intl.formatMessage({id: 'portal.support.tickets.label.description.text'})}/>
        {description.touched && description.error &&
        <div className="error-msg">{description.error}</div>}

        <hr/>

        <div className='form-group ticket-form__status'>
          <label className='control-label'><FormattedMessage id="portal.support.tickets.label.status.text"/></label>
          <Toggle
            value={isStatusOpen(status.value)}
            changeValue={this.toggleStatus}
            onText={this.props.intl.formatMessage({id: 'portal.support.tickets.status.open.text'})}
            offText={this.props.intl.formatMessage({id: 'portal.support.tickets.status.closed.text'})}
          />
        </div>

        <hr/>

        <div className='form-group'>
          <label className='control-label'><FormattedMessage id="portal.support.tickets.label.type.text"/></label>
          <SelectWrapper
            {...type}
            className="input-select"
            options={getTicketTypeOptions()}
          />
        </div>

        <hr/>

        <div className='form-group'>
          <label className='control-label'><FormattedMessage id="portal.support.tickets.label.priority.text"/></label>
          <SelectWrapper
            {...priority}
            className="input-select"
            options={getTicketPriorityOptions()}
          />
        </div>

        <hr/>

        <div className='form-group'>
          <label className='control-label'><FormattedMessage id="portal.support.tickets.label.assignee.text"/></label>
          <SelectWrapper
            {...assignee}
            className="input-select"
            options={[
              { value: 235323, label: <FormattedMessage id="portal.support.tickets.label.support.text"/>}
            ]}
          />
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={onCancel}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button disabled={!!Object.keys(errors).length} bsStyle="primary"
                  onClick={this.save}>{ticket ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>}</Button>
        </ButtonToolbar>
      </form>
    )
  }
}

SupportTicketForm.propTypes = {
  fields: PropTypes.object,
  intl: PropTypes.object,
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
})(injectIntl(SupportTicketForm))
