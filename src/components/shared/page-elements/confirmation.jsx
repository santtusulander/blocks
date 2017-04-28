import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const Confirmation = (props) => {
  let className = 'confirmation-slider'
  if (props.className) {
    className += ' ' + props.className
  }
  return (
    <div className={className}>
      <div className="confirmation-content">{props.children}</div>
      <ButtonToolbar>
        <Button
          bsStyle="danger"
          className="btn-sm"
          onClick={props.handleCancel}>
          {props.cancelText ? props.cancelText : <FormattedMessage id="portal.button.cancel"/>}
        </Button>
        <Button
          bsStyle="danger"
          className="btn-sm"
          onClick={props.handleConfirm}>
          {props.confirmText ? props.confirmText : <FormattedMessage id="portal.button.ok"/>}
        </Button>
      </ButtonToolbar>
    </div>
  )
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

export default Confirmation
