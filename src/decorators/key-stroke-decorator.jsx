import React, { PropTypes, Component } from 'react'

export default function(WrappedModal) {
  class KeyStrokeSupport extends Component {
    constructor(props) {
      super(props)
      this.submitCalled = false
      this.handleKeyDown = this.handleKeyDown.bind(this)
      this.submit = this.submit.bind(this)

    }

    componentWillMount() {
      document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown)
    }

    submit() {
      const { onSubmit, cancel, invalid, verifyDelete } = this.props
      if (!onSubmit) {
        return cancel()
      }

      if (!this.submitCalled && (!verifyDelete || (verifyDelete && !invalid))) {
        this.submitCalled = true
        return onSubmit()
      }
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
      delete props.onSubmit
      return (<WrappedModal onSubmit={this.submit} {...props}/>)
    }
  }

  KeyStrokeSupport.propTypes = {
    cancel: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    submit: PropTypes.func,
    verifyDelete: PropTypes.bool
  }

  return KeyStrokeSupport
}
