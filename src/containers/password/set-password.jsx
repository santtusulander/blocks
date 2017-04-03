import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import * as userActionCreators from '../../redux/modules/user'

import PasswordFields from '../../components/password-fields'


export class SetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reset: props.route.path.indexOf('reset') !== -1,
      password: null,
      validPassword: false
    }

    this.checkTokenValidity = this.checkTokenValidity.bind(this)
    this.goToLoginPage = this.goToLoginPage.bind(this)
    this.goToResetTokenExpiredPage = this.goToResetTokenExpiredPage.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
  }

  componentDidMount() {
    if (!this.props.params.token || !this.props.location.query.email) {
      this.goToLoginPage()
    }

    this.checkTokenValidity()
  }

  checkTokenValidity() {
    this.props.userActions.startFetching()

    this.props.userActions.getTokenInfo(
      this.props.location.query.email,
      this.props.params.token
    ).then(action => {
      if (action.error) {
        return this.goToResetTokenExpiredPage()
      }
    })
  }

  goToLoginPage() {
    this.props.router.push('/login')
  }

  goToResetTokenExpiredPage() {
    this.props.router.push({
      pathname: '/forgot-password',
      query: { 'token_expired': null }
    })
  }

  onSubmit(e) {
    e.preventDefault()
    this.setState({loginError: null})

    this.props.userActions.startFetching()
    this.props.userActions
      .resetPassword(
        this.props.location.query.email,
        this.state.password,
        this.props.params.token
      ).then(action => {
        if (!action.error) {
          this.goToLoginPage()
        }        else {
          this.goToResetTokenExpiredPage()
        }
      })
  }

  changePassword(isPasswordValid) {
    this.setState({
      validPassword: isPasswordValid
    });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  render() {
    return (
      <Modal.Dialog className="login-modal">

        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            {this.state.reset ? <FormattedMessage id="portal.login.resetPassword.title"/> : <FormattedMessage id="portal.login.setPassword.title"/>}
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={this.onSubmit}>
            {this.state.formError ?
              <div className="login-info">
                <p>{this.state.formError}</p>
              </div>
              : ''
            }

            <PasswordFields
              ref="passwordFields"
              required={true}
              stackedPassword={true}
              changePassword={this.changePassword}
              onChange={this.handlePasswordChange}
            />
            <Row>
              <Col xs={12}>
                <Button type="submit" bsStyle="primary" className="pull-right"
                  disabled={this.props.fetching || !this.state.validPassword}>
                  {this.state.reset ?
                    this.props.fetching ? <FormattedMessage id="portal.button.resetting"/> : <FormattedMessage id="portal.button.reset"/>
                  : this.props.fetching ? <FormattedMessage id="portal.button.setting"/> : <FormattedMessage id="portal.button.set"/>}
                </Button>
              </Col>
            </Row>

          </form>
        </Modal.Body>

      </Modal.Dialog>
    );
  }
}

SetPassword.displayName = 'SetPassword'
SetPassword.propTypes = {
  fetching: React.PropTypes.bool,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      email: React.PropTypes.string
    })
  }),
  params: React.PropTypes.shape({
    token: React.PropTypes.string
  }),
  route: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SetPassword));
