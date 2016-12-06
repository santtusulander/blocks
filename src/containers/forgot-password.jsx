import React from 'react'
import { Button, Col, Input, Modal, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'

import * as userActionCreators from '../redux/modules/user'

import IconEmail from '../components/icons/icon-email.jsx'
import ReCAPTCHA from '../components/recaptcha'

import { FormattedMessage } from 'react-intl'


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
    this.setState({emailError: null})

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
      if(hasFocus || !this.state.email) {
        this.setState({
          emailActive: hasFocus,
          formError: null
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
    const disableSubmit = this.props.fetching || !this.state.email || !this.state.recaptcha

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

              <div className="login-info">
                <p><FormattedMessage id="portal.forgotPassword.enterEmail.text"/></p>
              </div>

              {this.state.formError ?
                <div className="login-info">
                  <p>{this.state.formError}</p>
                </div>
                : ''
              }

              <Input type="text" id="username"
                wrapperClassName={'input-addon-before has-login-label '
                  + 'login-label-email'
                  + (this.state.emailActive || this.state.email ? ' active' : '')}
                addonBefore={<IconEmail/>}
                onFocus={this.checkEmailActive(true)}
                onBlur={this.checkEmailActive(false)}
                value={this.state.username}
                onChange={this.changeField('email')}/>

              <ReCAPTCHA
                ref="recaptcha"
                className="form-group pull-right"
                onChange={recaptcha => this.setState({ recaptcha })}
                onExpired={() => this.setState({ recaptcha: '' })}
                sitekey={GOOGLE_SITE_KEY}
              />

              <Row>
                <Col xs={12}>
                  <Button type="submit" bsStyle="primary" className="pull-right"
                    disabled={disableSubmit}>
                    {this.props.fetching ? <FormattedMessage id="portal.button.submitting"/> : <FormattedMessage id="portal.button.submit"/>}
                  </Button>
                </Col>
              </Row>
            </form>
          }
        </Modal.Body>
      </Modal.Dialog>

    );
  }
}

ForgotPassword.displayName = 'ForgotPassword'
ForgotPassword.propTypes = {
  fetching: React.PropTypes.bool,
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
