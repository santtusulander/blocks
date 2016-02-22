import React from 'react'
import { Button, Col, Input, Modal, Row, Alert } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import History from 'history'

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
      passwordStatus: '',
      passwordVisible: false,
      username: '',
      usernameStatus: ''
    }

    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.checkUsername = this.checkUsername.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.changeField = this.changeField.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit(e) {
    e.preventDefault()
    this.setState({loginError: null})
    this.props.userActions.startFetching()
    this.props.userActions.logIn(
      this.state.username,
      this.state.password
    ).then((action) => {
      if(!action.error) {
        this.props.history.pushState(null, '/')
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
  checkUsername() {
    if(!this.refs.username.refs.input.value) {
      let status = !this.state.usernameStatus ? 'active' : ''
      this.setState({
        usernameStatus: status
      })
    }
  }
  checkPassword() {
    if(!this.refs.password.refs.input.value) {
      let status = !this.state.passwordStatus ? 'active' : ''
      this.setState({
        passwordStatus: status
      })
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
              <Alert bsStyle="danger">
                {this.state.loginError}
              </Alert>
              : ''
            }
            <Input type="text" ref="username" id="username"
              wrapperClassName={'input-addon-before has-login-label '
                + 'login-label-username ' + this.state.usernameStatus}
              addonBefore={<IconEmail/>}
              value={this.state.username}
              onFocus={this.checkUsername}
              onBlur={this.checkUsername}
              onChange={this.changeField('username')}/>
            <Input ref="password" id="password"
              type={this.state.passwordVisible ? 'text' : 'password'}
              wrapperClassName={'input-addon-before input-addon-after-outside '
                + 'has-login-label login-label-password '
                + this.state.passwordStatus}
              addonBefore={<IconPassword/>} addonAfter={
                <a className={'input-addon-link' +
                  (this.state.passwordVisible ? ' active' : '')}
                  onClick={this.togglePasswordVisibility}>
                    <IconEye/>
                </a>}
              value={this.state.password}
              onFocus={this.checkPassword}
              onBlur={this.checkPassword}
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
  fetching: React.PropTypes.bool,
  history: React.PropTypes.object,
  userActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    fetching: state.user.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
