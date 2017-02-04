import React, { PropTypes } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

const HelpTooltip = (props) => {
  const { buttonText, children, id, placement, title } = props
  return (
    <OverlayTrigger placement={placement || 'top'} overlay={
      <Tooltip id={id}>
        <div className="tooltip-header">{title}</div>
        <div className="text-sm">{children}</div>
      </Tooltip>
    }>
      <Button bsStyle="link" className="btn-icon">{buttonText || '?'}</Button>
    </OverlayTrigger>
  )
}

HelpTooltip.displayName = "HelpTooltip"
HelpTooltip.propTypes = {
  buttonText: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  placement: PropTypes.string,
  title: PropTypes.object
}

export default HelpTooltip
