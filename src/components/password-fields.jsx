import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import { Input, Tooltip } from 'react-bootstrap'

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
    this.props.validPassword(validPassword)
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
    const { loginPassword, intl } = this.props
    const showPasswordRequirements = this.state.passwordFocus && !this.state.passwordValid
    const showPasswordError = !this.state.passwordValid && !this.state.passwordFocus && this.state.password !== ''
    const showConfirmError = this.state.passwordValid && !this.state.confirmValid && !this.state.confirmFocus && this.state.confirm !== ''

    return (
      <div>
        {showPasswordRequirements ?
          <Tooltip id="password-requirements" placement="top" className="input-tooltip interactive-password-tooltip in">
            <span>Requirements:</span><br/>
            <span className={this.state.passwordLengthValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordLengthValid.text"/></span><br/>
            <span className={this.state.passwordUppercaseValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordUppercaseValid.text"/></span><br/>
            <span className={this.state.passwordNumberValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordNumberValid.text"/></span><br/>
            <span className={this.state.passwordSpecialCharValid ? 'valid' : ''}>- <FormattedMessage id="portal.password.passwordSpecialCharValid.text"/></span>
          </Tooltip>
        : null}

        <Input id="password"
          type={this.state.passwordVisible ? 'text' : 'password'}
          placeholder={!loginPassword ? intl.formatMessage({id: 'portal.user.edit.newPassword.text'}) : ''}
          wrapperClassName={loginPassword && ('input-addon-before input-addon-after-outside '
            + 'has-login-label login-label-password'
            + (showPasswordError ? ' invalid' : '')
            + (this.state.passwordValid ? ' valid' : '')
            + (this.state.passwordFocus || this.state.password ? ' active' : ''))}
          addonBefore={loginPassword && <IconPassword/>}
          addonAfter={loginPassword && <a className={'input-addon-link' +
              (this.state.passwordVisible ? ' active' : '')}
              onClick={this.togglePasswordVisibility}>
                <IconEye/>
            </a>}
          onFocus={loginPassword && this.passwordFocus(true)}
          onBlur={loginPassword && this.passwordFocus(false)}
          value={this.state.password}
          onChange={this.changePassword} />

        <Input id="confirm"
          type={this.state.confirmVisible ? 'text' : 'password'}
          wrapperClassName={loginPassword && ('input-addon-before input-addon-after-outside '
            + 'has-login-label login-label-confirm'
            + (showConfirmError ? ' invalid' : '')
            + (this.state.passwordValid && this.state.confirmValid && this.state.confirm !== '' ? ' valid' : '')
            + (this.state.confirmFocus || this.state.confirm ? ' active' : ''))}
          addonBefore={loginPassword && <IconPassword/>}
          addonAfter={loginPassword && <a className={'input-addon-link' +
              (this.state.confirmVisible ? ' active' : '')}
              onClick={this.toggleConfirmVisibility}>
                <IconEye/>
            </a>}
          onFocus={loginPassword && this.confirmFocus(true)}
          onBlur={loginPassword && this.confirmFocus(false)}
          value={this.state.confirm}
          onChange={this.changeConfirm} />

        {showConfirmError ?
          <Tooltip id="confirm-error" placement="bottom" className="input-tooltip in">
            <FormattedMessage id="portal.password.passwordDoNotMatch.text"/>
          </Tooltip>
        : null}
      </div>
    )
  }
}

PasswordFields.displayName = 'PasswordFields'
PasswordFields.propTypes = {
  intl: React.PropTypes.object,
  loginPassword: React.PropTypes.bool,
  validPassword: React.PropTypes.func
};

export default injectIntl(PasswordFields)
