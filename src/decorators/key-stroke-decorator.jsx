import React, { PropTypes, Component } from 'react'

export default function(WrappedModal) {
  class KeyStrokeSupport extends Component {
    constructor(props) {
      super(props)
      this.submitCalled = false
      this.handleKeyDown = this.handleKeyDown.bind(this)
      this.submit = () => {
        if (!this.submitCalled && !props.invalid) {
          props.submit()
          this.submitCalled = true
        }
      }
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
          this.submit()
          break
        case 27:
          this.props.cancel()
          break
      }
    }

    render() {
      let props = Object.assign({}, this.props)
      delete props.submit
      return (<WrappedModal submit={this.submit} {...props}/>)
    }
  }

  KeyStrokeSupport.propTypes = {
    cancel: PropTypes.func,
    invalid: PropTypes.bool,
    submit: PropTypes.func
  }

  return KeyStrokeSupport
}
