import React from 'react';
import { Input, Overlay, Tooltip } from 'react-bootstrap'

import IconPassword from '../components/icons/icon-password.jsx'
import IconEye from '../components/icons/icon-eye.jsx'

import { injectIntl } from 'react-intl';

class PasswordValidation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      passwordActive: false,
      passwordError: null,
      passwordFocus: false,
      passwordValid: false,
      passwordLengthValid: false,
      passwordUppercaseValid: false,
      passwordNumberValid: false,
      passwordSpecialCharValid: false
    }

    this.passwordFocus = this.passwordFocus.bind(this)
    this.changeField = this.changeField.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.validatePassword = this.validatePassword.bind(this)
    this.validatePasswordLengthValid = this.validatePasswordLengthValid.bind(this)
    this.validatePasswordUppercaseValid = this.validatePasswordUppercaseValid.bind(this)
    this.validatePasswordNumberValid = this.validatePasswordNumberValid.bind(this)
    this.validatePasswordSpecialCharValid = this.validatePasswordSpecialCharValid.bind(this)
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
  }

  changeField(key) {
    return e => {
      const newState = {}
      newState[key] = e.target.value
      this.setState(newState)
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
    const { loginPassword, intl } = this.props
    const showPasswordRequirements = this.state.passwordFocus && !this.state.passwordValid

    return (
      <div>
        {showPasswordRequirements ?
          <Tooltip id="password-requirements" placement="top" className="input-tooltip interactive-password-tooltip in">
            <span>Requirements:</span><br/>
            <span className={this.state.passwordLengthValid ? 'valid' : ''}>- at least 8 characters</span><br/>
            <span className={this.state.passwordUppercaseValid ? 'valid' : ''}>- at least one uppercase character</span><br/>
            <span className={this.state.passwordNumberValid ? 'valid' : ''}>- at least one number</span><br/>
            <span className={this.state.passwordSpecialCharValid ? 'valid' : ''}>- at least one special character (!,?,#,$,...)</span>
          </Tooltip>
        : null}

        <Input id="password"
          type='password'
          placeholder={!loginPassword && intl.formatMessage({id: 'portal.user.edit.newPassword.text'})}
          wrapperClassName={loginPassword && ('input-addon-before input-addon-after-outside '
            + 'has-login-label login-label-password'
            + (!this.state.passwordValid && !this.state.passwordFocus && this.state.password !== '' ? ' invalid' : '')
            + (this.state.passwordValid ? ' valid' : '')
            + (this.state.passwordFocus || this.state.password ? ' active' : ''))}
          addonBefore={loginPassword && <IconPassword/>}
          addonAfter={loginPassword && <a className={'input-addon-link'}><IconEye/></a>}
          onFocus={loginPassword && this.passwordFocus(true)}
          onBlur={loginPassword && this.passwordFocus(false)}
          value={this.state.password}
          onChange={this.changePassword} />
      </div>
    )
  }
}

PasswordValidation.displayName = 'PasswordValidation'
PasswordValidation.propTypes = {
  intl: React.PropTypes.object,
  loginPassword: React.PropTypes.bool
};

export default injectIntl(PasswordValidation)
