import React from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'

const DnsEditForm = (props) => {

  const title = props.edit ? 'Edit DNS Record' : 'New DNS Record'
  const actionButtonTitle = props.edit ? 'Save' : 'Add'

  return (
    <Modal
      show={props.show}
      onHide={props.onCancel}
      dialogClassName="dns-edit-form"
    >

      <Modal.Header>
        <h1>{ title }</h1>
        <p>Lorem ipsum dolor</p>
      </Modal.Header>

      <Modal.Body>

        <Select
          value={recordType}
          className='dns-dropdowns'
          onSelect={type => changeRecordType(type)}
          options={recordTypes.map(type => [type, type])}
        />

        <Input type='text' label='Record name' onChange={ props.changeValue } /> <span>{ props.domain }</span>

        <Input type='text' label='Target Value' onChange={ props.changeValue } />

        <Input type='text' label='TTL Value' /> <span>seconds</span>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
          <Button bsStyle="primary" onClick={props.onSave}>{ actionButtonTitle }</Button>
        </ButtonToolbar>

      </Modal.Body>

    </Modal>
  )
}

DnsEditForm.propTypes = {
  changevalue: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  edit: React.PropTypes.bool,
  show: React.PropTypes.bool
}

export default DnsEditForm
