import React, { Component } from 'react'
import { Button, Col, FormControl, FormGroup, InputGroup, Checkbox, Modal, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'

import IconEmail from '../icons/icon-email.jsx'
import IconPassword from '../icons/icon-password.jsx'

export class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordActive: false,
      rememberUsername: !!props.userName,
      username: props.userName || '',
      usernameActive: false
    }

    this.checkUsernameActive = this.checkUsernameActive.bind(this)
    this.checkPasswordActive = this.checkPasswordActive.bind(this)
    this.changeField = this.changeField.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.toggleRemember = this.toggleRemember.bind(this)
  }

  checkUsernameActive(hasFocus) {
    return () => {
      if (hasFocus || !this.state.username) {
        this.setState({ usernameActive: hasFocus })
      }
    }
  }

  checkPasswordActive(hasFocus) {
    return () => {
      if (hasFocus || !this.state.password) {
        this.setState({ passwordActive: hasFocus })
      }
    }
  }

  changeField(key) {
    return e => {
      const newState = {}
      newState[key] = e.target.value
      this.setState(newState)
    }
  }

  toggleRemember() {
    this.setState({rememberUsername: !this.state.rememberUsername})
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state.username,
                        this.state.password,
                        this.state.rememberUsername)
  }

  render() {
    const usernameClass = classnames(
      'input-addon-before',
      'has-login-label',
      'login-label-username',
      { active: this.state.usernameActive || this.state.username }
    )
    const passwordClass = classnames(
      'input-addon-before',
      'has-login-label',
      'login-label-password',
      'input-addon-after-outside',
      { active: this.state.passwordActive || this.state.password }
    )
    return (
      <Modal.Dialog className="login-modal">
        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.login.title"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={this.onSubmit}>

            { this.props.sessionExpired &&
              <div className="login-info">
                <p><FormattedMessage id="portal.login.sessionExpired.text" /></p>
              </div>
            }

            {this.props.loginError &&
              <div className="login-info">
                <p>{this.props.loginError}</p>
              </div>
            }
            <FormGroup className={usernameClass}>
              <InputGroup>
                <InputGroup.Addon>
                  <IconEmail/>
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  id="username"
                  onFocus={this.checkUsernameActive(true)}
                  onBlur={this.checkUsernameActive(false)}
                  value={this.state.username}
                  onChange={this.changeField('username')}/>
              </InputGroup>
            </FormGroup>
            <FormGroup className={passwordClass}>
              <InputGroup>
                <InputGroup.Addon>
                  <IconPassword/>
                </InputGroup.Addon>
                <FormControl
                  id="password"
                  type="password"
                  onFocus={this.checkPasswordActive(true)}
                  onBlur={this.checkPasswordActive(false)}
                  value={this.state.password}
                  onChange={this.changeField('password')}/>
              </InputGroup>
            </FormGroup>
            <Row>
              <Col xs={4}>
                <div className="remember-checkbox">
                  <Checkbox onChange={this.toggleRemember}
                            checked={this.state.rememberUsername}>
                    <FormattedMessage id="portal.login.rememberMe.text" />
                  </Checkbox>
                </div>
              </Col>
              <Col xs={8}>
                <Button type="submit" bsStyle="primary"
                        className="pull-right"
                        disabled={this.props.fetching || !this.state.username || !this.state.password}>
                  {this.props.fetching ? <FormattedMessage id="portal.button.loggingIn"/> : <FormattedMessage id="portal.button.login"/>}
                </Button>
                <Link to={`/forgot-password`} className="btn btn-link pull-right">
                  <FormattedMessage id="portal.login.forgotPassword.text"/>
                </Link>
              </Col>
            </Row>
          </form>
          <p className="text-sm login-copyright">
            <FormattedMessage id="portal.login.copyright.text" />
            <br/>
            <FormattedMessage id="portal.login.termsOfUse.text"/>
            <a href="https://www.ericsson.com/legal">
              <FormattedMessage id="portal.footer.termsOfUse.text"/>
            </a>
          </p>
        </Modal.Body>
      </Modal.Dialog>

    );
  }
}

LoginForm.displayName = "LoginForm"
LoginForm.propTypes = {
  fetching: React.PropTypes.bool,
  loginError: React.PropTypes.oneOfType(React.PropTypes.string, React.PropTypes.object),
  onSubmit: React.PropTypes.func,
  sessionExpired: React.PropTypes.string,
  userName: React.PropTypes.string
}

export default LoginForm;
