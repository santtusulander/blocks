import React from 'react'
import {
  Modal,
  Tabs,
  Tab,
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import ExportEmailForm from './export-email-form.jsx'
import ExportPdfForm from './export-pdf-form.jsx'

const ExportPanel = (props) => {
  return (
    <Modal show={true}
           onHide={props.onCancel}
           dialogClassName="export-sidebar">
      <Modal.Header>
        <h1>Export</h1>
        <p>Traffic overview report</p>
      </Modal.Header>
      <Modal.Body>
        <Tabs id='exportTabs' defaultActiveKey={props.activeTab} className="export-panel-tabs">
          <Tab eventKey={1} title="Download file">
            <ExportPdfForm onDownload={props.onDownload} onCancel={props.onCancel} />
          </Tab>

          <Tab eventKey={2} title="Send email" disabled={false}>
            <ExportEmailForm onSend={props.onSend} onCancel={props.onCancel} />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  )
}

ExportPanel.propTypes = {
  onDownload: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onOnSend: React.PropTypes.func,
  activeTab: React.PropTypes.number,
}

module.exports = ExportPanel
