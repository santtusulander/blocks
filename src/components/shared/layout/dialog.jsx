import React from 'react';

class Dialog extends React.Component {
  render() {
    let className = 'configuration-dialog';
    if (this.props.className) {
      className = className + ' ' + this.props.className;
    }
    return (
      <div className={className}>
        <div className="configuration-dialog-gradient" />
        <div className="configuration-dialog-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}
Dialog.displayName = 'Dialog'
Dialog.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string
};

module.exports = Dialog;
