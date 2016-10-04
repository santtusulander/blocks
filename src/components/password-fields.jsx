import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import { Input, Tooltip } from 'react-bootstrap'
import classNames from 'classnames'

import IconPassword from '../components/icons/icon-password.jsx'
import IconEye from '../components/icons/icon-eye.jsx'

class PasswordFields extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      passwordActive: false,
      passwordError: null,
      passwordFocus: false,
      passwordValid: false,
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
    this.changeField('password')(e)
    this.setState({
      passwordValid: this.validatePassword(e.target.value),
      passwordLengthValid: this.validatePasswordLengthValid(e.target.value),
      passwordUppercaseValid: this.validatePasswordUppercaseValid(e.target.value),
      passwordNumberValid: this.validatePasswordNumberValid(e.target.value),
      passwordSpecialCharValid: this.validatePasswordSpecialCharValid(e.target.value)
    })
    this.doPasswordsMatch(e.target.value, this.state.confirm)
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
    this.doPasswordsMatch(this.state.password, e.target.value)
  }

  changeField(key) {
    return e => {
      const newState = {}
      newState[key] = e.target.value
      this.setState(newState)
    }
  }

  doPasswordsMatch(password, confirm) {
    const validPassword = password === confirm
    this.setState({
      confirmValid: validPassword
    })
    if (this.props.validPassword) {
      this.props.validPassword(validPassword)
    }
  }

  validatePassword(password) {
    return password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[ !"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~])[0-9a-zA-Z !"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]{8,}$/) !== null
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
    const { stackedPassword, inlinePassword, intl } = this.props
    const showPasswordRequirements = this.state.passwordFocus && !this.state.passwordValid
    const showPasswordError = !this.state.passwordValid && !this.state.passwordFocus && this.state.password !== ''
    const showConfirmError = this.state.passwordValid && !this.state.confirmValid && !this.state.confirmFocus && this.state.confirm !== ''

    let passwordWrapperClassName = classNames(
      {
        'input-addon-before input-addon-after-outside has-login-label login-label-password': stackedPassword,
        'invalid': showPasswordError,
        'valid': this.state.passwordValid,
        'active': this.state.passwordFocus || this.state.password
      }
    )

    let confirmWrapperClassName = classNames(
      {
        'input-addon-before has-login-label login-label-confirm': stackedPassword,
        'invalid': showConfirmError,
        'valid': this.state.passwordValid && this.state.confirmValid && this.state.confirm !== '',
        'active': this.state.confirmFocus || this.state.confirm
      },
      'input-addon-after-outside'
    )

    let layoutClassName = classNames(
      {
        'inline-form-layout': inlinePassword
      }
    )

    const requirementsTooltip = showPasswordRequirements ?
      <Tooltip id="password-requirements" placement="top" className="input-tooltip interactive-password-tooltip in">
        <span>Requirements:</span><br/>
        <span className={this.state.passwordLengthValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordLengthValid.text"/></span><br/>
        <span className={this.state.passwordUppercaseValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordUppercaseValid.text"/></span><br/>
        <span className={this.state.passwordNumberValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordNumberValid.text"/></span><br/>
        <span className={this.state.passwordSpecialCharValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordSpecialCharValid.text"/></span>
      </Tooltip>
    : null

    const passwordField = (
      <Input id="password"
        type={this.state.passwordVisible || !stackedPassword && this.state.confirmVisible ? 'text' : 'password'}
        placeholder={!stackedPassword ? intl.formatMessage({id: 'portal.user.edit.newPassword.text'}) : ''}
        wrapperClassName={passwordWrapperClassName}
        addonBefore={stackedPassword && <IconPassword/>}
        addonAfter={stackedPassword && <a className={'input-addon-link' +
            (this.state.passwordVisible ? ' active' : '')}
            onClick={this.togglePasswordVisibility}>
              <IconEye/>
          </a>}
        onFocus={this.passwordFocus(true)}
        onBlur={this.passwordFocus(false)}
        value={this.state.password}
        onChange={this.changePassword} />
    )

    const confirmationField = (
      <Input id="confirm"
        type={this.state.confirmVisible ? 'text' : 'password'}
        placeholder={!stackedPassword ? intl.formatMessage({id: 'portal.user.edit.confirmNewPassword.text'}) : ''}
        wrapperClassName={confirmWrapperClassName}
        addonBefore={stackedPassword && <IconPassword/>}
        addonAfter={<a className={'input-addon-link' +
            (this.state.confirmVisible ? ' active' : '')}
            onClick={this.toggleConfirmVisibility}>
              <IconEye/>
          </a>}
        onFocus={this.confirmFocus(true)}
        onBlur={this.confirmFocus(false)}
        value={this.state.confirm}
        onChange={this.changeConfirm} />
    )

    const confirmErrorTooltip = (
      showConfirmError ?
        <Tooltip id="confirm-error" placement="bottom" className="input-tooltip in">
          <FormattedMessage id="portal.password.passwordDoNotMatch.text"/>
        </Tooltip>
      : null
    )

    return (
      <div className={layoutClassName}>
        {requirementsTooltip}
        {passwordField}
        {confirmationField}
        {confirmErrorTooltip}
      </div>
    )
  }
}

PasswordFields.displayName = 'PasswordFields'
PasswordFields.propTypes = {
  inlinePassword: React.PropTypes.bool,
  intl: React.PropTypes.object,
  stackedPassword: React.PropTypes.bool,
  validPassword: React.PropTypes.func
};

export default injectIntl(PasswordFields)
