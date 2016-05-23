import React from 'react'
import {
  Modal,
  Tabs,
  Tab,
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

const fileTypes = [
  {label: 'PDF', value: 'pdf'},
  {label: 'CSV', value: 'csv'},
]

const handleSubmit = (e) => {
  e.preventDefault()
}

const ExportPanel = (props) => {
  return (
    <span className='dark-theme'>
    <Modal show={true}
           onHide={props.onHide}
           dialogClassName="export-sidebar">
      <Modal.Header>
        <h1>Export</h1>
        <p>Traffic overview report</p>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey={props.activeTab} className="export-panel-tabs">
          <Tab eventKey={1} title="Download file">
            <h4>Select file type</h4>
            <form onSubmit={handleSubmit}>
              <div className="file-types">
                {fileTypes.map((fileType) => (
                  <Input key={fileType.value} type="radio" name="exportFile" label={fileType.label}
                         className="export-input-list-item"/>
                ))}
              </div>
              <ButtonToolbar>
                <Button bsStyle="primary" className="btn-outline" onClick={props.onHide}>Cancel</Button>
                <Button type="submit" bsStyle="primary">Download</Button>
              </ButtonToolbar>
            </form>
          </Tab>
          <Tab eventKey={2} title="Send email" disabled={false}>
            <Input
              label="To"
            />

            <Input
              label="Cc"
            />

            <Input
              label="Subject"
            />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
      </span>
  )
}

ExportPanel.propTypes = {
  onHide: React.PropTypes.func,
  activeTab: React.PropTypes.number,
}

module.exports = ExportPanel
