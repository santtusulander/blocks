import React, { Component } from 'react'
import { FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm.jsx'
import { TWO_FA_CODE_INPUT_FIELD_NAMES,
         TWO_FA_CODE_INPUT_FIELD_MAX_LENGTH } from '../../constants/login.js'

export class LoginFormTwoFactorCode extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
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
    if (currentLength >= TWO_FA_CODE_INPUT_FIELD_MAX_LENGTH) {
      const next = target.nextElementSibling;

      // Verify all inputs
      for (let inputIndex = 0; inputIndex < codeInputs.length; inputIndex++) {
        const inputValue = codeInputs[inputIndex].value
        if (inputValue.length === TWO_FA_CODE_INPUT_FIELD_MAX_LENGTH) {
          code += inputValue
        }
      }

      // If all inputs has a value, parse those value and submit token
      if (code.length === codeInputs.length) {
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
          if (TWO_FA_CODE_INPUT_FIELD_MAX_LENGTH > codeInputs[i].value.length) {
            codeInputs[i].focus()
            codeInputs[i].select()
            break;
          }
        }
      }
    }

    this.props.onCodeChange()
  }

  onKeyPress(e) {
    const charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault()
    }
  }

  onKeyDown(e) {
    const charCode = (e.which) ? e.which : e.keyCode;
    const prevElem = e.target.previousElementSibling

    // Focus previos element when backspace or delete key is pressed
    // but only when current is empty
    if (((charCode === 46) || (charCode === 8)) && (prevElem !== null)) {
      if (!e.target.value) {
        prevElem.value = ''
        prevElem.focus()
      }
    }
  }

  onClick(e) {
    e.target.select()
  }

  render() {
    const tokenInputs = TWO_FA_CODE_INPUT_FIELD_NAMES.map((id, index) => {
      return (
        <FormControl
          type="text"
          key={id}
          id={id}
          maxLength={TWO_FA_CODE_INPUT_FIELD_MAX_LENGTH}
          onClick={this.onClick}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
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
      <Modal.Dialog className="login-modal">
        <Modal.Header className="login-header">
          <div className="login-header-gradient" />
          <h1>
            <div className="logo-ericsson"><FormattedMessage id="portal.login.logo.text"/></div>
            <FormattedMessage id="portal.login.2fa.verificationByCode.title"/>
          </h1>
          <p className="login-subtitle"><FormattedMessage id="portal.login.subtitle"/></p>
        </Modal.Header>
        <Modal.Body className="token-inputs-group">
          <form>
            <FormGroup>
              <div className="token-input-info">
                { (this.props.loginError === null) &&
                  <p><FormattedMessage id="portal.login.2fa.verificationByCodeHint.text"/></p>
                }
                { this.props.loginError &&
                  <p>{this.props.loginError} | <FormattedMessage id="portal.login.2fa.verificationHintReEnter.text"/></p>
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
                <Link to={`/`} className="btn btn-link center-block token-trouble-btn">
                  <FormattedMessage id="portal.login.2fa.goBack.text"/>
                </Link>
              }
            </div>
          </form>
        </Modal.Body>
      </Modal.Dialog>
    );
  }
}

LoginFormTwoFactorCode.displayName = "LoginFormTwoFactorCode"
LoginFormTwoFactorCode.propTypes = {
  fetching: React.PropTypes.bool,
  loginError: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
  onCodeChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func
}

export default LoginFormTwoFactorCode;
