import React, { PropTypes } from 'react'
import { Button, OverlayTrigger, Popover } from 'react-bootstrap'

const HelpPopover = (props) => {
  const { buttonText, children, id, placement, title, trigger, rootClose = true } = props
  return (
    <OverlayTrigger rootClose={rootClose} trigger={trigger || 'click'} placement={placement || 'top'} overlay={
      <Popover id={id} title={title} className="help-popover">
        {children}
      </Popover>
    }>
      <Button bsStyle="link" className="btn-icon popover__link">{buttonText || '?'}</Button>
    </OverlayTrigger>
  )
}

HelpPopover.displayName = "HelpPopover"
HelpPopover.propTypes = {
  buttonText: PropTypes.object,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  placement: PropTypes.string,
  rootClose: PropTypes.bool,
  title: PropTypes.any,
  trigger: PropTypes.string
}

export default HelpPopover
