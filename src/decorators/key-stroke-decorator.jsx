import React, { PropTypes, Component } from 'react'

export default function(WrappedModal) {
  class KeyStrokeSupport extends Component {

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
