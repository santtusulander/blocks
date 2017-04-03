import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { reduxForm, Field } from 'redux-form'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

// import { STATUS_OPEN, STATUS_SOLVED } from '../../../constants/ticket'
import {
  isStatusClosed,
  getTicketTypeOptions,
  getTicketPriorityOptions
} from '../../../util/support-helper'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupToggle from '../../form/field-form-group-toggle'
import FormFooterButtons from '../../form/form-footer-buttons'

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
    errors.subject = <FormattedMessage id="portal.support.tickets.validation.title.maxLength.text" values={{ maxLength: maxSubjectLength }}/>
  }

  if (!description || description.length === 0) {
    errors.description = <FormattedMessage id="portal.support.tickets.validation.description.required.text"/>
  }

  if (description && description.length > maxDescriptionLength) {
    errors.description = <FormattedMessage id="portal.support.tickets.validation.description.maxLength.text" values={{ maxLength: maxDescriptionLength }}/>
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
    this.handleToggle = this.handleToggle.bind(this)
  }

  save(values) {
    const {
      ticket,
      onSave
    } = this.props

    const data = {
      subject: values.subject,
      description: values.description,
      status: values.status,
      type: values.type,
      priority: values.priority,
      assignee: values.assignee
    }

    if (ticket) {
      data.id = ticket.get('id')
    }

    // TODO: Handle submissionError with redux form
    onSave(data)
  }

  handleToggle(value) {
    const { change } = this.props
    // TODO: make use of isStatusOpen || isStatusClosed after Zendesk-integration
    change('status', value)
  }

  render() {
    const {
      ticket,
      onCancel,
      invalid,
      submitting,
      handleSubmit
    } = this.props

    return (
      <form onSubmit={handleSubmit(values => this.save(values))} className="ticket-form">
        <Field
          type="text"
          name="subject"
          placeholder={this.props.intl.formatMessage({ id: 'portal.support.tickets.label.title.text' })}
          component={FieldFormGroup}
        >
          <FormattedMessage id="portal.support.tickets.label.title.text"/>
        </Field>

        <hr/>

        <Field
          type="textarea"
          name="description"
          placeholder={this.props.intl.formatMessage({ id: 'portal.support.tickets.label.description.text' })}
          component={FieldFormGroup}
        >
          <FormattedMessage id="portal.support.tickets.label.description.text"/>
        </Field>

        <hr/>

        <Field
          name="status"
          component={FieldFormGroupToggle}
          className="ticket-form__status"
          onToggle={this.handleToggle}
          onText={this.props.intl.formatMessage({ id: 'portal.support.tickets.status.open.text' })}
          offText={this.props.intl.formatMessage({ id: 'portal.support.tickets.status.closed.text' })}
        >
          <FormattedMessage id="portal.support.tickets.label.status.text"/>
        </Field>

        <hr/>

        <Field
          name="type"
          className="input-select"
          component={FieldFormGroupSelect}
          options={getTicketTypeOptions()}
        >
          <FormattedMessage id="portal.support.tickets.label.type.text"/>
        </Field>

        <hr />

        <Field
          name="priority"
          className="input-select"
          component={FieldFormGroupSelect}
          options={getTicketPriorityOptions()}
        >
          <FormattedMessage id="portal.support.tickets.label.priority.text"/>
        </Field>

        <hr/>

        <Field
          name="assignee"
          className="input-select"
          component={FieldFormGroupSelect}
          options={[
            { value: 235323, label: <FormattedMessage id="portal.support.tickets.label.support.text"/> }
          ]}
        >
          <FormattedMessage id="portal.support.tickets.label.assignee.text"/>
        </Field>

        <FormFooterButtons>
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting}>
            {ticket ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>}
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

SupportTicketForm.displayName = "SupportTicketForm"
SupportTicketForm.propTypes = {
  change: PropTypes.func,
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  submitting: PropTypes.bool,
  ticket: PropTypes.instanceOf(Map)
}

const mapStateToProps = (state, ownProps) => {
  const hasTicket = !!ownProps.ticket

  return {
    initialValues: {
      subject: hasTicket ? ownProps.ticket.get('subject') : null,
      description: hasTicket ? ownProps.ticket.get('description') : null,
      status: hasTicket ? isStatusClosed(ownProps.ticket.get('status')) : true,
      assignee: hasTicket ? ownProps.ticket.get('assignee') : null,
      type: hasTicket ? ownProps.ticket.get('type') : null,
      priority: hasTicket ? ownProps.ticket.get('priority') : null
    }
  }
}

const mapDispatchToProps = () => {
  return {}
}

const form = reduxForm({
  form: 'user-form',
  validate
})(SupportTicketForm)

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
