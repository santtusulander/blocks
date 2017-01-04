import React, { PropTypes, Component } from 'react'

export default function(WrappedModal) {
  class KeyStrokeSupport extends Component {
    constructor(props) {
      super(props)
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
        case 27:
          this.props.cancel()
          break
      }
    }

    render() {
      return (<WrappedModal {...this.props}/>)
    }
  }

  KeyStrokeSupport.propTypes = {
    cancel: PropTypes.func.isRequired
  }

  return KeyStrokeSupport
}
