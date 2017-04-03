import React, { PropTypes } from 'react';

class Toggle extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    e.stopPropagation()
    if (this.props.readonly) {return}
    this.props.changeValue(!this.props.value)
  }

  render() {
    let className = 'toggle'
    if (this.props.value) {
      className = `${className} on`
    }
    if (this.props.readonly) {
      className = `${className} readonly`
    }
    if (this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <div className={className} onClick={this.handleChange}>
        <div className="indicator"/>
        <div className="on-text">{this.props.onText}</div>
        <div className="off-text">{this.props.offText}</div>
      </div>
    )
  }
}

Toggle.displayName = 'Toggle'
Toggle.propTypes = {
  changeValue: PropTypes.func,
  className: PropTypes.string,
  offText: PropTypes.string,
  onText: PropTypes.string,
  readonly: PropTypes.bool,
  value: PropTypes.bool
}
Toggle.defaultProps = {
  offText: 'NO',
  onText: 'YES',
  changeValue: () => {
    // no-op
  }
}

export default Toggle
