import React from 'react'
import { Modal, Tabs, Tab } from 'react-bootstrap'

import ExportEmailForm from './export-email-form.jsx'
import ExportFileForm from './export-file-form.jsx'

import { FormattedMessage, injectIntl } from 'react-intl'

export const EXPORT_FILE_TAB = 1
export const EXPORT_EMAIL_TAB = 2

const ExportPanel = (props) => {
  const activeTab = props.exportType === 'export_email' ? EXPORT_EMAIL_TAB : EXPORT_FILE_TAB;
  const panelTitle = `${props.panelTitle} ${props.panelTitle.indexOf('report') > 0 ? '' : 'report'}`

  return (
    <Modal show={props.show}
        onHide={props.onCancel}
        dialogClassName="export-sidebar"
      >

      <Modal.Header>
        <h1><FormattedMessage id="portal.exportPanel.export.text"/></h1>
        <p>{panelTitle}</p>
      </Modal.Header>

      <Modal.Body>
        <Tabs id='exportTabs' defaultActiveKey={activeTab} className="export-panel-tabs">
          <Tab eventKey={EXPORT_FILE_TAB} title={props.intl.formatMessage({id: 'portal.exportPanel.downloadFile.text'})}>
            <ExportFileForm onDownload={props.onDownload} onCancel={props.onCancel} fileType={props.exportType}/>
          </Tab>

          <Tab eventKey={EXPORT_EMAIL_TAB} title={props.intl.formatMessage({id: 'portal.exportPanel.sendEmail.text'})} disabled={false}>
            <ExportEmailForm onSend={props.onSend} onCancel={props.onCancel} subject={panelTitle} />
          </Tab>
        </Tabs>
      </Modal.Body>

    </Modal>
  )
}

export default injectIntl(ExportPanel)

ExportPanel.displayName = "ExportPanel"
ExportPanel.propTypes = {
  exportType: React.PropTypes.string,
  intl: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onDownload: React.PropTypes.func,
  onSend: React.PropTypes.func,
  panelTitle: React.PropTypes.string,
  show: React.PropTypes.bool
}
