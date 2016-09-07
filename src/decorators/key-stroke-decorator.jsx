import React, { PropTypes, Component } from 'react'
import { once } from 'underscore'

export default function(WrappedModal) {
  class KeyStrokeSupport extends Component {
    constructor(props) {
      super(props)
      this.submitOnce = once(props.submit || props.cancel)
      this.cancelOnce = once(props.cancel)
      this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillMount() {
      document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown)
    }

    handleKeyDown(e) {
      switch(e.keyCode) {
        case 13:
          e.preventDefault()
          !this.props.invalid && this.submitOnce()
          break
        case 27: this.cancelOnce()
          break
      }
    }

    render() {
      return (<WrappedModal {...this.props}/>)
    }
  }

  KeyStrokeSupport.propTypes = {
    cancel: PropTypes.func,
    invalid: PropTypes.bool,
    submit: PropTypes.func
  }
  KeyStrokeSupport.displayName = "KeyStrokeSupport"

  return KeyStrokeSupport
}
