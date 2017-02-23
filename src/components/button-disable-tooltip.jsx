import React, { PropTypes } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

const ButtonDisableTooltip = (props) => {
  const { children, disabled, tooltipMessage, tooltipId, ...rest } = props
  return (
    disabled && tooltipMessage ?
      <OverlayTrigger placement="top" overlay={
        <Tooltip id={tooltipId}>
          {tooltipMessage.title && <div className="tooltip-header">{tooltipMessage.title}</div>}
          <div className="text-sm">{tooltipMessage.text}</div>
        </Tooltip>}>
        <div className="button-disable-wrapper">
          <Button
            disabled={disabled}
            {...rest}>
            {children}
          </Button>
        </div>
      </OverlayTrigger> :
      <Button
        disabled={disabled}
        {...rest}>
        {children}
      </Button>
  )
}

ButtonDisableTooltip.displayName = "ButtonDisableTooltip"
ButtonDisableTooltip.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  tooltipId: PropTypes.string.isRequired,
  tooltipMessage: PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string.isRequired
  })
}

export default ButtonDisableTooltip
