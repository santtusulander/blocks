import React, { PropTypes, Component } from 'react'

export default function(WrappedModal) {
  class KeyStrokeSupport extends Component {
    constructor(props) {
      super(props)
      this.submitCalled = false
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
          !this.props.invalid && !this.submitCalled && this.submit()
          break
        case 27:
          this.props.cancel()
          break
      }
    }

    render() {
      const { submit, ...props } = this.props
      const submitFunc = () => {
        if (!this.submitCalled) {
          submit()
          this.submitCalled = true
        }
      }
      return (<WrappedModal submit={submitFunc} {...props}/>)
    }
  }

  KeyStrokeSupport.propTypes = {
    cancel: PropTypes.func,
    invalid: PropTypes.bool,
    submit: PropTypes.func
  }

  return KeyStrokeSupport
}
