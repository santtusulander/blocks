import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Input, ButtonToolbar, Button, Row, Col } from 'react-bootstrap'
import ReactTelephoneInput from 'react-telephone-input'
import SelectWrapper from '../../select-wrapper'
import PasswordFields from '../../password-fields'

import IconEye from '../../icons/icon-eye.jsx'

import {FormattedMessage, injectIntl} from 'react-intl';

let errors = {}
const validate = (values) => {
  errors = {}

  const {
    email,
    password,
    confirm,
    role
  } = values

  if(!email || email.length === 0) {
    errors.email = <FormattedMessage id="portal.user.edit.emailRequired.text"/>
  }

  if(password && password !== confirm) {
    errors.password = <FormattedMessage id="portal.user.edit.passwordDoNotMatch.text"/>
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
      passwordVisible: false
    }

    this.save = this.save.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
  }

  save() {
    const {
      fields: {
        first_name,
        last_name,
        password,
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

    if(password && password.value.length !== 0) {
      newValues.password = password.value
    }

    this.props.onSave(newValues)
  }

  resetPassword() {
    //noinspection Eslint
    // console.log('UserEditForm.resetPassword()')
  }

  togglePasswordVisibility() {
    this.setState({
      passwordVisible: !this.state.passwordVisible
    })
  }

  render() {
    const {
      fields: {
        email,
        first_name,
        last_name,
        password,
        confirm,
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

        <hr/>

        {/* TODO: Finish once functionality allows it (not in 0.8)
        <div className="form-group password-reset">
          <label className="control-label">Password</label>
          <div className="password-reset__wrapper">
            <Button bsStyle="primary" onClick={this.resetPassword}>Reset</Button>
            <p className="password-reset__description">
              Sends the user a link with instructions
              <br/>on how to reset their password
            </p>
          </div>
        </div>
        */}

        {/* This is a temporary solution for password reset in 0.8 */}
        <div className="user-form__password">
          <Row>
            <Col xs={11}>
              <label><FormattedMessage id="portal.user.edit.resetPassword.text"/></label>
              <PasswordFields inlinePassword={true}/>
              {/*
              <Row>
                <Col xs={6}>
                  <Input
                    {...password}
                    type={this.state.passwordVisible ? 'text' : 'password'}
                    placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.newPassword.text'})} />
                  {password.touched && password.error && !password.active && !confirm.active &&
                    <div className="error-msg">{password.error}</div>}
                </Col>

                <Col xs={6}>
                  <Input
                    {...confirm}
                    type={this.state.passwordVisible ? 'text' : 'password'}
                    placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.confirmNewPassword.text'})}
                    wrapperClassName="input-addon-after-outside"
                    addonAfter={<a className={'input-addon-link' +
                        (this.state.passwordVisible ? ' active' : '')}
                        onClick={this.togglePasswordVisibility}>
                          <IconEye/>
                      </a>}/>
                </Col>
              </Row>
              */}
            </Col>
          </Row>
        </div>

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
          <Button disabled={!!Object.keys(errors).length} bsStyle="primary"
                  onClick={this.save}><FormattedMessage id="portal.button.save"/></Button>
        </ButtonToolbar>
      </form>
    )
  }
}

UserEditForm.propTypes = {
  fields: PropTypes.object,
  groupOptions: PropTypes.array,
  intl: PropTypes.object,
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
    'password',
    'confirm',
    'phone_number',
    'role',
    'groups'
  ],
  validate: validate
})(injectIntl(UserEditForm))
