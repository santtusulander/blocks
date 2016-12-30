import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { HelpBlock, FormGroup, FormControl, ControlLabel, ButtonToolbar, Button, Row, Col } from 'react-bootstrap'
import ReactTelephoneInput from 'react-telephone-input'
import { FormattedMessage } from 'react-intl'
import phoneValidator from 'phone'

import SelectWrapper from '../../select-wrapper'
import { getReduxFormValidationState } from '../../../util/helpers'

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

    this.state = {
      phoneNumberValidationState: null
    }

    // TODO: uncomment once UDNP-2008 is unblocked
    // this.resetPassword = this.resetPassword.bind(this)
    this.save = this.save.bind(this)
    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this)
    this.validatePhoneNumber = this.validatePhoneNumber.bind(this)
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
        phone_country_code,
        groups,
        role
      }
    } = this.props

    let newValues = {
      first_name: first_name.value,
      last_name: last_name.value,
      phone_number: phone_number.value,
      phone_country_code: phone_country_code.value,
      group_id: groups.value,
      roles: [ role.value ]
    }

    this.props.onSave(newValues)
  }

  validatePhoneNumber(number) {
    const isPhoneValid = phoneValidator(number).length
    if (isPhoneValid === 0) {
      this.setState({
        phoneNumberValidationState: 'error'
      })
    } else {
      this.setState({
        phoneNumberValidationState: null
      })
    }
  }

  onPhoneNumberChange(number, { dialCode }) {
    const {
      fields: {
        phone,
        phone_number,
        phone_country_code
      }
    } = this.props

    const trimmedPhoneNumber = number.replace(/\D/g, '').replace(dialCode, '')

    phone.onChange(number)
    // Fill the inputs that will be send to API
    phone_number.onChange(trimmedPhoneNumber)
    phone_country_code.onChange(dialCode)

    // Validate phone number
    this.validatePhoneNumber(number)
  }

  render() {
    const {
      fields: {
        email,
        first_name,
        last_name,
        phone,
        role
      },
      roleOptions,
      onCancel
    } = this.props

    // ReactTelephoneInput decorates the phone number at render and thus triggers
    // the phone.dirty flag. Need to add extra check to see if any actual
    // digits have been changed before enabling Save button
    const trimmedPhoneNumber = phone.value.replace(/\D/g,'')
    const allowSave = (first_name.dirty || email.dirty || last_name.dirty || role.dirty ||
                       (phone.dirty && (phone.initialValue !== trimmedPhoneNumber))) &&
                       (this.state.phoneNumberValidationState === null) &&
                       !this.props.invalid

    return (
      <form className="user-form">

        <FormGroup validationState={getReduxFormValidationState(email)}>
          <ControlLabel>
            <FormattedMessage id="portal.user.edit.email.text"/>
          </ControlLabel>
          <FormControl
            {...email}
            disabled={true}/>
          {email.touched && email.error &&
            <HelpBlock className="error-msg">{email.error}</HelpBlock>
          }
        </FormGroup>

        <div className="user-form__name">
          <Row>
            <Col sm={5}>
              <ControlLabel>
                <FormattedMessage id="portal.user.edit.firstName.text"/>
              </ControlLabel>
                <FormControl {...first_name}/>
              {first_name.touched && first_name.error &&
              <div className="error-msg">{first_name.error}</div>}
            </Col>

            <Col sm={6}>
              <ControlLabel>
                <FormattedMessage id="portal.user.edit.lastName.text"/>
              </ControlLabel>
              <FormControl {...last_name}/>
              {last_name.touched && last_name.error &&
              <div className="error-msg">{last_name.error}</div>}
            </Col>
          </Row>
        </div>

        <div className="user-form__telephone">
          <label className="control-label"><FormattedMessage id="portal.user.edit.phoneNumber.text"/></label>
          <FormGroup validationState={this.state.phoneNumberValidationState}>
            <ReactTelephoneInput
              {...phone}
              defaultCountry="us"
              onChange={this.onPhoneNumberChange}
            />
          </FormGroup>
          {
            this.state.phoneNumberValidationState !== null &&
            <div className="error-msg"><FormattedMessage id="portal.user.edit.phoneInvalid.text"/></div>
          }
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
          <div>
            <label className='control-label'><FormattedMessage id="portal.user.edit.role.text"/></label>
          </div>
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
          <Button disabled={!allowSave} bsStyle="primary"
                  onClick={this.save}><FormattedMessage id="portal.button.save"/></Button>
        </ButtonToolbar>
      </form>
    )
  }
}

UserEditForm.displayName = "UserEditForm"
UserEditForm.propTypes = {
  fields: PropTypes.object,
  // groupOptions: PropTypes.array,
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
    'phone',
    'phone_number',
    'phone_country_code',
    'role',
    'groups'
  ],
  validate: validate
})(UserEditForm)
