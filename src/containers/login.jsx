import React from 'react'
import { Button, Col, Input, Modal, Row } from 'react-bootstrap'
import IconEmail from '../components/icons/icon-email.jsx'
import IconPassword from '../components/icons/icon-password.jsx'
import IconEye from '../components/icons/icon-eye.jsx'


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordVisible: false,
      usernameStatus: '',
      passwordStatus: ''
    }

    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.checkUsername = this.checkUsername.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
  }
  onSubmit() {
    console.log('form submitted')
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
            <Input type="text" ref="username" id="username"
              wrapperClassName={'input-addon-before has-login-label '
                + 'login-label-username ' + this.state.usernameStatus}
              addonBefore={<IconEmail/>}
              onFocus={this.checkUsername}
              onBlur={this.checkUsername}/>
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
              onFocus={this.checkPassword}
              onBlur={this.checkPassword}/>
            <Row>
              <Col xs={6}>
                <Input type="checkbox" label="Remember me" />
              </Col>
              <Col xs={6}>
                <Button type="submit" bsStyle="primary" className="pull-right">
                  Login
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
Login.propTypes = {}

module.exports = Login
