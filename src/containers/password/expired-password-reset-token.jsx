import React from 'react'
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  InputGroup,
  Modal,
  Row,
  Tooltip
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import * as userActionCreators from '../../redux/modules/user'

import IconEmail from '../../components/icons/icon-email.jsx'
import { isValidEmail } from '../../util/validators'


export class ExpiredPasswordResetToken extends React.Component {
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
      if(!hasFocus){
        this.setState({
          emailError: !isValidEmail(this.state.email) ? <FormattedMessage id="portal.common.error.invalid.email.text"/> : null
        })
      }
      if(hasFocus || !this.state.email) {
        this.setState({
          emailActive: hasFocus,
          emailError: null
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

    const disableSubmit = this.props.fetching || !isValidEmail(this.state.email)

    return (
      <Modal.Dialog className="login-modal">
        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.linkExpired.title"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>

        <Modal.Body>

          {this.state.submitted ?
            <Row className="login-info">
              <p><FormattedMessage id="portal.linkExpired.submitted.text"/></p>
              <Link to={`/login`} className="btn btn-primary pull-right">
                <FormattedMessage id="portal.common.button.ok"/>
              </Link>
            </Row>
            :
            <form onSubmit={this.onSubmit}>

              <div className="login-info">
                <p><FormattedMessage id="portal.linkExpired.definition.text"/><br/>
                  <FormattedMessage id="portal.linkExpired.instructions.text"/>
                </p>
              </div>

              {this.state.emailError ?
                <Tooltip id="email-not-valid" placement="top" className="input-tooltip in">
                  {this.state.emailError}
                </Tooltip>
              : null}

              <FormGroup className={'input-addon-before has-login-label '
              + 'login-label-email'
              + (this.state.emailError ? ' invalid' : '')
              + (this.state.emailActive || this.state.email ? ' active' : '')}>
                <InputGroup>
                  <InputGroup.Addon><IconEmail/></InputGroup.Addon>
                  <FormControl
                    type="text"
                    id="username"
                    onFocus={this.checkEmailActive(true)}
                    onBlur={this.checkEmailActive(false)}
                    value={this.state.username}
                    onChange={this.changeField('email')}/>
                </InputGroup>
              </FormGroup>

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

ExpiredPasswordResetToken.displayName = 'ExpiredPasswordResetToken'
ExpiredPasswordResetToken.propTypes = {
  fetching: React.PropTypes.bool
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ExpiredPasswordResetToken));
