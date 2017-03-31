// The code that follows is an adapted version of react-google-recaptcha
// Original code produced by dozisch
// https://github.com/dozoisch/react-google-recaptcha
// License: MIT
//
// Changes:
//  - adapted to ES6 syntax
//  - combined into one file
//  - satisfy linter

import React, { PropTypes } from 'react'
import makeAsyncScriptLoader from 'react-async-script'

export class ReCAPTCHA extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.handleExpired = this.handleExpired.bind(this)
    this.getValue = this.getValue.bind(this)
    this.reset = this.reset.bind(this)
    this.explicitRender = this.explicitRender.bind(this)
  }

  componentDidMount() {
    this.explicitRender()
  }

  componentDidUpdate() {
    this.explicitRender()
  }

  getValue() {
    if (this.props.grecaptcha && this.state.widgetId !== undefined) {
      return this.props.grecaptcha.getResponse(this.state.widgetId)
    }
    return null
  }

  reset() {
    if (this.props.grecaptcha && this.state.widgetId !== undefined) {
      this.props.grecaptcha.reset(this.state.widgetId)
    }
  }

  handleExpired() {
    if (this.props.onExpired) {
      this.props.onExpired();
    } else if (this.props.onChange) {
      this.props.onChange(null);
    }
  }

  explicitRender(cb) {
    if (this.props.grecaptcha && this.state.widgetId === undefined) {
      const id = this.props.grecaptcha.render(this.refs.captcha, {
        sitekey: this.props.sitekey,
        callback: this.props.onChange,
        theme: this.props.theme,
        type: this.props.type,
        tabindex: this.props.tabindex,
        "expired-callback": this.handleExpired,
        size: this.props.size,
        stoken: this.props.stoken
      })
      this.setState({
        widgetId: id
      }, cb)
    }
  }

  render() {
    // consume properties owned by the reCATPCHA, pass the rest to the div so the user can style it.
    /* eslint-disable no-unused-vars */
    const { sitekey, onChange, theme, type, tabindex, onExpired, size, stoken, grecaptcha, ...childProps } = this.props;
    /* eslint-enable no-unused-vars */
    return (
      <div {...childProps} ref="captcha" />
    )
  }
}

ReCAPTCHA.displayName = 'reCAPTCHA'
ReCAPTCHA.propTypes = {
  grecaptcha: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onExpired: PropTypes.func,
  sitekey: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["compact", "normal"]),
  stoken: PropTypes.string,
  tabindex: PropTypes.number,
  theme: PropTypes.oneOf(["dark", "light"]),
  type: PropTypes.oneOf(["image", "audio"])
}
ReCAPTCHA.defaultProps = {
  size: "normal",
  tabindex: 0,
  theme: "light",
  type: "image"
}

const callbackName = 'onloadcallback'
const lang = typeof window !== "undefined" && (window.recaptchaOptions && window.recaptchaOptions.lang) ?
  "&hl=" + window.recaptchaOptions.lang :
	"";
const URL = `https://www.google.com/recaptcha/api.js?onload=${callbackName}&render=explicit${lang}`;
const globalName = 'grecaptcha'

export default makeAsyncScriptLoader(ReCAPTCHA, URL, {
  callbackName,
  globalName,
  exposeFuncs: ["getValue", "reset"]
})
