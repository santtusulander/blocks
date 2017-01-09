import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import classNames from 'classnames'

import keyStrokeSupport from '../decorators/key-stroke-decorator'

export const SidePanel = ({ children, className, show, subTitle, title }) => {
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
  children: PropTypes.node,
  className: PropTypes.string,
  show: PropTypes.bool,
  subTitle: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  title: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ])
}

export default keyStrokeSupport(SidePanel)
