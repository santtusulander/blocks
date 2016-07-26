import React from 'react';

class Toggle extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
  }
  handleChange() {
    if(this.props.readonly) return
    this.props.changeValue(!this.props.value)
  }
  render() {
    let className = 'toggle'
    if(this.props.value) {
      className = `${className} on`
    }
    if(this.props.readonly) {
      className = `${className} readonly`
    }
    if(this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <div className={className} onClick={this.handleChange}>
        <div className="indicator"/>
        <div className="off-text">NO</div>
        <div className="on-text">YES</div>
      </div>
    );
  }
}
Toggle.displayName = 'Toggle'
Toggle.propTypes = {
  changeValue: React.PropTypes.func,
  className: React.PropTypes.string,
  readonly: React.PropTypes.bool,
  value: React.PropTypes.bool
};

module.exports = Toggle
