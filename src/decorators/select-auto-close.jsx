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
      document.addEventListener('click', this.handleClick)
    }

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClick)
      this.props.close && this.props.close()
    }

    handleClick(event) {
      const element = this.node
      if (element && element.contains(event.target)) {
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
        }
        this.setState({ open: false })
      }
    }

    render() {
      return (<span className="select-auto-close" ref={(node) => {this.node = node}}>
        <WrappedSelect {...this.props} open={this.state.open} onItemClick={this.onItemClick} toggle={this.onToggle}/>
      </span>)
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
