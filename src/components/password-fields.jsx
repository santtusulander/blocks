import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import { FormControl, FormGroup, InputGroup, Tooltip } from 'react-bootstrap'
import classNames from 'classnames'

import IconPassword from '../components/shared/icons/icon-password.jsx'
import IconEye from '../components/shared/icons/icon-eye.jsx'

export class PasswordFields extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      passwordActive: false,
      passwordError: null,
      passwordFocus: false,
      passwordValid: props.required ? false : true,
      passwordVisible: false,
      confirm: '',
      confirmActive: false,
      confirmFocus: false,
      confirmValid: false,
      confirmVisible: false,
      passwordLengthValid: false,
      passwordUppercaseValid: false,
      passwordNumberValid: false,
      passwordSpecialCharValid: false
    }

    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.passwordFocus = this.passwordFocus.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.toggleConfirmVisibility = this.toggleConfirmVisibility.bind(this)
    this.confirmFocus = this.confirmFocus.bind(this)
    this.changeConfirm = this.changeConfirm.bind(this)
    this.changeField = this.changeField.bind(this)
    this.validatePassword = this.validatePassword.bind(this)
    this.validatePasswordLengthValid = this.validatePasswordLengthValid.bind(this)
    this.validatePasswordUppercaseValid = this.validatePasswordUppercaseValid.bind(this)
    this.validatePasswordNumberValid = this.validatePasswordNumberValid.bind(this)
    this.validatePasswordSpecialCharValid = this.validatePasswordSpecialCharValid.bind(this)
  }

  togglePasswordVisibility() {
    this.setState({
      passwordVisible: !this.state.passwordVisible
    })
  }

  passwordFocus(hasFocus) {
    return () => {
      this.setState({
        passwordActive: hasFocus || !this.state.password,
        passwordFocus: hasFocus
      })
    }
  }

  changePassword(e) {
    if (this.props.onChange) {
      this.props.onChange(e)
    }
    this.changeField('password')(e)
    const passwordValid = this.validatePassword(e.target.value)
    this.setState({
      passwordValid,
      passwordLengthValid: this.validatePasswordLengthValid(e.target.value),
      passwordUppercaseValid: this.validatePasswordUppercaseValid(e.target.value),
      passwordNumberValid: this.validatePasswordNumberValid(e.target.value),
      passwordSpecialCharValid: this.validatePasswordSpecialCharValid(e.target.value)
    })
    this.doPasswordsMatch(e.target.value, this.state.confirm, passwordValid)
  }

  toggleConfirmVisibility() {
    this.setState({
      confirmVisible: !this.state.confirmVisible
    })
  }

  confirmFocus(hasFocus) {
    return () => {
      this.setState({
        confirmActive: hasFocus || !this.state.confirm,
        confirmFocus: hasFocus
      })
    }
  }

  changeConfirm(e) {
    this.changeField('confirm')(e)
    this.doPasswordsMatch(this.state.password, e.target.value, this.state.passwordValid)
  }

  changeField(key) {
    return e => {
      const newState = {}
      newState[key] = e.target.value
      this.setState(newState)
    }
  }

  doPasswordsMatch(password, confirm, isValidString) {
    const validPassword = (password === confirm) && isValidString

    this.setState({
      confirmValid: validPassword
    })
    if (this.props.changePassword) {
      this.props.changePassword(validPassword)
    }
  }

  /**
   * If required OR not required and has characters, test the password.
   * If not required and empty, consider as valid
   */
  validatePassword(password) {
    return this.props.required || !!password.length
      ? password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[ !"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~])[0-9a-zA-Z !"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]{8,}$/) !== null
      : true
  }

  validatePasswordLengthValid(password) {
    return password.match(/([0-9a-zA-Z !"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]{8,})/) !== null
  }

  validatePasswordUppercaseValid(password) {
    return password.match(/([A-Z]+)/) !== null
  }

  validatePasswordNumberValid(password) {
    return password.match(/([0-9]+)/) !== null
  }

  validatePasswordSpecialCharValid(password) {
    return password.match(/([ !"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]+)/) !== null
  }

  render() {
    const {
      props: { stackedPassword, inlinePassword, intl },
      state: { passwordValid, passwordFocus, password, confirm, confirmValid, confirmFocus }
    } = this
    const showPasswordRequirements = passwordFocus && !passwordValid
    const showPasswordError = !passwordValid && !passwordFocus && password !== ''
    const showConfirmError = passwordValid && !confirmValid && !confirmFocus && confirm !== ''

    const passwordWrapperClassName = classNames(
      {
        'input-addon-before input-addon-after-outside has-login-label': stackedPassword,
        'invalid': showPasswordError,
        'valid': passwordValid && !!password.length,
        'active': passwordFocus || password
      },
      'login-label-password'
    )

    const confirmWrapperClassName = classNames(
      {
        'input-addon-before has-login-label login-label-confirm': stackedPassword,
        'invalid': showConfirmError,
        'valid': passwordValid && confirmValid && confirm !== '',
        'active': confirmFocus || confirm
      },
      'input-addon-after-outside'
    )

    const layoutClassName = classNames(
      {
        'inline-form-layout': inlinePassword
      }
    )

    const requirementsTooltip = showPasswordRequirements ?
      (<Tooltip id="password-requirements" placement="top" className="input-tooltip interactive-password-tooltip in">
        <span>Requirements:</span><br/>
        <span className={this.state.passwordLengthValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordLengthValid.text"/></span><br/>
        <span className={this.state.passwordUppercaseValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordUppercaseValid.text"/></span><br/>
        <span className={this.state.passwordNumberValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordNumberValid.text"/></span><br/>
        <span className={this.state.passwordSpecialCharValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordSpecialCharValid.text"/></span>
      </Tooltip>)
    : null

    const passwordField = (
      <FormGroup>
        {requirementsTooltip}
        <InputGroup className={passwordWrapperClassName}>
          {stackedPassword &&
            <InputGroup.Addon>
                <IconPassword/>
            </InputGroup.Addon>}
          <FormControl
            id="password"
            type={this.state.passwordVisible || (!stackedPassword && this.state.confirmVisible) ? 'text' : 'password'}
            placeholder={!stackedPassword ? intl.formatMessage({id: 'portal.user.edit.newPassword.text'}) : ''}
            className="form-control"
            onFocus={this.passwordFocus(true)}
            onBlur={this.passwordFocus(false)}
            onChange={this.changePassword}
            value={this.props.value || this.state.password}/>
        {stackedPassword &&
          <InputGroup.Addon>
            <a
              className={classNames('input-addon-link', { active: this.state.passwordVisible })}
              onClick={this.togglePasswordVisibility}>
              <IconEye/>
            </a>
          </InputGroup.Addon>}
      </InputGroup>
    </FormGroup>
    )

    const confirmErrorTooltip = (
      showConfirmError ?
        (<Tooltip id="confirm-error"
          placement={stackedPassword ? 'bottom' : 'top'}
          className={(stackedPassword ? 'stacked-tooltip ' : '') + 'input-tooltip in'}>
          <FormattedMessage id="portal.password.passwordDoNotMatch.text"/>
        </Tooltip>)
      : null
    )

    const confirmationField = (
      <FormGroup>
        {confirmErrorTooltip}
        <InputGroup className={confirmWrapperClassName}>
          {stackedPassword &&
            <InputGroup.Addon>
              <IconPassword/>
            </InputGroup.Addon>}
          <FormControl
            id="confirm"
            type={this.state.confirmVisible ? 'text' : 'password'}
            placeholder={!stackedPassword ? intl.formatMessage({id: 'portal.user.edit.confirmNewPassword.text'}) : ''}
            className="form-control"
            onFocus={this.confirmFocus(true)}
            onBlur={this.confirmFocus(false)}
            value={this.state.confirm}
            onChange={this.changeConfirm}/>
          <InputGroup.Addon>
            <a
              className={classNames('input-addon-link', { active: this.state.confirmVisible })}
              onClick={this.toggleConfirmVisibility}>
              <IconEye/>
            </a>
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    )

    return (
      <div className={layoutClassName}>
        {passwordField}
        {confirmationField}
      </div>
    )
  }
}

PasswordFields.displayName = 'PasswordFields'
PasswordFields.propTypes = {
  changePassword: React.PropTypes.func,
  inlinePassword: React.PropTypes.bool,
  intl: React.PropTypes.object,
  onChange: React.PropTypes.func,
  required: React.PropTypes.bool,
  stackedPassword: React.PropTypes.bool,
  value: React.PropTypes.string
};

export default injectIntl(PasswordFields)
