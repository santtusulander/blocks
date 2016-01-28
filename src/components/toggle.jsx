import React from 'react';

class Toggle extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
  }
  handleChange() {
    this.props.changeValue(!this.props.value)
  }
  render() {
    let className = 'toggle'
    if(this.props.value) {
      className = `${className} on`
    }
    return (
      <div className={className} onClick={this.handleChange}>
        <div className="indicator"/>
        <div className="off-text">OFF</div>
        <div className="on-text">ON</div>
      </div>
    );
  }
}
Toggle.displayName = 'Toggle'
Toggle.propTypes = {
  changeValue: React.PropTypes.func,
  children: React.PropTypes.node,
  value: React.PropTypes.bool
};

module.exports = Toggle
