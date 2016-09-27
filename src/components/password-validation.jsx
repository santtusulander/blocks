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
      passwordValid: false
    }
  }

  passwordFocus(hasFocus) {
    return () => {
      this.setState({
        passwordActive: hasFocus || !this.state.password,
        passwordFocus: hasFocus
      })
    }
  }

  render() {
    const { loginPassword, intl } = this.props

    return (
      <Input id="password"
        type='password'
        placeholder={!loginPassword && intl.formatMessage({id: 'portal.user.edit.newPassword.text'})}
        wrapperClassName={loginPassword && ('input-addon-before input-addon-after-outside '
          + 'has-login-label login-label-password'
          + (this.state.passwordFocus || this.state.password ? ' active' : ''))}
        addonBefore={loginPassword && <IconPassword/>}
        addonAfter={loginPassword && <a className={'input-addon-link'}><IconEye/></a>}
        onFocus={loginPassword && this.passwordFocus(true)}
        onBlur={loginPassword && this.passwordFocus(false)}
        value={this.state.password} />
    )
  }
}

PasswordValidation.displayName = 'PasswordValidation'
PasswordValidation.propTypes = {
  intl: React.PropTypes.object,
  loginPassword: React.PropTypes.bool
};

export default injectIntl(PasswordValidation)
