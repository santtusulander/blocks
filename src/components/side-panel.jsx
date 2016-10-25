import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import keyStrokeSupport from '../decorators/key-stroke-decorator'

export const SidePanel = ({ cancel, cancelButton, children, className, invalid, show, submit, submitButton, submitText, subTitle, title }) => {
  let dialogClassName = 'side-panel';
  if(className) {
    dialogClassName = dialogClassName + ' ' + className
  }

  return (
    <Modal show={show} dialogClassName={dialogClassName}>
      <Modal.Header>
        <h1>{title}</h1>
        {subTitle && <p>{subTitle}</p>}
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>
        <ButtonToolbar className="pull-right">
          {cancelButton &&
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={cancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>}

          {submitButton &&
          <Button
            bsStyle="primary"
            onClick={submit}
            disabled={invalid}>
            {submitText || <FormattedMessage id="portal.button.add" />}
          </Button>}
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  )
}

SidePanel.displayName = 'SidePanel'
SidePanel.propTypes = {
  cancel: PropTypes.func,
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
