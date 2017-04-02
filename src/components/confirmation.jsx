import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'

class Confirmation extends React.Component {
  render() {
    let className = 'confirmation-slider'
    if (this.props.className) {
      className += ' ' + this.props.className
    }
    return (
      <div className={className}>
        <div className="confirmation-content">{this.props.children}</div>
        <ButtonToolbar>
          <Button bsStyle="danger"
            className="btn-sm"
            onClick={this.props.handleCancel}>
            {this.props.cancelText ? this.props.cancelText : 'Cancel'}
          </Button>
          <Button bsStyle="danger"
            className="btn-sm"
            onClick={this.props.handleConfirm}>
            {this.props.confirmText ? this.props.confirmText : 'OK'}
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

Confirmation.displayName = 'Confirmation'
Confirmation.propTypes = {
  cancelText: React.PropTypes.string,
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  confirmText: React.PropTypes.string,
  handleCancel: React.PropTypes.func,
  handleConfirm: React.PropTypes.func
}

module.exports = Confirmation
