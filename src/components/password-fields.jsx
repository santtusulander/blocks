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
    if(this.props.onChange) {
      this.props.onChange(e)
    }
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
    if (this.props.changePassword) {
      this.props.changePassword(validPassword)
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
        'input-addon-before input-addon-after-outside has-login-label': stackedPassword,
        'invalid': showPasswordError,
        'valid': this.state.passwordValid,
        'active': this.state.passwordFocus || this.state.password
      },
      'login-label-password'
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
      <Input
        wrapperClassName={passwordWrapperClassName}
        addonBefore={stackedPassword && <IconPassword/>}
        addonAfter={stackedPassword && <a
          className={'input-addon-link' +
          (this.state.confirmVisible ? ' active' : '')}
          onClick={this.togglePasswordVisibility}>
            <IconEye/>
        </a>}>
        {requirementsTooltip}
        <input
          type={this.state.passwordVisible || (!stackedPassword && this.state.confirmVisible) ? 'text' : 'password'}
          placeholder={!stackedPassword ? intl.formatMessage({id: 'portal.user.edit.newPassword.text'}) : ''}
          className="form-control"
          onFocus={this.passwordFocus(true)}
          onBlur={this.passwordFocus(false)}
          onChange={this.changePassword}
          value={this.props.value || this.state.password} />
      </Input>
    )

    const confirmErrorTooltip = (
      showConfirmError ?
        <Tooltip id="confirm-error"
          placement={stackedPassword ? 'bottom' : 'top'}
          className={(stackedPassword ? 'stacked-tooltip ' : '') + 'input-tooltip in'}>
          <FormattedMessage id="portal.password.passwordDoNotMatch.text"/>
        </Tooltip>
      : null
    )

    const confirmationField = (
      <Input
        wrapperClassName={confirmWrapperClassName}
        addonBefore={stackedPassword && <IconPassword/>}
        addonAfter={<a
          className={'input-addon-link' +
          (this.state.confirmVisible ? ' active' : '')}
          onClick={this.toggleConfirmVisibility}>
            <IconEye/>
        </a>}>
        {confirmErrorTooltip}
        <input
          id="confirm"
          type={this.state.confirmVisible ? 'text' : 'password'}
          placeholder={!stackedPassword ? intl.formatMessage({id: 'portal.user.edit.confirmNewPassword.text'}) : ''}
          className="form-control"
          onFocus={this.confirmFocus(true)}
          onBlur={this.confirmFocus(false)}
          value={this.state.confirm}
          onChange={this.changeConfirm} />
      </Input>
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
  passwordField: React.PropTypes.object,
  stackedPassword: React.PropTypes.bool,
  value: React.PropTypes.string
};

export default injectIntl(PasswordFields)
