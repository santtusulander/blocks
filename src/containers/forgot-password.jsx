import React from 'react'
import { Button, Col, Input, Modal, Row, Tooltip } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import * as userActionCreators from '../redux/modules/user'

import IconEmail from '../components/icons/icon-email.jsx'
import CopyrightNotice from '../components/copyright-notice'

export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailActive: false,
      emailError: null,
      submitted: false
    }

    this.checkEmailActive = this.checkEmailActive.bind(this)
    this.changeField = this.changeField.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit(e) {
    e.preventDefault()
    this.setState({emailError: null})
    // TODO: API connections
    // this.props.userActions.startFetching()
    // this.props.userActions.logIn(
    //   this.state.username,
    //   this.state.password
    // ).then(action => {
    //   if(!action.error) {
    //     this.setState({submitted: true})
    //   }
    //   else {
    //     this.setState({emailError: action.payload.message})
    //   }
    // })
  }
  checkEmailActive(hasFocus) {
    return () => {
      if(hasFocus || !this.state.email) {
        this.setState({
          emailActive: hasFocus
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
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.forgotPassword.forgotPassword.text"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>

        <Modal.Body>

          {this.state.submitted ?
            <div className="login-info">
              <p><FormattedMessage id="portal.forgotPassword.instructions.text"/></p>
              <Link to={`/login`} className="btn btn-primary pull-right">
                OK
              </Link>
            </div>
            :
            <form onSubmit={this.onSubmit}>

              <div className="login-info">
                <p><FormattedMessage id="portal.forgotPassword.enterEmail.text"/></p>
              </div>

              {this.state.emailError ?
                <Tooltip id="password-not-valid" placement="top" className="input-tooltip in">
                  {this.state.emailError}
                </Tooltip>
              : null}

              <Input type="text" id="username"
                wrapperClassName={'input-addon-before has-login-label '
                  + 'login-label-email'
                  + (this.state.emailError ? ' invalid' : '')
                  + (this.state.emailActive || this.state.email ? ' active' : '')}
                addonBefore={<IconEmail/>}
                onFocus={this.checkEmailActive(true)}
                onBlur={this.checkEmailActive(false)}
                value={this.state.username}
                onChange={this.changeField('email')}/>

              <Row className="action-button-container">
                <Col xs={12}>
                  <Link to="/login" className="btn btn-outline back-to-login-btn">
                    <FormattedMessage id="portal.button.cancel"/>
                  </Link>
                  <Button type="submit"
                          bsStyle="primary"
                          disabled={this.props.fetching}>
                    {this.props.fetching ? <FormattedMessage id="portal.button.submitting"/> :
                      <FormattedMessage id="portal.button.send"/>}
                  </Button>
                </Col>
              </Row>
            </form>
          }
          <CopyrightNotice />
        </Modal.Body>
      </Modal.Dialog>

    );
  }
}

ForgotPassword.displayName = 'ForgotPassword'
ForgotPassword.propTypes = {
  fetching: React.PropTypes.bool
  // userActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    fetching: state.user.get('fetching') || state.account.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
