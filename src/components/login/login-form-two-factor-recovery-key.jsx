import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'

import * as userActionCreators from '../../redux/modules/user'

import { getUserName, getUITheme } from '../../util/local-storage'
import { changeTheme, changeNotification } from '../../redux/modules/ui'

import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm.jsx'

import { RECOVERY_KEY_INPUT_FIELD_NAMES, RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH } from '../../constants/login.js'

export class LoginFormTwoFactorRecoveryKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginError: null
    }

    this.onClick = this.onClick.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    let code = ""
    const target = e.target
    const currentLength = target.value.length;
    const codeInputs = target.parentElement.childNodes;

    // Verify current input
    if (currentLength >= RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH) {
      const next = target.nextElementSibling;

      // Verify all inputs
      for (let inputIndex = 0; inputIndex < codeInputs.length; inputIndex++) {
        const inputValue = codeInputs[inputIndex].value
        if (inputValue.length === RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH) {
          code += inputValue
        }
      }

      // If all inputs has a value, parse those value and submit token
      if (code.length === codeInputs.length * RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH) {
        this.onSubmit(code, codeInputs)
        return
      }

      if (next !== null) {
        // Focuse on next input, and select text
        next.focus();
        next.select();
      } else {
        // Handle case when user start typing not from the first input
        // Found inputs that are empty and focus on them
        for (let i = 0; i < codeInputs.length; i++) {
          if (RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH > codeInputs[i].value.length) {
            codeInputs[i].focus()
            codeInputs[i].select()
            break;
          }
        }
      }
    }

    this.setState({ loginError: null })
  }

  onKeyDown(e) {
    const charCode = (e.which) ? e.which : e.keyCode;
    const prevElem = e.target.previousElementSibling

    // Focus previos element when backspace or delete key is pressed
    // but only when current is empty
    if (((charCode === 46) || (charCode === 8)) && (prevElem !== null)) {
      if (!e.target.value) {
        prevElem.focus()
      }
    }
  }

  onSubmit(code, codeInputs) {
    const successMessage = (
      <div>
        <div><FormattedMessage id="portal.login.2fa.recoveryKey.keyRegeneration.text"/></div>
        <Link to={`/user/udn`} className="btn-link">
          <FormattedMessage id="portal.common.goToProfileSettings"/>
        </Link>
        <FormattedMessage id="portal.common.toSaveForFutureUse"/>
      </div>
    )
    this.setState({
      loginError: null
    })
    this.props.userActions.startFetching()
    this.props.userActions.twoFALogInWithRecoveryKey(this.props.username, code)
      .then(action => {
        if (!action.error) {
          //Need to set correct theme to redux store after it has been destroyed
          this.props.setUiTheme()
          this.showNotification(successMessage)
        } else {
          // Clear inputs values on error.
          for (let inputIndex = 0; inputIndex < codeInputs.length; inputIndex++) {
            codeInputs[inputIndex].value = ''
          }
          // Focus first code input
          codeInputs[0].focus()

          this.setState({
            loginError: action.payload.message
          })
        }
      })
  }

  onClick(e) {
    e.target.select()
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.changeNotification, 10000)
  }

  render() {
    const tokenInputs = RECOVERY_KEY_INPUT_FIELD_NAMES.map((id, index) => {
      return (
        <FormControl
          type="text"
          key={id}
          id={id}
          maxLength={RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH}
          onClick={this.onClick}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          disabled={this.props.fetching}
          autoFocus={(index === 0) ? true : false} />
      )
    })

    const codeInputsClass = classnames({ 'invalid': this.state.loginError !== null })

    return (
      <Modal.Dialog className="login-modal login-recovery-modal">
        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.login.2fa.recoveryKey.title"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>
        <Modal.Body className="token-inputs-group">
          <form>
            <FormGroup>
              <div className="token-input-info">
                { (this.state.loginError === null) &&
                  <p><FormattedMessage id="portal.login.2fa.recoveryKeyHint.text"/></p>
                }
                { this.state.loginError &&
                  <p>{this.state.loginError} | <FormattedMessage id="portal.login.2fa.recoveryKeyHintReEnter.text"/></p>
                }
              </div>
              <InputGroup className={codeInputsClass}>
                <div className="token-input-xs">
                  { tokenInputs }
                </div>
              </InputGroup>
            </FormGroup>
            <div className="text-center">
              { this.props.fetching &&
                <div className='token-input-info loading'><LoadingSpinnerSmall /></div>
              }
              { !this.props.fetching &&
                <div className="having-trouble-link">
                  <FormattedMessage id="portal.login.2fa.havingTrouble.text"/>
                  <Link to={`/`} className="btn btn-link">
                    <FormattedMessage id="portal.login.2fa.tryAgain.text"/>
                  </Link>
                </div>
              }
            </div>
          </form>
        </Modal.Body>
      </Modal.Dialog>
    );
  }
}

LoginFormTwoFactorRecoveryKey.displayName = "LoginFormTwoFactorRecoveryKey"
LoginFormTwoFactorRecoveryKey.propTypes = {
  changeNotification: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  setUiTheme: React.PropTypes.func,
  userActions: React.PropTypes.object,
  username: React.PropTypes.string
}

function mapStateToProps(state) {
  return {
    fetching: state.user && state.user.get('fetching') || state.account && state.account.get('fetching'),
    username: state.user.get('username') || getUserName() || null
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeNotification: (message) => dispatch(changeNotification(message)),
    setUiTheme: () => dispatch(changeTheme(getUITheme())),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormTwoFactorRecoveryKey)
