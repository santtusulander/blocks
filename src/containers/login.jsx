import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as userActionCreators from '../redux/modules/user'

import LoginForm from '../components/login/login-form.jsx'
import LoginFormTwoFactorCode from '../components/login/login-form-two-factor-code.jsx'
import LoginFormTwoFactorApp from '../components/login/login-form-two-factor-app.jsx'

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      rememberUser: false,
      loginError: null,
      twoFACodeValidation: false,
      twoFAAuthyAppValidation: false,
      twoFAAuthyAppCode: null
    }

    this.onLoginPasswordSubmit = this.onLoginPasswordSubmit.bind(this)
    this.onCodeSubmit = this.onCodeSubmit.bind(this)
    this.onCodeFocus = this.onCodeFocus.bind(this)
    this.authyAppPolling = this.authyAppPolling.bind(this)
    this.saveUserName = this.saveUserName.bind(this)
  }

  componentDidMount(){
    const token = localStorage.getItem('EricssonUDNUserToken')
    const redirect = this.props.location.query.redirect
    const expiry = this.props.location.query.sessionExpired

    if (expiry) {
      // Session expired!
      return
    } else if ( redirect && token ) {
      // Token and redirect found --- trying to redirect
      //  If we have a token and a redirect is set, could be reload => set login to true
      //  and  try to go to original location where token will be checked
      this.props.userActions.setLogin(true)
      this.props.router.push(redirect)
      return
    } else if ( redirect ) {
      // No token. Login required
      // we had redirect but no token
    }
  }

  saveUserName(rememberUserChecked, username) {
    if (rememberUserChecked) {
      this.props.userActions.saveName(username)
    } else {
      this.props.userActions.saveName()
    }
  }

  onLoginPasswordSubmit(username, password, rememberUser) {
    this.setState({
      loginError: null,
      username: username,
      password: password,
      rememberUser: rememberUser
    })
    this.props.userActions.startFetching()
    this.props.userActions.logIn(username, password).then(action => {

      // In case of code 202 statring two factor auth process.
      // In case of code 200 continue auth process
      switch (action.payload.status) {
        case 200:
          this.saveUserName(rememberUser, username)
          break

        case 202:
          if (action.payload.data.code) {
            // oneTouch
            this.setState({
              twoFAAuthyAppValidation: true,
              twoFAAuthyAppCode: action.payload.data.code
            })
          } else {
            // app, sms, call
            this.setState({
              twoFACodeValidation: true
            })
          }
          break

        default:
          this.setState({loginError: action.payload.message})
          break
      }
    })
  }

  authyAppPolling() {
    this.props.userActions.startFetching()
    this.props.userActions.twoFALogInWithApp(
      this.state.username,
      this.state.twoFAAuthyAppCode
    ).then(action => {
      switch (action.payload.status) {
        case 200:
          this.saveUserName(this.state.rememberUser,
                            this.state.username)
          break

        case 202:
          // OneTouch request is still pending
          break

        default:
          this.setState({loginError: action.payload.message})
          break
      }
    })
  }

  onCodeSubmit(code, codeInputs) {
    this.setState({
      loginError: null
    })
    this.props.userActions.startFetching()
    this.props.userActions.twoFALogInWithCode(
      this.state.username, code
    ).then(action => {
      if (!action.error) {
        this.saveUserName(this.state.rememberUser,
                          this.state.username)
      } else {
        // Clear inputs values on error.
        codeInputs.forEach((input) => {
          input.value = ''
        })

        this.setState({
          loginError: action.payload.message
        })
      }
    })
  }

  onCodeFocus() {
    // Clear error on token fields focus
    this.setState({
      loginError: null
    })
  }

  render() {
    const loginForm = (
      <LoginForm
        userName={this.props.username}
        onSubmit={this.onLoginPasswordSubmit}
        sessionExpired={this.props.location.query.sessionExpired}
        loginError={this.state.loginError}
        fetching={this.props.fetching}
      />
    )

    const twoFAByCodeLoginForm = (
      <LoginFormTwoFactorCode
        onSubmit={this.onCodeSubmit}
        onFocus={this.onCodeFocus}
        loginError={this.state.loginError}
        fetching={this.props.fetching}
      />
    )

    const twoFAByAppLoginForm = (
      <LoginFormTwoFactorApp
        userName={this.state.username}
        loginError={this.state.loginError}
        startAppPulling={this.authyAppPolling}
      />
    )

    const renderForm = () => {
      if (this.state.twoFACodeValidation) {
        return twoFAByCodeLoginForm
      } else if (this.state.twoFAAuthyAppValidation) {
        return twoFAByAppLoginForm
      } else {
        return loginForm
      }
    }

    return (
      renderForm()
    )
  }
}

Login.displayName = 'Login'
Login.propTypes = {
  fetching: React.PropTypes.bool,
  location: React.PropTypes.object,
  router: React.PropTypes.object,
  userActions: React.PropTypes.object,
  username: React.PropTypes.string
}

function mapStateToProps(state) {
  return {
    fetching: state.user && state.user.get('fetching') || state.account && state.account.get('fetching'),
    username: state.user.get('username') || localStorage.getItem('EricssonUDNUserName') || null
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
