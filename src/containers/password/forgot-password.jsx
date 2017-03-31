import React from 'react'
import {
  Button,
  Col,
  FormGroup,
  FormControl,
  InputGroup,
  Modal,
  Row
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'

import * as userActionCreators from '../../redux/modules/user'

import IconEmail from '../../components/icons/icon-email.jsx'
import CopyrightNotice from '../../components/copyright-notice'
import ReCAPTCHA from '../../components/recaptcha'
import { isValidEmail } from '../../util/validators.js'

export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailActive: false,
      formError: null,
      recaptcha: '',
      submitted: false
    }

    this.checkEmailActive = this.checkEmailActive.bind(this)
    this.changeField = this.changeField.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(e) {
    e.preventDefault()

    this.props.userActions.startFetching()
    this.props.userActions
      .requestPasswordReset(this.state.email, this.state.recaptcha)
      .then(action => {
        if(!action.error) {
          this.setState({submitted: true})
        }
        else {
          this.setState({
            formError: action.payload.data.message || action.payload.message,
            recaptcha: ''
          })
          this.refs.recaptcha.reset()
        }
      })
  }

  checkEmailActive(hasFocus) {
    return () => {
      if (hasFocus || !this.state.email) {
        this.setState({
          emailActive: hasFocus,
          formError: null
        })
      } else {
        if (!isValidEmail(this.state.email)) {
          this.setState({
            formError: this.props.intl.formatMessage({id: 'portal.forgotPassword.emailInvalid.text'})
          })
        }
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
    const disableSubmit = this.props.fetching || !this.state.recaptcha ||
                          !!this.state.formError || !this.state.email
    const { location: { search }} = this.props
    const token_expired = search && search === '?token_expired'

    const headerText = token_expired ? <FormattedMessage id="portal.linkExpired.title"/> : <FormattedMessage id="portal.forgotPassword.forgotPassword.text"/>
    const instructionsText = token_expired ? <span><FormattedMessage id="portal.linkExpired.definition.text"/><br/> <FormattedMessage id="portal.linkExpired.instructions.text"/></span> : <FormattedMessage id="portal.forgotPassword.enterEmail.text"/>

    return (
      <Modal.Dialog className="login-modal">
        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            {headerText}
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>

        <Modal.Body>

          {this.state.submitted ?
            <div className="login-info">
              <p className="form-group"><FormattedMessage id="portal.forgotPassword.instructions.text"/></p>
              <Row>
                <Col xs={12}>
                  <Link to={`/login`} className="btn btn-primary pull-right">
                        <FormattedMessage id="portal.button.ok"/>
                  </Link>
                </Col>
              </Row>
            </div>
            :
            <form onSubmit={this.onSubmit}>

              {this.state.formError ?
                <div className="login-info">
                  <p>{this.state.formError}</p>
                </div>
                :
                <div className="login-info">
                  <p>{instructionsText}</p>
                </div>
              }

              <FormGroup
                className={'input-addon-before has-login-label '
                  + 'login-label-email'
                  + (this.state.emailActive || this.state.email ? ' active' : '')}
              >
                <InputGroup className={this.state.formError ? 'invalid' : ''}>
                  <InputGroup.Addon>
                    <IconEmail/>
                  </InputGroup.Addon>
                    <FormControl
                      type="text"
                      id="username"
                      onFocus={this.checkEmailActive(true)}
                      onBlur={this.checkEmailActive(false)}
                      value={this.state.email}
                      onChange={this.changeField('email')}/>
                </InputGroup>
              </FormGroup>

              {/*
                * NOTE: for the reCAPTCHA to work in local dev environment, you must visit the
                * portal at 127.0.0.1, not localhost. Google's site key won't work with localhost
                * unless the site key has been whitelisted for localhost.
                *
                * ALSO, the development environment expects the portal to be running on localhost,
                * not 127.0.0.1, so there may be some odd behaviors like analytics API not working.
                */}

              <ReCAPTCHA
                ref="recaptcha"
                className="form-group pull-right"
                onChange={recaptcha => this.setState({ recaptcha })}
                onExpired={() => this.setState({ recaptcha: '' })}
                sitekey={GOOGLE_SITE_KEY}
              />

              <Row className="action-button-container">
                <Col xs={12}>
                  <Link to="/login" className="btn btn-outline back-to-login-btn">
                    <FormattedMessage id="portal.button.cancel"/>
                  </Link>
                  <Button type="submit" bsStyle="primary" disabled={disableSubmit}>
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
  fetching: React.PropTypes.bool,
  intl: React.PropTypes.object,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      email: React.PropTypes.string
    })
  }),
  userActions: React.PropTypes.object
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ForgotPassword));
