import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import classNames from 'classnames'

import keyStrokeSupport from '../decorators/key-stroke-decorator'

export const SidePanel = ({ children, className, show, subTitle, subSubTitle, title, disabled }) => {
  let subTitleElements = ''
  let dialogClassName = classNames(
    'side-panel',
    { 'disabled' : disabled },
    className
  );

  if (subTitle && subSubTitle) {
    subTitleElements = (
      <div className="sub-title-two-line">
        <div className="sub-title">{subTitle}</div>
        <div className="sub-sub-title">
          {subSubTitle}
        </div>
      </div>
    )
  } else if (subTitle) {
    subTitleElements = <p>{subTitle}</p>
  }

  return (
    <Modal show={show} dialogClassName={dialogClassName}>
      <Modal.Header>
        <h1>{title}</h1>
        {subTitleElements}
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
  subSubTitle: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
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
