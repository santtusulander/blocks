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
    }

    componentWillMount() {
      document.addEventListener('click', this.handleClick, false)
    }

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClick, false)
      this.props.close && this.props.close()
    }

    handleClick(e) {
      // TODO: UDNP-1826, UDNP-1819
      // Ideally, we should find a way of doing this without findDOMNode, but
      // until we can update to React >0.15.x, we are limited to using findDOMNode
      // eslint-disable-next-line react/no-find-dom-node
      if (findDOMNode(this).contains(e.target)) {
        return
      }
      this.close()
    }

    close() {
      if (this.props.open || this.state.open) {
        if (this.props.close) {
          this.props.close()
        } else {
          this.setState({ open: !this.state.open })
        }
      }
    }

    render() {
      let newProps = {}
      if (this.props.open === undefined) {
        newProps.open = this.state.open
        newProps.onItemClick = value => {
          this.props.onItemClick(value)
          this.close()
        }
      }
      if (!this.props.toggle) {
        newProps.toggle = () => this.setState({ open: !this.state.open })
      }
      return (<WrappedSelect {...this.props}{...newProps}/>)
    }
  }

  AutoClose.displayName = WrappedSelect.displayName ? `autoClose(${WrappedSelect.displayName})` : 'AutoClose'
  AutoClose.propTypes = {
    close: PropTypes.func,
    onItemClick: PropTypes.func,
    open: PropTypes.bool,
    toggle: PropTypes.func
  }

  return AutoClose
}
