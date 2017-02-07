import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import classNames from 'classnames'

import keyStrokeSupport from '../decorators/key-stroke-decorator'

const modalClassDim = 'side-panel--dim'
const overlappingClass = 'side-panel--overlapping'

export const SidePanelComponent = ({ children, className, dim, overlapping, show, subTitle, subSubTitle, title }) => {

  let subTitleElements = ''
  let dialogClassName = classNames(
    'side-panel',
    className,
    dim ? modalClassDim : null,
    overlapping ? overlappingClass : null
  )

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
      <div className="side-panel__veil" />
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

SidePanelComponent.displayName = 'SidePanel'
SidePanelComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dim: PropTypes.bool,
  overlapping: PropTypes.bool,
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

export const SidePanel = keyStrokeSupport(SidePanelComponent)

export default SidePanel
