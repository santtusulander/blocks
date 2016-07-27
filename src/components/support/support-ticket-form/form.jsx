import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { reduxForm } from 'redux-form'
import {
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import Toggle from '../../toggle'

let errors = {}
const validate = (values) => {
  errors = {}

  const {
    subject
  } = values

  if(!subject || subject.length === 0) {
    errors.subject = 'Title is required'
  }

  return errors;
}

class SupportTicketForm extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
  }

  componentWillMount() {
    if (this.props.ticket) {
      const {
        ticket,
        fields: {
          subject
        }
      } = this.props

      subject.onChange(ticket.get('subject'))
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

  render() {
    const {
      fields: {
        subject,
        description
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
  validate: validate
})(SupportTicketForm)
