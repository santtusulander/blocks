import React from 'react'
import { Button, Col, Input, Modal, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import {FormattedMessage, injectIntl} from 'react-intl'

import { getContentUrl } from '../util/routes'

import * as accountActionCreators from '../redux/modules/account'
import * as rolesActionCreators from '../redux/modules/roles'
import * as uiActionCreators from '../redux/modules/ui'
import * as userActionCreators from '../redux/modules/user'

import IconEmail from '../components/icons/icon-email.jsx'
import IconPassword from '../components/icons/icon-password.jsx'
import IconEye from '../components/icons/icon-eye.jsx'

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginError: null,
      password: '',
      passwordActive: false,
      passwordVisible: false,
      rememberUsername: !!props.username,
      username: props.username,
      usernameActive: false
    }

    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.checkUsernameActive = this.checkUsernameActive.bind(this)
    this.checkPasswordActive = this.checkPasswordActive.bind(this)
    this.changeField = this.changeField.bind(this)
    this.goToAccountPage = this.goToAccountPage.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.toggleRemember = this.toggleRemember.bind(this)
  }
  goToAccountPage() {
    if(this.props.loginUrl) {
      this.props.router.push(this.props.loginUrl)
      this.props.uiActions.setLoginUrl(null)
    }
    else {
      this.props.router.push(getContentUrl('brand', 'udn', {}))
    }
  }
  /**
   * Set data on the redux store after login. This method blocks redirecting the
   * user after a successful login. In this method, only get data that is absolutely necessary
   * to get before redirecting the user.
   * @return {Promise}
   */
  getLoggedInData() {
    return Promise.all([
      this.props.rolesActions.fetchRoles(),
      this.props.userActions.fetchUser(this.state.username)
    ])
  }
  onSubmit(e) {
    e.preventDefault()
    this.setState({loginError: null})
    this.props.userActions.startFetching()
    this.props.userActions.logIn(
      this.state.username,
      this.state.password
    ).then(action => {
      if(!action.error) {
        // NOTE: We wait to go to the account page until we receive data because
        // we need to know about roles and permissions before determining what
        // the user is allowed to see.
        if(this.state.rememberUsername) {
          this.props.userActions.saveName(this.state.username)
        }
        else {
          this.props.userActions.saveName()
        }
        return this.getLoggedInData()
          .then(() => {
            this.goToAccountPage()
            this.props.userActions.finishFetching()
          })
      }
      else {
        this.setState({loginError: action.payload.message})
      }
    })
  }
  togglePasswordVisibility() {
    this.setState({
      passwordVisible: !this.state.passwordVisible
    })
  }
  checkUsernameActive(hasFocus) {
    return () => {
      if(hasFocus || !this.state.username) {
        this.setState({
          usernameActive: hasFocus
        })
      }
    }
  }
  checkPasswordActive(hasFocus) {
    return () => {
      if(hasFocus || !this.state.password) {
        this.setState({
          passwordActive: hasFocus
        })
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
  render() {
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
            {this.state.loginError ?
              <div className="login-info">
                <p>{this.state.loginError}</p>
              </div>
              : ''
            }
            <Input type="text" id="username"
              wrapperClassName={'input-addon-before has-login-label '
                + 'login-label-username'
                + (this.state.usernameActive || this.state.username ? ' active' : '')}
              addonBefore={<IconEmail/>}
              onFocus={this.checkUsernameActive(true)}
              onBlur={this.checkUsernameActive(false)}
              value={this.state.username}
              onChange={this.changeField('username')}/>
            <Input id="password"
              type={this.state.passwordVisible ? 'text' : 'password'}
              wrapperClassName={'input-addon-before input-addon-after-outside '
                + 'has-login-label login-label-password'
                + (this.state.passwordActive || this.state.password ? ' active' : '')}
              addonBefore={<IconPassword/>}
              addonAfter={<a className={'input-addon-link' +
                  (this.state.passwordVisible ? ' active' : '')}
                  onClick={this.togglePasswordVisibility}>
                    <IconEye/>
                </a>}
              onFocus={this.checkPasswordActive(true)}
              onBlur={this.checkPasswordActive(false)}
              value={this.state.password}
              onChange={this.changeField('password')}/>
            <Row>
              <Col xs={4}>
                <div className="remember-checkbox">
                  <Input type="checkbox" label={this.props.intl.formatMessage({id: 'portal.login.rememberMe.text'})}
                    onChange={this.toggleRemember}
                    checked={this.state.rememberUsername} />
                </div>
              </Col>
              <Col xs={8}>
                <Button type="submit" bsStyle="primary" className="pull-right"
                  disabled={this.props.fetching}>
                  {this.props.fetching ? <FormattedMessage id="portal.button.loggingIn"/> : <FormattedMessage id="portal.button.login"/>}
                </Button>

                <a href='mailto:support@ericssonudn.com?subject=Password reset request&body=Please, reset my password.' className="btn btn-link pull-right">
                  <FormattedMessage id="portal.login.forgotPassword.text"/>
                </a>

                {/* Maybe needed in future?
                  <Link to={`/forgot-password`} className="btn btn-link pull-right">
                    <FormattedMessage id="portal.login.forgotPassword.text"/>
                  </Link>
                */}
              </Col>
            </Row>
          </form>
          <p className="text-sm login-copyright">
            <FormattedMessage id="portal.login.copyright.text" /><br/>
            <FormattedMessage id="portal.login.termsOfUse.text"/><a href="https://www.ericsson.com/legal"><FormattedMessage id="portal.footer.termsOfUse.text"/></a>
          </p>
        </Modal.Body>
      </Modal.Dialog>

    );
  }
}

Login.displayName = 'Login'
Login.propTypes = {
  accountActions: React.PropTypes.object,
  fetching: React.PropTypes.bool,
  intl: React.PropTypes.object,
  loggedIn: React.PropTypes.bool,
  loginUrl: React.PropTypes.string,
  rolesActions: React.PropTypes.object,
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  userActions: React.PropTypes.object,
  username: React.PropTypes.string
}

function mapStateToProps(state) {
  return {
    fetching: state.user.get('fetching') || state.account.get('fetching'),
    loggedIn: state.user.get('loggedIn'),
    loginUrl: state.ui.get('loginUrl'),
    username: state.user.get('username')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    rolesActions: bindActionCreators(rolesActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Login)));
