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
      const { submit, cancel, invalid, verifyDelete } = this.props
      if (!submit) {
        return cancel()
      }

      if (!this.submitCalled && (!verifyDelete || (verifyDelete && !invalid))) {
        submit()
        this.submitCalled = true
      }
    }

    handleKeyDown(e) {
      switch(e.keyCode) {
        case 13:
          if (this.props.submit) {
            e.preventDefault()
            this.submit()
          }
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

  KeyStrokeSupport.displayName = "KeyStrokeSupport"
  KeyStrokeSupport.propTypes = {
    cancel: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    submit: PropTypes.func,
    verifyDelete: PropTypes.bool
  }

  return KeyStrokeSupport
}
