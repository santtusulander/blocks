import React from 'react'
import { Modal } from 'react-bootstrap'

const ExportPanel = (props) => {
  return (
    <Modal show={true}
           onHide={props.onHide}
           dialogClassName="configuration-sidebar">
      <Modal.Header>
        <h1>Export</h1>
        <p>
          Traffic overview report
        </p>
      </Modal.Header>
      <Modal.Body>
        <p>Export body</p>
      </Modal.Body>
    </Modal>
  )
}

ExportPanel.propTypes = {
  onHide: React.PropTypes.func
}

module.exports = ExportPanel
