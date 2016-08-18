import React, { PropTypes, Component } from 'react'
import { once } from 'underscore'

export default function(WrappedModal) {
  class KeyStrokeSupport extends Component {
    constructor(props) {
      super(props)
      this.submitOnce = once(props.onSubmit)
      this.cancelOnce = once(props.onCancel)
      this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillMount() {
      document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown)
    }

    handleKeyDown({ keyCode }) {
      switch(keyCode) {
        case 13: !this.props.invalid && this.submitOnce()
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
    invalid: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func
  }

  return KeyStrokeSupport
}
