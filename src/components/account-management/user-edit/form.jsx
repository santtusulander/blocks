import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import {
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import CheckboxArray from '../../checkboxes.jsx'



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
    const { fields: { email, groups }, groupOptions, onCancel } = this.props

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

        <CheckboxArray iterable={groupOptions} field={groups} headerText="Groups"/>

        {/*<div className='form-group'>
         <label className='control-label'>Brand</label>
         <SelectWrapper
         {... accountBrand}
         className="input-select"
         value={accountBrand.value}
         options={brandOptions}
         />
         </div>
         {accountBrand.touched && accountBrand.error &&
         <div className='error-msg'>{accountBrand.error}</div>}

         <hr/>

         <label>Service type</label>
         <CheckboxArray iterable={serviceTypes} field={services}/>*/}
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
  onSave: PropTypes.func
}

export default reduxForm({
  form: 'user-form',
  fields: ['email', 'groups'],
  validate: validate,
})(UserEditForm)
