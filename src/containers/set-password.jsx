import React from 'react'
import { Button, Col, Input, Modal, Row, Tooltip } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import { getContentUrl } from '../util/routes'

import * as userActionCreators from '../redux/modules/user'

import IconPassword from '../components/icons/icon-password.jsx'
import IconEye from '../components/icons/icon-eye.jsx'

import { FormattedMessage } from 'react-intl'

export class SetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      confirm: '',
      confirmActive: false,
      confirmFocus: false,
      confirmValid: false,
      confirmVisible: false,
      password: '',
      passwordActive: false,
      passwordError: null,
      passwordFocus: false,
      passwordValid: false,
      passwordLengthValid: false,
      passwordUppercaseValid: false,
      passwordNumberValid: false,
      passwordSpecialCharValid: false,
      passwordVisible: false
    }

    this.toggleConfirmVisibility = this.toggleConfirmVisibility.bind(this)
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.confirmFocus = this.confirmFocus.bind(this)
    this.passwordFocus = this.passwordFocus.bind(this)
    this.changeField = this.changeField.bind(this)
    this.changeConfirm = this.changeConfirm.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.goToLoginPage = this.goToLoginPage.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.validatePassword = this.validatePassword.bind(this)
    this.validatePasswordLengthValid = this.validatePasswordLengthValid.bind(this)
    this.validatePasswordUppercaseValid = this.validatePasswordUppercaseValid.bind(this)
    this.validatePasswordNumberValid = this.validatePasswordNumberValid.bind(this)
    this.validatePasswordSpecialCharValid = this.validatePasswordSpecialCharValid.bind(this)
  }
  goToLoginPage() {
    this.props.router.push(getContentUrl('/login', {}))
  }
  onSubmit(e) {
    e.preventDefault()
    this.setState({loginError: null})
    // TODO: API connections
    // this.props.userActions.startFetching()
    // this.props.userActions.logIn(
    //   this.state.username,
    //   this.state.password
    // ).then(action => {
    //   if(!action.error) {
    //     this.goToLoginPage()
    //   }
    //   else {
    //     this.setState({
    //       passwordError: action.payload.message
    //     })
    //   }
    // })
  }
  toggleConfirmVisibility() {
    this.setState({
      confirmVisible: !this.state.confirmVisible
    })
  }
  togglePasswordVisibility() {
    this.setState({
      passwordVisible: !this.state.passwordVisible
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
  passwordFocus(hasFocus) {
    return () => {
      this.setState({
        passwordActive: hasFocus || !this.state.password,
        passwordFocus: hasFocus
      })
    }
  }
  changeConfirm(e) {
    this.changeField('confirm')(e)
    if(this.state.passwordValid) {
      this.setState({
        confirmValid: this.state.password === e.target.value
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

  /* Regex explanation
    /^([0-9a-zA-Z\ ~\!@\#\$\-_]{8,})$/     should contain at least 8 from the mentioned characters
    /([A-Z]+)/                             should contain at least one uppercase
    /([0-9]+)/                             should contain at least one digit
    ([?!@#\$%\^\&*\)\(\/\\\<\>\ ~`+=._-]+) should contain at least one special character
  */
  validatePassword(password) {
    return password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[\ ~\?!@\#\$\-_])[0-9a-zA-Z\ ~\?!@\#\$\-_]{8,}$/) !== null
  }
  validatePasswordLengthValid(password) {
    return password.match(/([0-9a-zA-Z\ ~\?!@\#\$\-_]{8,})/) !== null
  }
  validatePasswordUppercaseValid(password) {
    return password.match(/([A-Z]+)/) !== null
  }
  validatePasswordNumberValid(password) {
    return password.match(/([0-9]+)/) !== null
  }
  validatePasswordSpecialCharValid(password) {
    return password.match(/([\ ~\?!@\#\$\-_]+)/) !== null
  }

  render() {
    const showPasswordRequirements = this.state.passwordFocus && !this.state.passwordValid
    const showConfirmError = this.state.passwordValid && !this.state.confirmValid && !this.state.confirmFocus
    // const showConfirmError = this.state.passwordValid && this.state.confirm && this.state.confirmValid && !this.state.confirmFocus

    return (
      <Modal.Dialog className="login-modal">

        <Modal.Header className="login-header">
          <div className="login-header-gradient"></div>
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.login.title"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={this.onSubmit}>
            {showPasswordRequirements ?
              <Tooltip id="password-requirements" placement="top" className="input-tooltip interactive-password-tooltip in">
                <span>Requirements:</span><br/>
                <span className={this.state.passwordLengthValid ? 'active' : ''}>- at least 8 characters</span><br/>
                <span className={this.state.passwordUppercaseValid ? 'active' : ''}>- at least one uppercase character</span><br/>
                <span className={this.state.passwordNumberValid ? 'active' : ''}>- at least one number</span><br/>
                <span className={this.state.passwordSpecialCharValid ? 'active' : ''}>- at least one special character (!,?,#,$,...)</span>
              </Tooltip>
            : null}

            <Input id="password"
              type={this.state.passwordVisible ? 'text' : 'password'}
              wrapperClassName={'input-addon-before input-addon-after-outside '
                + 'has-login-label login-label-password'
                + (!this.state.passwordValid && !this.state.passwordFocus && this.state.password !== '' ? ' invalid' : '')
                + (this.state.passwordValid ? ' valid' : '')
                + (this.state.passwordFocus || this.state.password ? ' active' : '')}
              addonBefore={<IconPassword/>}
              addonAfter={<a className={'input-addon-link' +
                  (this.state.passwordVisible ? ' active' : '')}
                  onClick={this.togglePasswordVisibility}>
                    <IconEye/>
                </a>}
              onFocus={this.passwordFocus(true)}
              onBlur={this.passwordFocus(false)}
              value={this.state.password}
              onChange={this.changePassword}/>

            <Input id="confirm"
              type={this.state.confirmVisible ? 'text' : 'password'}
              wrapperClassName={'input-addon-before input-addon-after-outside '
                + 'has-login-label login-label-confirm'
                + (showConfirmError && this.state.confirm !== '' ? ' invalid' : '')
                + (this.state.confirmValid && this.state.confirm !== '' ? ' valid' : '')
                + (this.state.confirmFocus || this.state.confirm ? ' active' : '')}
              addonBefore={<IconPassword/>}
              addonAfter={<a className={'input-addon-link' +
                  (this.state.confirmVisible ? ' active' : '')}
                  onClick={this.toggleConfirmVisibility}>
                    <IconEye/>
                </a>}
              onFocus={this.confirmFocus(true)}
              onBlur={this.confirmFocus(false)}
              value={this.state.confirm}
              onChange={this.changeConfirm}/>

            {showConfirmError && this.state.confirm !== '' ?
              <Tooltip id="confirm-error" placement="bottom" className="input-tooltip in">
                <FormattedMessage id="portal.passsword.passwordDoNotMatch.text"/>
              </Tooltip>
            : null}

            <Row>
              <Col xs={12}>
                <Button type="submit" bsStyle="primary" className="pull-right"
                  disabled={this.props.fetching || !this.state.confirmValid}>
                  {this.props.reset ?
                    this.props.fetching ? <FormattedMessage id="portal.button.resetting"/> : <FormattedMessage id="portal.button.reset"/>
                  : this.props.fetching ? <FormattedMessage id="portal.button.setting"/> : <FormattedMessage id="portal.button.set"/>}
                </Button>
              </Col>
            </Row>

          </form>
        </Modal.Body>

      </Modal.Dialog>
    );
  }
}

SetPassword.displayName = 'SetPassword'
SetPassword.propTypes = {
  fetching: React.PropTypes.bool,
  loggedIn: React.PropTypes.bool,
  reset: React.PropTypes.bool,
  router: React.PropTypes.object,
  userActions: React.PropTypes.object
}


function mapStateToProps(state) {
  return {
    fetching: state.user.get('fetching') || state.account.get('fetching'),
    loggedIn: state.user.get('loggedIn')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SetPassword));
