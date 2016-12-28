import React, { PropTypes } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

const HelpTooltip = (props) => {
  const { children, id, title } = props
  return (
    <OverlayTrigger placement="top" overlay={
      <Tooltip id={id}>
        <div className="tooltip-header">{title}</div>
        <div className="text-sm">{children}</div>
      </Tooltip>
    }>
      <Button bsStyle="link" className="btn-icon">{"?"}</Button>
    </OverlayTrigger>
  )
}

HelpTooltip.displayName = "HelpTooltip"
HelpTooltip.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  title: PropTypes.object
}

export default HelpTooltip
