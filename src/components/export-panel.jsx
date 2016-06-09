import React from 'react'
import { Modal, Tabs, Tab } from 'react-bootstrap'

import ExportEmailForm from './export-email-form.jsx'
import { ExportFileForm } from './export-file-form.jsx'

const EXPORT_FILE_TAB = 1
const EXPORT_EMAIL_TAB = 2

const ExportPanel = (props) => {
  const activeTab = props.exportType === 'export_email' ? EXPORT_EMAIL_TAB : EXPORT_FILE_TAB;
  const panelTitle = `${props.panelTitle} ${props.panelTitle.indexOf('report') > 0 ? '' : 'report'}`

  return (
    <Modal show={props.show}
        onHide={props.onCancel}
        dialogClassName="export-sidebar"
      >

      <Modal.Header>
        <h1>Export</h1>
        <p>{panelTitle}</p>
      </Modal.Header>

      <Modal.Body>
        <Tabs id='exportTabs' defaultActiveKey={activeTab} className="export-panel-tabs">
          <Tab eventKey={EXPORT_FILE_TAB} title="Download file">
            <ExportFileForm onDownload={props.onDownload} onCancel={props.onCancel} fileType={props.exportType}/>
          </Tab>

          <Tab eventKey={EXPORT_EMAIL_TAB} title="Send email" disabled={false}>
            <ExportEmailForm onSend={props.onSend} onCancel={props.onCancel} subject={panelTitle} />
          </Tab>
        </Tabs>
      </Modal.Body>

    </Modal>
  )
}

module.exports = {
  ExportPanel,
  EXPORT_EMAIL_TAB,
  EXPORT_FILE_TAB
}

ExportPanel.propTypes = {
  exportType: React.PropTypes.string,
  onCancel: React.PropTypes.func,
  onDownload: React.PropTypes.func,
  onSend: React.PropTypes.func,
  show: React.PropTypes.bool
}
