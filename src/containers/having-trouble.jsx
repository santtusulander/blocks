// UDNP-2218: Having Trouble page not yet supported by back-end
// In future - we will need to re-init login procedure.
import React from 'react'
import {
  Button,
  Col,
  FormGroup,
  Modal,
  Row
} from 'react-bootstrap'
import Radio from '../components/shared/form-elements/radio'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import * as userActionCreators from '../redux/modules/user'

export class HavingTrouble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formError: null,
      submitted: false,
      authType: 'sms'
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.selectNewAuthType= this.selectNewAuthType.bind(this)
  }

  onSubmit(e) {
    e.preventDefault()
    this.setState({formError: null})

    this.props.userActions.startFetching()
  }

  selectNewAuthType(event) {
    this.setState({
      authType: event.target.value
    })
  }

  render() {

    return (
      <Modal.Dialog className="login-modal">
        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.login.2fa.havingTrouble.title"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>

        <Modal.Body className="token-inputs-group">
          <form onSubmit={this.onSubmit}>
            {this.state.formError ?
              <div className="login-info">
                <p>{this.state.formError}</p>
              </div>
              : ''
            }

            <div className="login-info">
              <p><FormattedMessage id="portal.login.2fa.havingTrouble.tryThese.text"/></p>
            </div>

            <FormGroup className="having-trouble">
              <Radio inline={false}
                     value='sms'
                     checked={this.state.authType === 'sms'}
                     onChange={this.selectNewAuthType}>
                <FormattedMessage id="portal.login.2fa.havingTrouble.smsItem.text" />
              </Radio>
              <Radio inline={false}
                     value='voice'
                     checked={this.state.authType === 'voice'}
                     onChange={this.selectNewAuthType}>
                <FormattedMessage id="portal.login.2fa.havingTrouble.voiceItem.text" />
              </Radio>
              <Radio inline={false}
                     value='authySoftToken'
                     checked={this.state.authType === 'authySoftToken'}
                     onChange={this.selectNewAuthType}>
                <FormattedMessage id="portal.login.2fa.havingTrouble.authySoftToken.text" />
              </Radio>
              <Radio inline={false}
                     value='authyOneTouch'
                     checked={this.state.authType === 'authyOneTouch'}
                     onChange={this.selectNewAuthType}>
                <FormattedMessage id="portal.login.2fa.havingTrouble.authyOneTouchItem.text" />
              </Radio>
            </FormGroup>

            <div className="support-text">
              <p><FormattedMessage id="portal.login.2fa.havingTrouble.supportHelp.text" /></p>
            </div>

            <Row className="action-button-container">
              <Col xs={12}>
                <Button type="submit" bsStyle="primary" disabled={this.props.fetching}>
                  {
                    this.props.fetching ?
                    <FormattedMessage id="portal.button.submitting"/> :
                    <FormattedMessage id="portal.button.send"/>
                  }
                </Button>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal.Dialog>

    );
  }
}

HavingTrouble.displayName = 'HavingTrouble'
HavingTrouble.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HavingTrouble);
