import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'

const SidePanel = ({ children, show, subTitle, title }) => {
  return (
    <Modal show={show} dialogClassName="side-panel">
      <Modal.Header>
        <h1>{title}</h1>
        {subTitle && <p>{subTitle}</p>}
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>

      </Modal.Footer>
    </Modal>
  )
}

SidePanel.displayName = 'SidePanel'
SidePanel.propTypes = {
  children: PropTypes.node,
  intl: React.PropTypes.object,
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

export default SidePanel
