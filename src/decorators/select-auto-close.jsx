/* eslint-disable react/no-find-dom-node */
// It is acceptible to use ReactDOM.findDOMNode, since it is not deprecated.
// react/no-find-dom-node is designed to avoid use of React.findDOMNode and
// Component.getDOMNode

import { findDOMNode } from 'react-dom'
import React, { PropTypes, Component } from 'react'

export default function(WrappedSelect) {
  class AutoClose extends Component {
    constructor(props) {
      super(props)
      this.state = {
        open: false
      }
      this.close = this.close.bind(this)
      this.handleClick = this.handleClick.bind(this)
      this.onItemClick = this.onItemClick.bind(this)
      this.onToggle = this.onToggle.bind(this)
    }

    componentDidMount() {
      findDOMNode(this.node).addEventListener('click', this.handleClick, false)
    }

    componentWillUnmount() {
      findDOMNode(this.node).removeEventListener('click', this.handleClick, false)
      this.props.close && this.props.close()
    }

    handleClick(e) {
      const node = findDOMNode(this.node)
      if (node && node.contains(e.target)) {
        return
      }
      this.close()
    }

    onItemClick(value) {
      const { onItemClick } = this.props
      if (onItemClick) {
        onItemClick(value)
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
        } else {
          this.setState({ open: false })
        }
      }
    }

    render() {
      return (
        <span ref={(node) => {this.node = node}}>
          <WrappedSelect {...this.props} onItemClick={this.onItemClick} toggle={this.onToggle}/>
        </span>
      )
    }
  }

  AutoClose.displayName = WrappedSelect.displayName ? `autoClose(${WrappedSelect.displayName})` : 'AutoClose'
  AutoClose.propTypes = {
    close: PropTypes.func,
    onItemClick: PropTypes.func,
    open: PropTypes.bool,
    toggle: PropTypes.func
  }
  AutoClose.defaultProps = {
    open: false
  }

  return AutoClose
}
