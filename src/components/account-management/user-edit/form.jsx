import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import {
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import CheckboxArray from '../../checkboxes.jsx'
import SelectWrapper from '../../select-wrapper.jsx'

let errors = {}
const validate = (values) => {
  errors = {}

  const { accountName, accountBrand, services } = values

  if(!accountName || accountName.length === 0) {
    errors.accountName = 'Account name is required'
  }
  if(!accountBrand || accountBrand.length === 0) {
    errors.accountBrand = 'Account brand is required'
  }
  if(services && services.length === 0) {
    errors.serviceType = 'Service type is required'
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

  }

  resetPassword() {
    //noinspection Eslint
    console.log('UserEditForm.resetPassword()')
  }

  render() {
    const {
      fields: { email, groups, role },
      groupOptions,
      roleOptions,
      onCancel
    } = this.props

    return (
      <form>
        <Input
          {...email}
          type="text"
          label="Email"/>
        {email.touched && email.error &&
        <div className="error-msg">{email.error}</div>}

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
  roleOptions: PropTypes.array,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({
  form: 'user-form',
  fields: ['email', 'role', 'groups'],
  validate: validate,
})(UserEditForm)
