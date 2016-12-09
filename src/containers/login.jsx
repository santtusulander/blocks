import React from 'react'
import { Button, Col, Input, Modal, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'

import * as userActionCreators from '../redux/modules/user'

import IconEmail from '../components/icons/icon-email.jsx'
import IconPassword from '../components/icons/icon-password.jsx'
import CopyrightNotice from '../components/copyright-notice'

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginError: null,
      password: '',
      passwordActive: false,
      rememberUsername: !!props.username,
      username: props.username,
      usernameActive: false
    }

    this.checkUsernameActive = this.checkUsernameActive.bind(this)
    this.checkPasswordActive = this.checkPasswordActive.bind(this)
    this.changeField = this.changeField.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.toggleRemember = this.toggleRemember.bind(this)
  }

  componentDidMount(){
    const token = localStorage.getItem('EricssonUDNUserToken')
    const redirect = this.props.location.query.redirect
    const expiry = this.props.location.query.sessionExpired

    if (expiry) {
      /* eslint-disable no-console */
      console.log("Session expired!")
      /* eslint-enable no-console */
      return

    } else if ( redirect && token ) {
      /* eslint-disable no-console */
      console.log('Token and redirect found --- trying to redirect to:', redirect)
      /* eslint-enable no-console */
      //  If we have a token and a redirect is set, could be reload => set login to true
      //  and  try to go to original location where token will be checked
      this.props.userActions.setLogin(true)
      this.props.router.push(redirect)
      return

    } else if ( redirect ) {
      //we had redirect but no token
      /* eslint-disable no-console */
      console.log('No token. Login required.')
      /* eslint-enable no-console */

    }
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
        if(this.state.rememberUsername) {
          this.props.userActions.saveName(this.state.username)
        }
        else {
          this.props.userActions.saveName()
        }
      }
      else {
        this.setState({loginError: action.payload.message})
      }
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
    if (this.state.rememberUsername) {
      this.props.userActions.saveName()
    }

    this.setState({rememberUsername: !this.state.rememberUsername})
  }
  render() {
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

            { this.props.location.query.sessionExpired &&
              <div className="login-info">
                <p><FormattedMessage id="portal.login.sessionExpired.text" /></p>
              </div>
            }

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
              type="password"
              wrapperClassName={'input-addon-before input-addon-after-outside '
                + 'has-login-label login-label-password'
                + (this.state.passwordActive || this.state.password ? ' active' : '')}
              addonBefore={<IconPassword/>}
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

                <Link to={`/forgot-password`} className="btn btn-link pull-right">
                  <FormattedMessage id="portal.login.forgotPassword.text"/>
                </Link>
              </Col>
            </Row>
          </form>
          <CopyrightNotice />
        </Modal.Body>
      </Modal.Dialog>

    );
  }
}

Login.displayName = 'Login'
Login.propTypes = {
  fetching: React.PropTypes.bool,
  intl: React.PropTypes.object,
  location: React.PropTypes.object,
  router: React.PropTypes.object,
  userActions: React.PropTypes.object,
  username: React.PropTypes.string
}

function mapStateToProps(state) {
  return {
    fetching: state.user && state.user.get('fetching') || state.account && state.account.get('fetching'),
    username: state.user.get('username')

  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Login)));
