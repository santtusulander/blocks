import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom'

export default function(WrappedSelect) {
  class AutoClose extends Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false
      }

      this.close = this.close.bind(this)
      this.handleClick = this.handleClick.bind(this)
      this.handleEntityClick = this.handleEntityClick.bind(this)
      this.onToggle = this.onToggle.bind(this)
    }

    componentDidMount() {
      document.addEventListener('click', this.handleClick)
    }

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClick)
      this.props.close && this.props.close()
    }

    handleClick(event) {
      event.stopImmediatePropagation()
      const element = findDOMNode(this)
      if (element && element.contains(event.target)) {
        return
      }
      this.close()
    }

    handleEntityClick(value) {
      const { handleEntityClick } = this.props
      if (handleEntityClick) {
        handleEntityClick(value)
      }
      this.close()
    }

    onToggle() {
      this.props.toggle && this.props.toggle()
      this.setState({ open: !this.state.open })
    }

    close() {
      if (this.props.open || this.state.open) {
        if (this.props.close) {
          this.props.close()
        }
        this.setState({ open: false })
      }
    }

    render() {
      return (
        <WrappedSelect {...this.props} open={this.state.open} handleEntityClick={this.handleEntityClick} toggle={this.onToggle}/>
      )
    }
  }

  AutoClose.displayName = WrappedSelect.displayName ? `autoClose(${WrappedSelect.displayName})` : 'AutoClose'
  AutoClose.propTypes = {
    close: PropTypes.func,
    handleEntityClick: PropTypes.func,
    open: PropTypes.bool,
    toggle: PropTypes.func
  }
  AutoClose.defaultProps = {
    open: false
  }

  return AutoClose
}
