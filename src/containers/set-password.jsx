import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import { getContentUrl } from '../util/routes'

import * as userActionCreators from '../redux/modules/user'

import PasswordFields from '../components/password-fields'


export class SetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validPassword: false
    }

    this.goToLoginPage = this.goToLoginPage.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.validPassword = this.validPassword.bind(this)
  }
  goToLoginPage() {
    this.props.router.push(getContentUrl('/login', {}))
  }
  onSubmit(e) {
    e.preventDefault()
    this.setState({loginError: null})
    // TODO: API connections
    // this.props.userActions.startFetching()
    // this.props.userActions.logIn(
    //   this.state.username,
    //   this.state.password
    // ).then(action => {
    //   if(!action.error) {
    //     this.goToLoginPage()
    //   }
    //   else {
    //     this.setState({
    //       passwordError: action.payload.message
    //     })
    //   }
    // })
  }

  validPassword(password) {
    this.setState({'validPassword': password});
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
            <PasswordFields loginPassword={true} validPassword={this.validPassword} />
            <Row>
              <Col xs={12}>
                <Button type="submit" bsStyle="primary" className="pull-right"
                  disabled={this.props.fetching || !this.state.validPassword}>
                  {this.props.reset ?
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
  loggedIn: React.PropTypes.bool,
  reset: React.PropTypes.bool,
  router: React.PropTypes.object,
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
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SetPassword));
