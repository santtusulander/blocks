import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import {
  Input,
  ButtonToolbar,
  Button,
  Row,
  Col
} from 'react-bootstrap'
import ReactTelephoneInput from 'react-telephone-input'
import CheckboxArray from '../../checkboxes.jsx'
import SelectWrapper from '../../select-wrapper.jsx'

let errors = {}
const validate = (values) => {
  errors = {}

  const {
    email,
    first_name,
    last_name,
    role
  } = values

  if(!email || email.length === 0) {
    errors.email = 'Email is required'
  }

  if(!first_name || first_name.length === 0) {
    errors.first_name = 'Firstname is required'
  }

  if(!last_name || last_name.length === 0) {
    errors.last_name = 'Lastname is required'
  }

  if(!role || role.length === 0) {
    errors.role = 'Role is required'
  }

  return errors;
}

class UserEditForm extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
  }

  save() {
    const {
      fields: {
        email,
        first_name,
        last_name,
        phone_number,
        groups
      }
    } = this.props

    this.props.onSave({
      email: email.value,
      first_name: first_name.value,
      last_name: last_name.value,
      phone_number: phone_number.value,
      group_id: groups.value
    })
  }

  resetPassword() {
    //noinspection Eslint
    console.log('UserEditForm.resetPassword()')
  }

  render() {
    const {
      fields: {
        email,
        first_name,
        last_name,
        phone_number,
        groups,
        role
      },
      groupOptions,
      roleOptions,
      onCancel
    } = this.props

    return (
      <form className="user-form">
        <Input
          {...email}
          type="text"
          disabled
          label="Email"/>
        {email.touched && email.error &&
        <div className="error-msg">{email.error}</div>}

        <div className="user-form__name">
          <Row>
            <Col sm={6}>
              <Input
                {...first_name}
                type="text"
                label="Firstname"/>
              {first_name.touched && first_name.error &&
              <div className="error-msg">{first_name.error}</div>}
            </Col>

            <Col sm={6}>
              <Input
                {...last_name}
                type="text"
                label="Firstname"/>
              {last_name.touched && last_name.error &&
              <div className="error-msg">{last_name.error}</div>}
            </Col>
          </Row>
        </div>

        <div className="user-form__telephone">
          <ReactTelephoneInput
            value={phone_number.value}
            defaultCountry="usa"
            onChange={(value) => {
              phone_number.onChange(value)
            }}
          />
          {phone_number.touched && phone_number.error &&
          <div className="error-msg">{phone_number.error}</div>}
        </div>

        <hr/>

        <div className="form-group password-reset">
          <label className="control-label">Password</label>
          <div>
            <span className="user-password">********</span>
            <Button
              bsStyle="primary"
              onClick={this.resetPassword}>Reset</Button>
          </div>
        </div>

        <hr/>

        <div className='form-group'>
          <label className='control-label'>Role</label>
          <SelectWrapper
            {...role}
            className="input-select"
            value={role.value}
            options={roleOptions}
          />
        </div>
        {role.touched && role.error &&
        <div className='error-msg'>{role.error}</div>}

        <hr/>

        <CheckboxArray
          iterable={groupOptions}
          field={groups}
          headerText="Groups"/>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={onCancel}>Cancel</Button>
          <Button disabled={!!Object.keys(errors).length} bsStyle="primary"
                  onClick={this.save}>Save</Button>
        </ButtonToolbar>
      </form>
    )
  }
}

UserEditForm.propTypes = {
  fields: PropTypes.object,
  groupOptions: PropTypes.array,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  roleOptions: PropTypes.array
}

export default reduxForm({
  form: 'user-form',
  fields: [
    'email',
    'first_name',
    'last_name',
    'phone_number',
    'role',
    'groups'
  ],
  validate: validate
})(UserEditForm)
