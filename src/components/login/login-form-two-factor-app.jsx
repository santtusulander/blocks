import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm.jsx'
import { AUTHY_APP_POLLING_INTERVAL } from '../../constants/login.js'

export class LoginFormTwoFactorApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollingIntervalId: null
    }

    this.startPulling = this.startPulling.bind(this)
    this.stopPulling = this.stopPulling.bind(this)
  }

  componentDidMount() {
    this.startPulling()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginError) {
      this.stopPulling()
    }
  }

  componentWillUnmount() {
    this.stopPulling()
  }

  startPulling() {
    var pollingIntervalId = setInterval(this.props.startAppPulling, AUTHY_APP_POLLING_INTERVAL);
    this.setState({ pollingIntervalId });
  }

  stopPulling() {
    if (this.state.pollingIntervalId !== null) {
      clearInterval(this.state.pollingIntervalId);
      this.setState({ pollingIntervalId: null });
    }
  }

  render() {
    return (
      <Modal.Dialog className="login-modal">
        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.login.2fa.verificationByApp.title"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>
        <Modal.Body className="token-inputs-group">
          <div className="token-input-info">
            { !this.props.loginError &&
              <p>
                <FormattedMessage id="portal.login.2fa.verificationByAppHint.text"
                                  values={{
                                    app: <strong><FormattedMessage id="portal.login.2fa.verificationByApp.authyApp.text" /></strong>,
                                    username: <strong>{this.props.userName}</strong>
                                  }} />
              </p>
            }
            { this.props.loginError &&
              <p>{this.props.loginError} | <FormattedMessage id="portal.login.2fa.verificationHintTryAgain.text" /></p>
            }
          </div>
          <div className="text-center">
            { !this.props.loginError &&
              <div className='token-input-info loading'><LoadingSpinnerSmall /></div>
            }
            <Link to={`/`} className="btn btn-link center-block token-trouble-btn">
              <FormattedMessage id="portal.login.2fa.goBack.text"/>
            </Link>
          </div>
        </Modal.Body>
      </Modal.Dialog>
    );
  }
}

LoginFormTwoFactorApp.displayName = "LoginFormTwoFactorApp"
LoginFormTwoFactorApp.propTypes = {
  loginError: React.PropTypes.string,
  startAppPulling: React.PropTypes.func,
  userName: React.PropTypes.string
}

export default LoginFormTwoFactorApp;
