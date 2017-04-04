import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'

import * as userActionCreators from '../../redux/modules/user'

import { getUserName, getUITheme } from '../../util/local-storage'
import { changeTheme } from '../../redux/modules/ui'

import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm.jsx'

import { RECOVERY_KEY_INPUT_FIELD_NAMES, RECOVERY_KEY_INPUT_FIELD_MAX_LENGTH } from '../../constants/login.js'

export class LoginFormRecoveryKey extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.fetching !== nextProps.fetching) {
      return true
    } else if (this.props.loginError !== nextProps.loginError) {
      return true
    } else {
      return false
    }
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
        this.props.onSubmit(code, codeInputs)
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

    this.props.onCodeChange()
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

  onCodeSubmit(code, codeInputs) {
    this.setState({
      loginError: null
    })
    this.props.userActions.startFetching()
    this.props.userActions.twoFALogInWithRecoveryKey(
      this.state.username, code
    ).then(action => {
      if (!action.error) {
        this.saveUserName(this.state.rememberUser, this.state.username)
        //Need to set correct theme to redux store after it has been destroyed
        this.props.setUiTheme()
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

    const codeInputsClass = classnames(
      {
        'invalid': this.props.loginError !== null
      }
    )

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
                { (this.props.loginError === null) &&
                  <p><FormattedMessage id="portal.login.2fa.recoveryKeyHint.text"/></p>
                }
                { this.props.loginError &&
                  <p>{this.props.loginError} | <FormattedMessage id="portal.login.2fa.recoveryKeyHintReEnter.text"/></p>
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

LoginFormRecoveryKey.displayName = "LoginFormRecoveryKey"
LoginFormRecoveryKey.propTypes = {
  fetching: React.PropTypes.bool,
  loginError: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
  onCodeChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  setUiTheme: React.PropTypes.func,
  userActions: React.PropTypes.object,
  username: React.PropTypes.string
}

function mapStateToProps(state) {
  return {
    fetching: state.user && state.user.get('fetching') || state.account && state.account.get('fetching'),
    username: state.user.get('username') || getUserName() || null,
    bannerNotification: state.ui.get('bannerNotification')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUiTheme: () => dispatch(changeTheme(getUITheme())),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormRecoveryKey)
