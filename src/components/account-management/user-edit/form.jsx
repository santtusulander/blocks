import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Input, ButtonToolbar, Button, Row, Col } from 'react-bootstrap'
import ReactTelephoneInput from 'react-telephone-input'
import SelectWrapper from '../../select-wrapper'

import {FormattedMessage, injectIntl} from 'react-intl';

let errors = {}
const validate = (values) => {
  errors = {}

  const {
    email,
    role
  } = values

  if(!email || email.length === 0) {
    errors.email = <FormattedMessage id="portal.user.edit.emailRequired.text"/>
  }

  if(!role || role.length === 0) {
    errors.role = <FormattedMessage id="portal.user.edit.roleRequired.text"/>
  }

  return errors;
}

class UserEditForm extends React.Component {
  constructor(props) {
    super(props)

    // TODO: uncomment once UDNP-2008 is unblocked
    // this.resetPassword = this.resetPassword.bind(this)
    this.save = this.save.bind(this)
  }

  // TODO: uncomment and implement once UDNP-2008 is unblocked
  // resetPassword() {
  //   // TODO: call password reset function and display toast on success
  // }

  save() {
    const {
      fields: {
        first_name,
        last_name,
        phone_number,
        groups,
        role
      }
    } = this.props

    let newValues = {
      first_name: first_name.value,
      last_name: last_name.value,
      phone_number: phone_number.value,
      group_id: groups.value,
      roles: [ role.value ]
    }

    this.props.onSave(newValues)
  }

  render() {
    const {
      fields: {
        email,
        first_name,
        last_name,
        phone_number,
        role
      },
      roleOptions,
      onCancel
    } = this.props

    return (
      <form className="user-form">
        <Input
          {...email}
          type="text"
          disabled={true}
          label={this.props.intl.formatMessage({id: 'portal.user.edit.email.text'})}/>
        {email.touched && email.error &&
        <div className="error-msg">{email.error}</div>}

        <div className="user-form__name">
          <Row>
            <Col sm={6}>
              <Input
                {...first_name}
                type="text"
                label={this.props.intl.formatMessage({id: 'portal.user.edit.firstName.text'})}/>
              {first_name.touched && first_name.error &&
              <div className="error-msg">{first_name.error}</div>}
            </Col>

            <Col sm={6}>
              <Input
                {...last_name}
                type="text"
                label={this.props.intl.formatMessage({id: 'portal.user.edit.lastName.text'})}/>
              {last_name.touched && last_name.error &&
              <div className="error-msg">{last_name.error}</div>}
            </Col>
          </Row>
        </div>

        <div className="user-form__telephone">
          <label className="control-label"><FormattedMessage id="portal.user.edit.phoneNumber.text"/></label>
          <ReactTelephoneInput
            value={phone_number.value !== '+' ? phone_number.value : '1'}
            defaultCountry="us"
            onChange={(value) => {
              phone_number.onChange(value)
            }}
          />
          {phone_number.touched && phone_number.error &&
          <div className="error-msg">{phone_number.error}</div>}
        </div>

        {/* TODO: uncomment once UDNP-2008 is unblocked
        <hr/>

        <div className="form-group password-reset">
          <label className="control-label">
            <FormattedMessage id="portal.user.edit.resetPassword.text"/>
          </label>
          <div className="password-reset__wrapper">
            <Button bsStyle="primary" onClick={this.resetPassword}>
              <FormattedMessage id="portal.user.edit.resetPassword.button.text" />
            </Button>
            <p className="password-reset__description">
              <FormattedMessage
                id="portal.user.edit.resetPassword.instructions.text"
                values={{br: <br />}}
              />
            </p>
          </div>
        </div>
        */}

        <hr/>

        <div className='form-group'>
          <label className='control-label'><FormattedMessage id="portal.user.edit.role.text"/></label>
          <SelectWrapper
            {...role}
            numericValues={true}
            className="input-select"
            value={role.value}
            options={roleOptions}
          />
        </div>
        {role.touched && role.error &&
        <div className='error-msg'>{role.error}</div>}

        {/* Hiding group assignment until the API supports listing groups for
            users that have them assigned
        <hr/>

        <CheckboxArray
          iterable={groupOptions}
          field={groups}
          headerText="Groups"/>
        */}

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={onCancel}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button disabled={this.props.invalid} bsStyle="primary"
                  onClick={this.save}><FormattedMessage id="portal.button.save"/></Button>
        </ButtonToolbar>
      </form>
    )
  }
}

UserEditForm.propTypes = {
  fields: PropTypes.object,
  // groupOptions: PropTypes.array,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
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
})(injectIntl(UserEditForm))
