import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

import keyStrokeSupport from '../decorators/key-stroke-decorator'

export const SidePanel = ({ cancel, cancelButton, children, className, invalid, show, submit, submitButton, submitText, subTitle, title }) => {
  let dialogClassName = classNames(
    'side-panel',
    className
  );

  return (
    <Modal show={show} dialogClassName={dialogClassName}>
      <Modal.Header>
        <h1>{title}</h1>
        {subTitle && <p>{subTitle}</p>}
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

    </Modal>
  )
}

SidePanel.displayName = 'SidePanel'
SidePanel.propTypes = {
  cancel: PropTypes.func.isRequired,
  cancelButton: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  invalid: PropTypes.bool,
  show: PropTypes.bool,
  subTitle: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  submit: PropTypes.func,
  submitButton: PropTypes.bool,
  submitText: PropTypes.string,
  title: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ])
}

export default keyStrokeSupport(SidePanel)
