import React from 'react'
import { Button, Col, Input, Modal, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import { getContentUrl } from '../util/helpers'

import * as userActionCreators from '../redux/modules/user'
import * as accountActionCreators from '../redux/modules/account'

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
      username: '',
      usernameActive: false
    }

    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.checkUsernameActive = this.checkUsernameActive.bind(this)
    this.checkPasswordActive = this.checkPasswordActive.bind(this)
    this.changeField = this.changeField.bind(this)
    this.goToAccountPage = this.goToAccountPage.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  goToAccountPage() {
    // this.props.accountActions.startFetching()
    // this.props.accountActions.fetchAccounts('udn').then(action => {
    //   if(!action.error && action.payload.data.length) {
    //     const firstId = action.payload.data[0].id
    //     this.props.router.push(`/content/groups/udn/${firstId}`)
    //   }
    //   else {
    //     this.setState({loginError: action.payload.message})
    //   }
    // })
    this.props.router.push(getContentUrl('brand', 'udn', {}));
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
        this.goToAccountPage()
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
  render() {
    return (
      <Modal.Dialog className="login-modal">
        <Modal.Header className="login-header">
          <div className="logo-ericsson">Ericsson</div>
          <h1>Log In</h1>
          <p>Ericsson UDN Service</p>
          <div className="login-header-gradient"></div>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={this.onSubmit}>
            {this.state.loginError ?
              <div className="login-error">
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
              <Col xs={6}>
                <Input type="checkbox" label="Remember me" />
              </Col>
              <Col xs={6}>
                <Button type="submit" bsStyle="primary" className="pull-right"
                  disabled={this.props.fetching}>
                  {this.props.fetching ? 'Logging in...' : 'Login'}
                </Button>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal.Dialog>

    );
  }
}

Login.displayName = 'Login'
Login.propTypes = {
  accountActions: React.PropTypes.object,
  fetching: React.PropTypes.bool,
  loggedIn: React.PropTypes.bool,
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
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
